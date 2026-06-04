require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const NodeCache = require('node-cache');
const { HttpsProxyAgent } = require('https-proxy-agent');

const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;
if (proxyUrl) {
  const originalFetch = globalThis.fetch;
  const proxyAgent = new HttpsProxyAgent(proxyUrl);
  globalThis.fetch = (resource, init = {}) => {
    const requestUrl = typeof resource === 'string' ? resource : resource.url;
    if (requestUrl && requestUrl.toString().startsWith('https:')) {
      init.agent = init.agent || proxyAgent;
    }
    return originalFetch(resource, init);
  };
  console.warn(`⚠️ Using HTTPS proxy for outbound requests: ${proxyUrl}`);
}

const app = express();
const PORT = process.env.PORT || 5000;
const MODEL = process.env.OPENROUTER_MODEL || 'google/gemma-4-26b-a4b-it:free';
// Fallback models if primary fails
const FALLBACK_MODELS = [
  'poolside/laguna-m.1:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
];
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

if (!OPENROUTER_API_KEY) {
  console.warn('⚠️ OPENROUTER_API_KEY is not set. AI-powered endpoints will fail.');
}
if (!process.env.YOUTUBE_API_KEY) {
  console.warn('⚠️ YOUTUBE_API_KEY is not set. /api/youtube will return 503.');
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.text({ limit: '10mb' }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const newsCache = new NodeCache({ stdTTL: 3600 }); // 1-hour TTL

const DEFAULT_REQUEST_TIMEOUT = 60000; // 60s — free models can be slow

// ─── Helper: Single OpenRouter request ────────────────────────────────────────
async function fetchFromOpenRouter(model, messages) {
  const payload = {
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 0.9,
  };
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3000',
      'X-Title': 'Sahayak',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(DEFAULT_REQUEST_TIMEOUT),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
  }
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  if (!content) throw new Error('Empty response from model');
  return content;
}

// ─── Helper: Call OpenRouter API (with retry + fallback models) ────────────────
async function callOpenRouter(systemPrompt, userMessage, imageBase64 = null, imageMime = null) {
  const messages = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  // If image provided, format for vision capability
  if (imageBase64 && imageMime) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: userMessage },
        { type: 'image_url', image_url: { url: `data:${imageMime};base64,${imageBase64}` } }
      ]
    });
  } else {
    messages.push({ role: 'user', content: userMessage });
  }

  // Try primary model first (up to 2 attempts), then fallbacks
  const modelsToTry = [MODEL, ...FALLBACK_MODELS];
  let lastError;

  for (const model of modelsToTry) {
    const maxAttempts = model === MODEL ? 2 : 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`[OpenRouter] Trying model: ${model} (attempt ${attempt})`);
        const content = await fetchFromOpenRouter(model, messages);
        if (model !== MODEL) console.log(`[OpenRouter] ✅ Succeeded with fallback: ${model}`);
        return content;
      } catch (err) {
        lastError = err;
        console.warn(`[OpenRouter] ❌ ${model} attempt ${attempt} failed: ${err.message}`);
        // Wait before retry (exponential backoff: 1s, 2s)
        if (attempt < maxAttempts) await new Promise(r => setTimeout(r, attempt * 1000));
      }
    }
  }

  throw lastError || new Error('All models failed');
}

// ─── System Prompts ───────────────────────────────────────────────────────────

