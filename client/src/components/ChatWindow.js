import { useState, useRef, useEffect, useCallback } from 'react';

// ── Markdown-lite renderer ─────────────────────────────────────────────────
// Parses bold (**text**), numbered steps (1. ...), and newlines into React elements
function formatMessage(text) {
  if (!text) return null;

  // Render inline bold: **text** → <strong>
  const renderInline = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Split text into lines
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<br key={i++} />);
      continue;
    }
    // Detect numbered step: "1. ..." or "Step 1: ..."
    const stepMatch = trimmed.match(/^(\d+)[.):]\s+(.*)/);
    if (stepMatch) {
      elements.push(
        <div key={i++} className="chat-step">
          <span className="chat-step-num">{stepMatch[1]}</span>
          <span className="chat-step-text">{renderInline(stepMatch[2])}</span>
        </div>
      );
    } else {
      elements.push(<p key={i++} className="chat-para">{renderInline(trimmed)}</p>);
    }
  }
  return elements;
}

const CONFUSION_LEVELS = [
  { id: 'normal',       label: 'सामान्य',     cls: 'confusion-normal' },
  { id: 'confused',     label: 'उलझा हुआ',   cls: 'confusion-confused' },
  { id: 'very_confused', label: 'बहुत उलझा', cls: 'confusion-very' },
];

const LANG_MAP = {
  hindi: 'hi', marathi: 'mr', tamil: 'ta', bengali: 'bn', english: 'en',
};

// BCP-47 locale codes for Web Speech API
const LANG_VOICE = {
  hindi: 'hi-IN', marathi: 'mr-IN', tamil: 'ta-IN', bengali: 'bn-IN', english: 'en-IN',
};

const CHAT_T = {
  hindi: {
    confBtns: { normal: 'सामान्य', confused: 'उलझा हुआ', very_confused: 'बहुत उलझा' },
    placeholder: 'अपना सवाल यहाँ लिखें...',
    micTitleOn: 'सुन रहा है... (रोकने के लिए क्लिक करें)',
    micTitleOff: 'बोलकर पूछें',
    speakOn: 'रोकें', speakOff: 'सुनें',
    err: 'माफ़ करें, अभी सेवा उपलब्ध नहीं है। कृपया थोड़ी देर बाद प्रयास करें।',
    suggestions: ['UPI कैसे इस्तेमाल करें?', 'KYC क्या है?']
  },
  marathi: {
    confBtns: { normal: 'सामान्य', confused: 'गोंधळलेले', very_confused: 'खूप गोंधळलेले' },
    placeholder: 'तुमचा प्रश्न इथे लिहा...',
    micTitleOn: 'ऐकत आहे... (थांबवण्यासाठी क्लिक करा)',
    micTitleOff: 'बोलून विचारा',
    speakOn: 'थांबवा', speakOff: 'ऐका',
    err: 'क्षमस्व, सध्या सेवा अनुपलब्ध आहे. कृपया थोड्या वेळाने प्रयत्न करा.',
    suggestions: ['UPI कसे वापरावे?', 'KYC म्हणजे काय?']
  },
  tamil: {
    confBtns: { normal: 'சாதாரண', confused: 'குழப்பம்', very_confused: 'மிகவும் குழப்பம்' },
    placeholder: 'உங்கள் கேள்வியை இங்கே எழுதவும்...',
    micTitleOn: 'கேட்கிறது... (நிறுத்த கிளிக் செய்யவும்)',
    micTitleOff: 'பேசி கேட்கவும்',
    speakOn: 'நிறுத்து', speakOff: 'கேட்க',
    err: 'மன்னிக்கவும், சேவை தற்போது கிடைக்கவில்லை. சிறிது நேரம் கழித்து முயற்சிக்கவும்.',
    suggestions: ['UPI ஐ எவ்வாறு பயன்படுத்துவது?', 'KYC என்றால் என்ன?']
  },
  bengali: {
    confBtns: { normal: 'স্বাভাবিক', confused: 'বিভ্রান্ত', very_confused: 'খুব বিভ্রান্ত' },
    placeholder: 'আপনার প্রশ্ন এখানে লিখুন...',
    micTitleOn: 'শুনছি... (থামাতে ক্লিক করুন)',
    micTitleOff: 'বলে জিজ্ঞাসা করুন',
    speakOn: 'থামান', speakOff: 'শুনুন',
    err: 'দুঃখিত, পরিষেবাটি বর্তমানে অনুপলব্ধ। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন.',
    suggestions: ['UPI কীভাবে ব্যবহার করবেন?', 'KYC কী?']
  },
  english: {
    confBtns: { normal: 'Normal', confused: 'Confused', very_confused: 'Very Confused' },
    placeholder: 'Type your question here...',
    micTitleOn: 'Listening... (Click to stop)',
    micTitleOff: 'Ask by voice',
    speakOn: 'Stop', speakOff: 'Listen',
    err: 'Sorry, the service is currently unavailable. Please try again later.',
    suggestions: ['How to use UPI?', 'What is KYC?']
  }
};

