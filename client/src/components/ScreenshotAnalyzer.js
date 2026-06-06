import { useState, useRef, useCallback } from 'react';

const SCREEN_T = {
  hindi: {
    title: '📸 विज़ुअल गाइडेंस इंजन', desc: 'स्क्रीनशॉट अपलोड करें — हम बताएंगे कहाँ टैप करना है।',
    drop: 'स्क्रीनशॉट यहाँ डालें', dropSub: 'या गैलरी से चुनने के लिए क्लिक करें',
    btnChange: 'बदलें', btnAnalyze: '🔍 स्क्रीनशॉट विश्लेषित करें', btnAnalyzing: 'विश्लेषण हो रहा है...',
    errLoad: 'विश्लेषण नहीं हो सका। कृपया पुनः प्रयास करें।',
    resDetect: '📱 पहचाना गया:', resSteps: '📋 चरण-दर-चरण मार्गदर्शन',
    audioTitle: '🎙️ ऑडियो स्क्रिप्ट', btnRead: '▶ सुनें', btnStop: '⏹ रोकें',
    placeholderTitle: '📋 चरण-दर-चरण मार्गदर्शन',
    placeholderSteps: ['उस स्क्रीन का स्क्रीनशॉट लें जिसे आप समझना चाहते हैं।', 'उपर ड्रॉप ज़ोन में डालें या चुनने के लिए क्लिक करें।', '“विश्लेषण करें” बटन दबाएं — AI आपको बताएगा।', 'परिणाम धैर्य से पढ़ें और समझें।'],
  },
  marathi: {
    title: '📸 व्हिज्युअल मार्गदर्शक', desc: 'स्क्रीनशॉट अपलोड करा — कुठे टॅप करायचे ते आम्ही सांगू.',
    drop: 'स्क्रीनशॉट इथे टाका', dropSub: 'किंवा गॅलरीमधून निवडण्यासाठी क्लिक करा',
    btnChange: 'बदला', btnAnalyze: '🔍 स्क्रीनशॉट विश्लेषण करा', btnAnalyzing: 'विश्लेषण करत आहे...',
    errLoad: 'विश्लेषण अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
    resDetect: '📱 ओळखले:', resSteps: '📋 टप्प्याटप्प्याने मार्गदर्शन',
    audioTitle: '🎙️ ऑडिओ स्क्रिप्ट', btnRead: '▶ ऐका', btnStop: '⏹ थांबवा',
    placeholderTitle: '📋 टप्प्याटप्याने मार्गदर्शन',
    placeholderSteps: ['ज्या स्क्रीन समजायची आहे तिचा स्क्रीनशॉट घ्या.', 'वरील ड्रॉप झोनमध्ये टाका किंवा निवडण्यासाठी क्लिक करा.', '“विश्लेषण करा” बटन दाबा — AI तुम्हाला सांगेल.', 'निकाल धैर्याने वाचा आणि समजा.'],
  },
  english: {
    title: '📸 Visual Guidance Engine', desc: 'Upload a screenshot — we will highlight what to tap.',
    drop: 'Drag & drop a screenshot', dropSub: 'or click to choose from gallery',
    btnChange: 'Change', btnAnalyze: '🔍 Analyze Screenshot', btnAnalyzing: 'Analyzing...',
    errLoad: 'Analysis failed. Please try again.',
    resDetect: '📱 Detected:', resSteps: '📋 Step-by-step guidance',
    audioTitle: '🎙️ Audio Script', btnRead: '▶ Read Aloud', btnStop: '⏹ Stop',
    placeholderTitle: '📋 Step-by-step guidance',
    placeholderSteps: ["Take a screenshot of the screen you need help with.", 'Drop it in the zone above or click to choose.', 'Press “Analyze Screenshot” — the AI will guide you.', 'Read the steps carefully and follow along.'],
  },
  bengali: {
    title: '📸 ভিজ্যুয়াল গাইডেন্স ইঞ্জিন', desc: 'একটি স্ক্রিনশট আপলোড করুন — কোথায় ট্যাপ করতে হবে তা আমরা জানাব।',
    drop: 'স্ক্রিনশট এখানে রাখুন', dropSub: 'বা গ্যালারি থেকে বেছে নিতে ক্লিক করুন',
    btnChange: 'পরিবর্তন', btnAnalyze: '🔍 স্ক্রিনশট বিশ্লেষণ করুন', btnAnalyzing: 'বিশ্লেষণ করা হচ্ছে...',
    errLoad: 'বিশ্লেষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    resDetect: '📱 শনাক্ত করা হয়েছে:', resSteps: '📋 ধাপে ধাপে নির্দেশনা',
    audioTitle: '🎙️ অডিও স্ক্রিপ্ট', btnRead: '▶ শুনুন', btnStop: '⏹ থামান',
    placeholderTitle: '📋 ধাপে ধাপে নির্দেশনা',
    placeholderSteps: ['যে স্ক্রিনে সাহায্য দরকার তার স্ক্রিনশট নিন।', 'উপরের জোনে দিন বা নির্বাচন করতে ক্লিক করুন।', '“বিশ্লেষণ করুন” বাটন চাপুন — AI আপনাকে গাইড করবে।', 'ফলাফল মনোযোগ দিয়ে পড়ুন ও বুঝুন।'],
  },
  tamil: {
    title: '📸 காட்சி வழிகாட்டுதல்', desc: 'ஸ்கிரீன்ஷாட்டைப் பதிவேற்றவும் — எங்கு தட்ட வேண்டும் என்பதை நாங்கள் காட்டுவோம்.',
    drop: 'ஸ்கிரீன்ஷாட்டை இங்கே விடவும்', dropSub: 'அல்லது கேலரியில் இருந்து தேர்ந்தெடுக்க கிளிக் செய்யவும்',
    btnChange: 'மாற்று', btnAnalyze: '🔍 ஸ்கிரீன்ஷாட்டை பகுப்பாய்வு செய்', btnAnalyzing: 'பகுப்பாய்வு செய்கிறது...',
    errLoad: 'பகுப்பாய்வு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    resDetect: '📱 கண்டறியப்பட்டது:', resSteps: '📋 படிப்படியான வழிகாட்டுதல்',
    audioTitle: '🎙️ ஆடியோ ஸ்கிரிப்ட்', btnRead: '▶ வாசிக்க', btnStop: '⏹ நிறுத்து',
    placeholderTitle: '📋 படிப்படியான வழிகாட்டுதல்',
    placeholderSteps: ['உதவி தேவைப்படும் திரையின் ஸ்கிரீன்ஷாட் எடுக்கவும்.', 'மேலே உள்ள பகுதியில் போடவும் அல்லது தேர்ந்தெடுக்க கிளிக் செய்யவும்.', '“பகுப்பாய்வு செய்” கும்பிடு — AI உங்களுக்கு வழிகாட்டும்.', 'படிகளை கவனமாகப் படித்து பின்பற்றவும்.'],
  }
};