const getSahayakSystem = (confusionLevel = 'normal', language = 'hindi') => {
  const LANG = {
    hindi:   'हमेशा सरल हिंदी (देवनागरी लिपि) में जवाब दें।',
    marathi: 'नेहमी सोप्या मराठीत उत्तर द्या.',
    tamil:   'எப்போதும் எளிய தமிழில் பதில் தரவும்.',
    bengali: 'সবসময় সহজ বাংলায় উত্তর দিন।',
    english: 'Always respond in simple English suitable for first-time smartphone users in rural India.',
  };
  const TONE = {
    normal:
      `When explaining a process or task, ALWAYS use a numbered list with each step on its OWN LINE, like this:
1. पहले यह करें।
2. फिर यह करें।
3. अब यह करें।

Each step must be on a separate line. Never put multiple steps on the same line. For short answers (1-2 sentences), no list needed.`,

    confused:
      `Use VERY simple language. Use a numbered list with each step on its OWN LINE:
1. पहला काम।
2. दूसरा काम।
3. तीसरा काम।

Include one real Indian analogy like "UPI ऐसे काम करता है जैसे आप दुकानदार को नकद देते हैं।"
NEVER put two steps on the same line.`,

    very_confused:
      `Break EVERY answer into SHORT numbered steps. EACH step MUST be on a NEW LINE. Example format:
1. पहला कदम — सिर्फ एक वाक्य।
2. दूसरा कदम — सिर्फ एक वाक्य।
3. तीसरा कदम — सिर्फ एक वाक्य।

Add encouragement like "बहुत अच्छा! 🎉" at the end. NEVER combine two steps on one line.`,
  };

  return `You are Sahayak (साहायक) — a warm, patient digital literacy companion for first-time smartphone users in rural India.

CRITICAL FORMATTING RULES — ALWAYS FOLLOW:
- When listing steps or instructions: put EACH step on its OWN LINE starting with a number (1. 2. 3.)
- NEVER write "1. Step one. 2. Step two." all on the same line
- Use line breaks between steps
- Bold important words using **word**

Language: ${LANG[language] || LANG.hindi}

Tone & Complexity:
${TONE[confusionLevel] || TONE.normal}

Safety Rules (include when relevant):
• RBI नियम: कोई भी बैंक OTP, PIN या CVV फ़ोन पर नहीं माँगता।
• NPCI नियम: UPI PIN केवल पैसे भेजते समय — पैसे मिलते समय नहीं।
• KYC नियम: कभी लिंक पर क्लिक न करें — सीधे बैंक जाएँ।

YouTube integration:
If your answer involves a how-to task, append this at the very end:
[YOUTUBE_QUERY]{"query":"UPI payment kaise kare","title":"UPI से पैसे कैसे भेजें"}[/YOUTUBE_QUERY]
Only when a tutorial video genuinely helps. Never for factual questions.`;
};

const SCAM_SYSTEM = `You are a cybersecurity expert specialising in Indian digital fraud detection.

Analyse SMS / WhatsApp messages against these RBI/NPCI rules and common Indian scam patterns:
1. Banks never ask for OTP, PIN, CVV or password via SMS / call / link.
2. KYC is only updated in person at a bank branch — never via link.
3. Lottery or prize wins never require upfront payment.
4. Urgent "your account will be blocked" threats are social engineering.
5. Requests to share your UPI ID to "receive money" are reverse-payment scams.
6. Fake job offers asking for a registration fee.
7. SIM-swap attacks asking you to forward SMS messages.
8. Investment schemes promising guaranteed high returns (>12% p.a.) are illegal.

Return ONLY a valid JSON object — no markdown, no text outside the JSON:
{
  "risk_level": "SAFE" | "SUSPICIOUS" | "DANGER",
  "confidence": <0–100>,
  "warning_signs": ["<specific warning found in message>"],
  "advice": "<practical Hindi advice — what the user should do right now>",
  "rules_violated": ["<specific RBI/NPCI rule this message breaks>"],
  "explanation": "<2–3 sentence Hindi explanation of why this verdict>"
}`;

const getScreenshotSystem = (language) => {
  const LANG = { hindi: 'Hindi', marathi: 'Marathi', tamil: 'Tamil', bengali: 'Bengali', english: 'English' };
  const lang = LANG[language] || 'Hindi';
  return `You are a visual guidance expert helping first-time smartphone users in rural India navigate mobile apps.

Analyse the screenshot carefully and produce step-by-step guidance in ${lang}.

Return ONLY a valid JSON object — no markdown, no text outside the JSON:
{
  "app_detected": "<app or screen name you see>",
  "screen_description": "<one-sentence description of what is visible>",
  "steps": [
    { "number": 1, "instruction": "<simple ${lang} instruction>", "element": "<UI element to tap/look at>" }
  ],
  "audio_script": "<natural spoken ${lang} script reading all steps aloud — suitable for text-to-speech>",
  "safety_notes": ["<any safety warning in ${lang} — e.g. never share OTP>"]
}

Rules:
- Maximum 7 steps.
- Each step must be a single short sentence.
- Use colour or shape cues: "हरे बटन पर टैप करें", "tap the blue 'Pay' button".
- If you see any OTP/PIN input field, add a safety note.`;
};