const INITIAL_MSG = {
  role: 'assistant',
  content: 'नमस्ते! मैं साहायक हूँ। क्या आप UPI से पैसे भेजना सीखना चाहते हैं?',
  ytCard: null,
};

export default function ChatWindow({ language, setLanguage, langs }) {
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [confusionLevel, setConfusionLevel] = useState('normal');
  const [ytCards, setYtCards] = useState({}); // msgIndex -> video data
  const [speakingIdx, setSpeakingIdx] = useState(null); // which bubble is speaking
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const t = CHAT_T[language] || CHAT_T.hindi;
  const confusion = CONFUSION_LEVELS.find(c => c.id === confusionLevel);

  const nextConfusion = () => {
    const idx = CONFUSION_LEVELS.findIndex(c => c.id === confusionLevel);
    const next = CONFUSION_LEVELS[Math.min(idx + 1, CONFUSION_LEVELS.length - 1)];
    setConfusionLevel(next.id);
  };

  useEffect(() => {
    const initialText = {
      hindi: 'नमस्ते! मैं साहायक हूँ। क्या आप UPI से पैसे भेजना सीखना चाहते हैं?',
      marathi: 'नमस्कार! मी साहायक आहे. तुम्हाला UPI ने पैसे पाठवायला शिकायचे आहे का?',
      bengali: 'নমস্কার! আমি সহায়ক। আপনি কি ইউপিআই দিয়ে টাকা পাঠাতে শিখতে চান?',
      tamil: 'வணக்கம்! நான் உங்கள் உதவியாளர். யுபிஐ மூலம் பணம் அனுப்ப கற்றுக்கொள்ள வேண்டுமா?',
      english: 'Hello! I am Sahayak, your digital companion. How can I help you today?',
    }[language] || 'नमस्ते! मैं साहायक हूँ। क्या आप UPI से पैसे भेजना सीखना चाहते हैं?';

    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant' && !prev[0].ytQuery) {
        return [{ ...prev[0], content: initialText }];
      }
      return prev;
    });
  }, [language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchYouTube = useCallback(async (query, lang, msgIndex) => {
    if (!query) return;
    try {
      const r = await fetch(`/api/youtube?q=${encodeURIComponent(query)}&lang=${LANG_MAP[lang] || 'hi'}`);
      if (r.ok) {
        const data = await r.json();
        setYtCards(prev => ({ ...prev, [msgIndex]: data }));
      }
    } catch { /* silent fail */ }
  }, []);

  const sendMessage = async (overrideText = null) => {
    const text = (overrideText || input).trim();
    if (!text || loading) return;

    if (!overrideText) setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: text }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: text }],
          confusionLevel,
          language,
        }),
      });

      const data = await res.json();
      const assistantMsg = {
        role: 'assistant',
        content: data.text || t.err,
        ytQuery: data.youtubeQuery,
      };

      setMessages(prev => {
        const updated = [...prev, assistantMsg];
        if (data.youtubeQuery?.query) {
          const idx = updated.length - 1;
          fetchYouTube(data.youtubeQuery.query, language, idx);
        }
        return updated;
      });
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t.err,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleConfusionBtn = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    nextConfusion();
    
    let simplifyMsg = `मुझे "${lastUserMsg.content}" को और सरल तरीके से समझाओ। कृपया एक भारतीय जीवन का उदाहरण दो।`;
    if (language === 'english') simplifyMsg = `Explain "${lastUserMsg.content}" more simply with a real-life Indian analogy.`;
    else if (language === 'marathi') simplifyMsg = `मला "${lastUserMsg.content}" अधिक सोप्या भाषेत समजावून सांगा. कृपया एक भारतीय जीवनाचे उदाहरण द्या.`;
    else if (language === 'bengali') simplifyMsg = `मुझे "${lastUserMsg.content}" আরও সহজভাবে বুঝিয়ে দিন। অনুগ্রহ করে একটি ভারতীয় জীবনের উদাহরণ দিন।`;
    else if (language === 'tamil') simplifyMsg = `"${lastUserMsg.content}" என்பதை மேலும் எளிமையாக விளக்கவும். நிஜ வாழ்க்கை இந்திய உதாரணத்தைக் கூறவும்.`;
    
    sendMessage(simplifyMsg);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Speech-to-Text ──────────────────────────────────────────────────────────
  const toggleListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Browser not supported.'); return; }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new SR();
    rec.lang = LANG_VOICE[language] || 'hi-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend   = () => setIsListening(false);

    rec.start();
    setIsListening(true);
  };

  // ── Text-to-Speech ──────────────────────────────────────────────────────────
  const speakText = (text, idx) => {
    if (!window.speechSynthesis) return;
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LANG_VOICE[language] || 'hi-IN';
    utt.rate = 0.9;
    utt.onend  = () => setSpeakingIdx(null);
    utt.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="chat-page">
      {/* Controls bar */}
      <div className="chat-controls">
        <div className="chat-controls-left">
          {langs.map(l => (
            <button
              key={l.id}
              className={`chat-lang-btn ${l.cls} ${language === l.id ? 'active' : ''}`}
              onClick={() => setLanguage(l.id)}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
        <button
          className={`confusion-pill ${confusion.cls}`}
          onClick={() => {
            const idx = CONFUSION_LEVELS.findIndex(c => c.id === confusionLevel);
            setConfusionLevel(CONFUSION_LEVELS[(idx + 1) % CONFUSION_LEVELS.length].id);
          }}
          title="Click to change difficulty level"
        >
          {t.confBtns[confusion.id] || confusion.label}
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages-wrapper">
        <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-row ${msg.role === 'user' ? 'user' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="chat-avatar">
                <img src="/tutor.png" alt="Sahayak" onError={e => { e.target.style.display='none'; e.target.parentNode.textContent='🌿'; }} />
              </div>
            )}
            <div>
              <div className={`chat-bubble ${msg.role === 'assistant' ? 'sahayak' : 'user'}`}>
                {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
              </div>
              {msg.role === 'assistant' && (
                <button
                  className={`speak-btn ${speakingIdx === i ? 'speaking' : ''}`}
                  onClick={() => speakText(msg.content, i)}
                  title={speakingIdx === i ? t.speakOn : t.speakOff}
                >
                  {speakingIdx === i ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  )}
                  {speakingIdx === i ? t.speakOn : t.speakOff}
                </button>
              )}
              {/* YouTube card */}
              {msg.role === 'assistant' && ytCards[i] && (
                <a
                  className="yt-card"
                  href={`https://www.youtube.com/watch?v=${ytCards[i].videoId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ytCards[i].thumbnail ? (
                    <img src={ytCards[i].thumbnail} alt="Video thumbnail" className="yt-thumbnail" />
                  ) : (
                    <div className="yt-icon">▶</div>
                  )}
                </a>
              )}
              {/* Fallback: show query title if API not configured yet */}
              {msg.role === 'assistant' && msg.ytQuery && !ytCards[i] && (
                <a
                  className="yt-card"
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(msg.ytQuery.query)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="yt-icon">▶</div>
                </a>
              )}
              {/* Suggestions for first message */}
              {i === 0 && messages.length === 1 && t.suggestions && (
                <div className="chat-suggestions" style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {t.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(sug)}
                      style={{
                        background: '#f1f8e9',
                        border: '1px solid #c5e1a5',
                        color: '#33691e',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#e8f5e9'}
                      onMouseOut={e => e.currentTarget.style.background = '#f1f8e9'}
                    >
                      ✨ {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="chat-row">
            <div className="chat-avatar">
              <img src="/tutor.png" alt="Sahayak" />
            </div>
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
        </div>
      </div>

      {/* मुझे समझ नहीं आया button */}
      {!loading && (
        <div className="confusion-action-wrap">
          <button className="confusion-action-btn" onClick={handleConfusionBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.936 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>
            {language === 'english' ? "I didn't understand" : 
             language === 'marathi' ? 'मला समजले नाही' : 
             language === 'bengali' ? 'আমি বুঝতে পারিনি' : 
             language === 'tamil' ? 'எனக்கு புரியவில்லை' : 'मुझे समझ नहीं आया'}
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="chat-input-container">
        <div className="chat-input-pill">
          <input
            ref={inputRef}
            className="chat-input-field"
            placeholder={t.placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button
            className={`chat-mic-icon-btn ${isListening ? 'active' : ''}`}
            onClick={toggleListening}
            title={isListening ? t.micTitleOn : t.micTitleOff}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </button>
          <button
            className="chat-send-icon-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            title="भेजें"
          >
            {loading ? <div className="spinner" /> : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '-2px' }}>
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