export default function ScreenshotAnalyzer({ language, setLanguage, langs }) {
  const [image, setImage] = useState(null);   // { file, preview }
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const preview = URL.createObjectURL(file);
    setImage({ file, preview });
    setResult(null); setError('');
  }, []);

  const onInputChange = (e) => handleFile(e.target.files[0]);
  const onDrop = (e) => { e.preventDefault(); setDragover(false); handleFile(e.dataTransfer.files[0]); };
  const onDragOver = (e) => { e.preventDefault(); setDragover(true); };
  const onDragLeave = () => setDragover(false);

  const analyze = async () => {
    if (!image) return;
    setLoading(true); setResult(null); setError('');
    try {
      const form = new FormData();
      form.append('image', image.file);
      form.append('language', language);

      const res = await fetch('/api/screenshot-analyze', { method: 'POST', body: form });
      const data = await res.json();
      if (data.error && !data.steps) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(SCREEN_T[language]?.errLoad || SCREEN_T.hindi.errLoad);
    } finally {
      setLoading(false);
    }
  };

  const readAloud = () => {
    if (!result?.audio_script) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }

    const utter = new SpeechSynthesisUtterance(result.audio_script);
    const LANG_BCP = { hindi: 'hi-IN', marathi: 'mr-IN', tamil: 'ta-IN', bengali: 'bn-IN', english: 'en-IN' };
    utter.lang = LANG_BCP[language] || 'hi-IN';
    utter.rate = 0.88;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const t = SCREEN_T[language] || SCREEN_T.hindi;

  return (
    <div className="screenshot-page">
      <div className="page-header">
        <h1>{t.title}</h1>
        <p>{t.desc}</p>
      </div>

      {/* Language selector */}
      <div className="screenshot-lang-bar">
        {langs.map(l => (
          <button
            key={l.id}
            className={`ss-lang-btn ${l.cls} ${language === l.id ? 'active' : ''}`}
            onClick={() => setLanguage(l.id)}
          >
            {l.flag} {l.label}
          </button>
        ))}
      </div>

      {/* Upload zone or preview */}
      {!image ? (
        <div
          className={`upload-zone ${dragover ? 'dragover' : ''}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <div className="upload-icon">⬆️</div>
          <h3>{t.drop}</h3>
          <p>{t.dropSub}</p>
          <input ref={inputRef} className="upload-input" type="file" accept="image/*" onChange={onInputChange} />
        </div>
      ) : (
        <div className="upload-preview">
          <img src={image.preview} alt="Screenshot preview" />
          <button className="preview-change" onClick={() => { setImage(null); setResult(null); }}>
            {t.btnChange}
          </button>
        </div>
      )}

      {/* Analyze button */}
      {image && (
        <button className="analyze-btn" onClick={analyze} disabled={loading}>
          {loading ? <><div className="spinner" /> {t.btnAnalyzing}</> : t.btnAnalyze}
        </button>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', background: '#FFEBEE', borderRadius: 10, color: '#C62828', fontSize: 14, marginTop: 12 }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* App detected */}
          {result.app_detected && (
            <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-500)' }}>
              {t.resDetect} <strong>{result.app_detected}</strong> — {result.screen_description}
            </div>
          )}

          {/* Step-by-step */}
          <div className="steps-card">
            <div className="steps-header">
              <span>📋</span> {t.resSteps}
            </div>
            <div className="steps-list">
              {result.steps?.map((step) => (
                <div key={step.number} className="step-item">
                  <div className="step-num">{step.number}</div>
                  <div className="step-text">
                    {step.instruction}
                    {step.element && <span className="step-element">👉 {step.element}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety notes */}
          {result.safety_notes?.length > 0 && (
            <div style={{ marginTop: 12, padding: '12px 14px', background: '#FFF8E1', border: '1.5px solid #FFE082', borderRadius: 10 }}>
              {result.safety_notes.map((note, i) => (
                <p key={i} style={{ fontSize: 13.5, color: '#E65100', marginBottom: i < result.safety_notes.length - 1 ? 6 : 0 }}>
                  ⚠️ {note}
                </p>
              ))}
            </div>
          )}

          {/* Audio script */}
          {result.audio_script && (
            <div className="audio-script-card">
              <div className="audio-script-header">
                <div className="audio-title">{t.audioTitle}</div>
                <button
                  className={`read-aloud-btn ${speaking ? 'speaking' : ''}`}
                  onClick={readAloud}
                >
                  {speaking ? t.btnStop : t.btnRead}
                </button>
              </div>
              <p className="audio-script-text">{result.audio_script}</p>
            </div>
          )}
        </>
      )}

      {/* Default placeholder steps when no image */}
      {!result && !image && (
        <div className="steps-card" style={{ marginTop: 20, opacity: 0.7 }}>
          <div className="steps-header"><span>📋</span> {t.placeholderTitle || t.resSteps}</div>
          <div className="steps-list">
            {(t.placeholderSteps || []).map((s, i) => (
              <div key={i} className="step-item">
                <div className="step-num">{i + 1}</div>
                <div className="step-text">{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