const getNewsPrompt = (category) => {
  const TOPICS = {
    upi:     'UPI payment fraud and digital payment scams in India',
    kyc:     'KYC update fraud and fake KYC scams in India',
    otp:     'OTP theft, SIM swap, and one-time-password fraud in India',
    lottery: 'lottery fraud, prize scams, and fake winning messages in India',
  };
  const topic = TOPICS[category] || 'digital fraud and cybercrime in India';
  return `Generate 5 realistic and educational news summaries about ${topic} based on common real-world incidents in India.

Return ONLY a valid JSON array — no markdown, no text outside the JSON:
[
  {
    "title": "<headline>",
    "summary": "<2–3 sentence summary in simple Hindi>",
    "category": "${(category || 'general').toUpperCase()}",
    "source": "<news outlet name>",
    "date": "<recent date>",
    "severity": "high" | "medium" | "low",
    "advice": "<one-line Hindi advice for users>"
  }
]`;
};

// ─── Helper: parse JSON from response ──────────────────────────────────
function parseJSON(text, fallback) {
  try {
    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/', (_, res) => res.send('Sahayak server running. Use /api/health or your React client on localhost:3000.'));
app.get('/api/health', (_, res) => res.json({ status: 'ok', model: MODEL, ts: new Date().toISOString() }));

// ── 1. CHAT ──────────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], confusionLevel = 'normal', language = 'hindi' } = req.body;
    if (!messages.length) return res.status(400).json({ error: 'messages array required' });

    const systemPrompt = getSahayakSystem(confusionLevel, language);
    const lastMsg = messages[messages.length - 1];
    
    const raw = await callOpenRouter(systemPrompt, lastMsg.content);

    let text = raw;
    let youtubeQuery = null;

    const ytMatch = raw.match(/\[YOUTUBE_QUERY\]([\s\S]*?)\[\/YOUTUBE_QUERY\]/);
    if (ytMatch) {
      youtubeQuery = parseJSON(ytMatch[1], null);
      text = raw.replace(/\[YOUTUBE_QUERY\][\s\S]*?\[\/YOUTUBE_QUERY\]/, '').trim();
    }

    return res.json({ text, youtubeQuery });
  } catch (err) {
    console.error('[CHAT ERROR]', err);
    let reply = 'माफ़ करें, अभी सेवा उपलब्ध नहीं है। कृपया थोड़ी देर बाद प्रयास करें।';
    
    const msg = err?.message || '';
    if (msg.includes('429') || msg.includes('Rate limit') || msg.includes('quota')) {
      reply = 'सेवा अभी अनुपलब्ध है। कृपया कुछ समय बाद पुनः प्रयास करें।';
    }

    return res.json({
      text: reply,
      youtubeQuery: null,
    });
  }
});

// ── 2. SCAM CHECKER (text + optional image OCR) ───────────────────────────────
app.post('/api/scam-check', upload.single('image'), async (req, res) => {
  try {
    const { message } = req.body;
    const hasImage = !!req.file;
    const hasText  = !!(message && message.trim());

    if (!hasImage && !hasText) {
      return res.status(400).json({ error: 'message or image required' });
    }

    let userMessage = '';
    if (hasImage && hasText) {
      userMessage = `Read ALL text visible in this screenshot (SMS, WhatsApp, notification, etc.).\n\nAdditional context from user: "${message}"\n\nThen analyse the message for scam / fraud according to your system instructions and return the JSON result.`;
    } else if (hasImage) {
      userMessage = 'Read ALL text visible in this screenshot (SMS, WhatsApp, notification, etc.).\n\nThen analyse the message for scam / fraud according to your system instructions and return the JSON result.';
    } else {
      userMessage = `Analyse this message:\n\n"${message}"`;
    }

    const b64 = hasImage ? req.file.buffer.toString('base64') : null;
    const mime = hasImage ? (req.file.mimetype || 'image/jpeg') : null;

    const raw = await callOpenRouter(SCAM_SYSTEM, userMessage, b64, mime);

    const parsed = parseJSON(raw, {
      risk_level: 'SUSPICIOUS',
      confidence: 50,
      warning_signs: ['विश्लेषण अधूरा रहा'],
      advice: 'सावधान रहें और अपने बैंक से सम्पर्क करें।',
      rules_violated: [],
      explanation: 'विश्लेषण पूर्ण नहीं हो सका।',
    });

    return res.json(parsed);
  } catch (err) {
    console.error('[SCAM]', err);
    return res.json({
      risk_level: 'SUSPICIOUS', confidence: 0,
      warning_signs: [], rules_violated: [],
      advice: 'सेवा अनुपलब्ध — कृपया 1 मिनट बाद पुनः प्रयास करें।',
      explanation: 'विश्लेषण में त्रुटि हुई।',
    });
  }
});

// ── 3. SCREENSHOT ANALYSER ───────────────────────────────────────────────────
app.post('/api/screenshot-analyze', upload.single('image'), async (req, res) => {
  try {
    const { language = 'hindi' } = req.body;
    if (!req.file) return res.status(400).json({ error: 'image file required' });

    const b64 = req.file.buffer.toString('base64');
    const mime = req.file.mimetype || 'image/jpeg';

    const systemPrompt = getScreenshotSystem(language);
    const userMessage = 'Please analyze this screenshot and provide guidance.';
    const raw = await callOpenRouter(systemPrompt, userMessage, b64, mime);

    const parsed = parseJSON(raw, {
      app_detected: 'Unknown',
      screen_description: 'Screenshot received',
      steps: [{ number: 1, instruction: 'स्क्रीनशॉट का विश्लेषण नहीं हो सका।', element: '' }],
      audio_script: 'विश्लेषण में त्रुटि।',
      safety_notes: [],
    });

    return res.json(parsed);
  } catch (err) {
    console.error('[SCREENSHOT]', err);
    return res.status(500).json({ error: 'AI service unavailable', steps: [], audio_script: '' });
  }
});

// ── 4. NEWS ──────────────────────────────────────────────────────────────────
app.get('/api/news', async (req, res) => {
  try {
    const category = (req.query.category || 'upi').toLowerCase();
    const cacheKey = `news_${category}`;
    const cached = newsCache.get(cacheKey);
    if (cached) return res.json({ articles: cached, cached: true });

    const raw = await callOpenRouter(null, getNewsPrompt(category));
    const articles = parseJSON(raw, []);

    if (articles.length) newsCache.set(cacheKey, articles);
    return res.json({ articles, cached: false });
  } catch (err) {
    console.error('[NEWS]', err);
    return res.status(500).json({ error: 'News service unavailable', articles: [] });
  }
});

// ── 5. YOUTUBE SEARCH ────────────────────────────────────────────────────────
app.get('/api/youtube', async (req, res) => {
  try {
    const { q, lang = 'hi' } = req.query;
    if (!q) return res.status(400).json({ error: 'q param required' });
    if (!process.env.YOUTUBE_API_KEY) {
      // Gracefully return empty instead of 500 so the UI doesn't break
      return res.json({ videoId: null, error: 'YouTube API key not set' });
    }

    const params = new URLSearchParams({
      part: 'snippet', q, type: 'video', maxResults: 3,
      relevanceLanguage: lang, regionCode: 'IN',
      key: process.env.YOUTUBE_API_KEY,
    });

    const r = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, {
      signal: AbortSignal.timeout(10000), // 10s for YouTube
    });

    if (!r.ok) {
      const errText = await r.text();
      console.warn(`[YOUTUBE] API returned ${r.status}: ${errText}`);
      // Return graceful empty response — UI should handle videoId: null
      return res.json({ videoId: null, error: `YouTube API error: ${r.status}` });
    }

    const data = await r.json();

    if (data.items?.length) {
      const v = data.items[0];
      return res.json({
        videoId: v.id.videoId,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails.medium?.url || v.snippet.thumbnails.default?.url,
        channelTitle: v.snippet.channelTitle,
      });
    }
    // No results — return graceful empty
    return res.json({ videoId: null, error: 'No video found' });
  } catch (err) {
    console.error('[YOUTUBE]', err.message);
    // Always return 200 with null videoId so the client doesn't show a red error
    return res.json({ videoId: null, error: 'YouTube service unavailable' });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`\n🌿 Sahayak server running → http://localhost:${PORT}`);
  console.log(`   Model : ${MODEL} (via OpenRouter)`);
  console.log(`   Client: ${process.env.CLIENT_URL || 'http://localhost:3000'}\n`);
});
