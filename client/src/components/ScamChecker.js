import { useState, useRef } from 'react';

const SAMPLES = [
  'आपका SBI खाता बंद होने वाला है! अभी KYC अपडेट करें: http://sbi-kyc-update.xyz/login पर क्लिक करें।',
  'बधाई हो! आपने ₹25 लाख का इनाम जीता है। अपना पुरस्कार प्राप्त करने के लिए ₹500 रजिस्ट्रेशन शुल्क जमा करें।',
  'आपका UPI ID: 9876543210@paytm से ₹500 की ट्रांसफर Request भेजी गई है। Approve करने के लिए PIN डालें।',
];

const RISK_LABELS = {
  SAFE:       { emoji: '✅', text: 'सुरक्षित', cls: 'risk-SAFE' },
  SUSPICIOUS: { emoji: '⚠️', text: 'संदिग्ध',  cls: 'risk-SUSPICIOUS' },
  DANGER:     { emoji: '🚨', text: 'खतरनाक',   cls: 'risk-DANGER' },
};

const SCAM_T = {
  hindi: {
    title: '🚨 घोटाला जाँच',
    desc: 'संदिग्ध SMS, WhatsApp मैसेज या स्क्रीनशॉट पेस्ट करें — हम बताएंगे असली है या धोखा।',
    tabText: 'टेक्स्ट जाँचें', tabImg: 'स्क्रीनशॉट जाँचें',
    phText: 'संदिग्ध SMS या WhatsApp मैसेज यहाँ पेस्ट करें...',
    phImg: 'कोई अतिरिक्त जानकारी? (वैकल्पिक)',
    dropTitle: 'स्क्रीनशॉट यहाँ डालें', dropSub: 'या क्लिक करके चुनें (JPG, PNG, WebP)',
    btnCheck: 'अभी जाँचें', btnChecking: 'विश्लेषण हो रहा है...',
    errLoad: 'विश्लेषण नहीं हो सका। कृपया पुनः प्रयास करें।',
    sample: 'नमूना', remove: '✕ हटाएं',
    resConf: 'विश्वास स्तर', resExpl: 'विवरण', resWarn: '⚠️ चेतावनी के संकेत',
    resRules: '📋 RBI / NPCI नियम उल्लंघन', resAdvice: '✅ क्या करें',
    help: 'संदेह है? 1930 पर कॉल करें या cybercrime.gov.in पर रिपोर्ट करें।'
  },
  marathi: {
    title: '🚨 घोटाळा तपासक',
    desc: 'संशयास्पद SMS, WhatsApp संदेश किंवा स्क्रीनशॉट पेस्ट करा — आम्ही सांगू खरे की खोटे.',
    tabText: 'मजकूर तपासा', tabImg: 'स्क्रीनशॉट तपासा',
    phText: 'संशयास्पद SMS किंवा WhatsApp संदेश येथे पेस्ट करा...',
    phImg: 'कोणतीही अतिरिक्त माहिती? (ऐच्छिक)',
    dropTitle: 'स्क्रीनशॉट येथे टाका', dropSub: 'किंवा निवडण्यासाठी क्लिक करा (JPG, PNG, WebP)',
    btnCheck: 'आता तपासा', btnChecking: 'विश्लेषण करत आहे...',
    errLoad: 'विश्लेषण अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
    sample: 'नमुना', remove: '✕ काढा',
    resConf: 'आत्मविश्वास पातळी', resExpl: 'तपशील', resWarn: '⚠️ चेतावणी चिन्हे',
    resRules: '📋 RBI / NPCI नियम उल्लंघन', resAdvice: '✅ काय करावे',
    help: 'शंका आहे? 1930 वर कॉल करा किंवा cybercrime.gov.in वर रिपोर्ट करा.'
  },
  english: {
    title: '🚨 Scam Checker',
    desc: 'Paste a suspicious SMS, WhatsApp message or screenshot — we will tell you if it is real or fake.',
    tabText: 'Check Text', tabImg: 'Check Screenshot',
    phText: 'Paste suspicious SMS or WhatsApp message here...',
    phImg: 'Any additional info? (Optional)',
    dropTitle: 'Drop screenshot here', dropSub: 'or click to choose (JPG, PNG, WebP)',
    btnCheck: 'Check Now', btnChecking: 'Analyzing...',
    errLoad: 'Analysis failed. Please try again.',
    sample: 'Sample', remove: '✕ Remove',
    resConf: 'Confidence Level', resExpl: 'Explanation', resWarn: '⚠️ Warning Signs',
    resRules: '📋 RBI / NPCI Rule Violations', resAdvice: '✅ What to do',
    help: 'Doubtful? Call 1930 or report at cybercrime.gov.in.'
  },
  bengali: {
    title: '🚨 প্রতারণা যাচাই',
    desc: 'সন্দেহজনক SMS, WhatsApp বার্তা বা স্ক্রিনশট পেস্ট করুন — আমরা বলব আসল না নকল।',
    tabText: 'টেক্সট যাচাই করুন', tabImg: 'স্ক্রিনশট যাচাই করুন',
    phText: 'সন্দেহজনক SMS বা WhatsApp বার্তা এখানে পেস্ট করুন...',
    phImg: 'কোনো অতিরিক্ত তথ্য? (ঐচ্ছিক)',
    dropTitle: 'স্ক্রিনশট এখানে রাখুন', dropSub: 'বা নির্বাচন করতে ক্লিক করুন (JPG, PNG, WebP)',
    btnCheck: 'এখনই যাচাই করুন', btnChecking: 'বিশ্লেষণ করা হচ্ছে...',
    errLoad: 'বিশ্লেষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
    sample: 'নমুনা', remove: '✕ সরান',
    resConf: 'বিশ্বাসের স্তর', resExpl: 'ব্যাখ্যা', resWarn: '⚠️ সতর্ক সংকেত',
    resRules: '📋 RBI / NPCI নিয়ম লঙ্ঘন', resAdvice: '✅ কী করবেন',
    help: 'সন্দেহ আছে? 1930 নম্বরে কল করুন বা cybercrime.gov.in-এ রিপোর্ট করুন।'
  },
  tamil: {
    title: '🚨 மோசடி சோதனை',
    desc: 'சந்தேகத்திற்குரிய SMS, WhatsApp செய்தி அல்லது ஸ்கிரீன்ஷாட்டை ஒட்டவும் — இது உண்மையா அல்லது பொய்யா என்று நாங்கள் சொல்வோம்.',
    tabText: 'உரையை சரிபார்க்கவும்', tabImg: 'ஸ்கிரீன்ஷாட்டை சரிபார்க்கவும்',
    phText: 'சந்தேகத்திற்குரிய SMS அல்லது WhatsApp செய்தியை இங்கே ஒட்டவும்...',
    phImg: 'ஏதேனும் கூடுதல் தகவல்? (விருப்பத்திற்குரியது)',
    dropTitle: 'ஸ்கிரீன்ஷாட்டை இங்கே விடவும்', dropSub: 'அல்லது தேர்ந்தெடுக்க கிளிக் செய்யவும் (JPG, PNG, WebP)',
    btnCheck: 'இப்போது சரிபார்க்கவும்', btnChecking: 'பகுப்பாய்வு செய்கிறது...',
    errLoad: 'பகுப்பாய்வு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    sample: 'மாதிரி', remove: '✕ அகற்று',
    resConf: 'நம்பிக்கை நிலை', resExpl: 'விளக்கம்', resWarn: '⚠️ எச்சரிக்கை அறிகுறிகள்',
    resRules: '📋 RBI / NPCI விதி மீறல்கள்', resAdvice: '✅ என்ன செய்ய வேண்டும்',
    help: 'சந்தேகமா? 1930-ஐ அழைக்கவும் அல்லது cybercrime.gov.in-ல் புகாரளிக்கவும்.'
  }
};

export default function ScamChecker({ language = 'hindi' }) {
  const [mode, setMode]       = useState('text'); // 'text' | 'image'
  const [text, setText]       = useState('');
  const [image, setImage]     = useState(null);   // { file, preview }
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const t = SCAM_T[language] || SCAM_T.hindi;

  const handleImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const preview = URL.createObjectURL(file);
    setImage({ file, preview });
    setResult(null);
    setError('');
  };

  const checkScam = async () => {
    if (mode === 'text' && !text.trim()) return;
    if (mode === 'image' && !image) return;

    setLoading(true); setResult(null); setError('');
    try {
      let res;
      if (mode === 'image') {
        const fd = new FormData();
        fd.append('image', image.file);
        if (text.trim()) fd.append('message', text.trim());
        res = await fetch('/api/scam-check', { method: 'POST', body: fd });
      } else {
        res = await fetch('/api/scam-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });
      }
      const data = await res.json();
      if (data.error && !data.risk_level) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(t.errLoad);
    } finally {
      setLoading(false);
    }
  };

  const riskInfo = result ? (RISK_LABELS[result.risk_level] || RISK_LABELS.SUSPICIOUS) : null;

  const canCheck = mode === 'text' ? text.trim().length > 0 : !!image;

  return (
    <div className="scam-page">
      <div className="page-header">
        <h1>{t.title}</h1>
        <p>{t.desc}</p>
      </div>

      {/* Mode tabs */}
      <div className="scam-tabs">
        <button
          className={`scam-tab ${mode === 'text' ? 'active' : ''}`}
          onClick={() => { setMode('text'); setResult(null); setError(''); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          {t.tabText}
        </button>
        <button
          className={`scam-tab ${mode === 'image' ? 'active' : ''}`}
          onClick={() => { setMode('image'); setResult(null); setError(''); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          {t.tabImg}
        </button>
      </div>

      <div className="scam-card">
        {/* TEXT MODE */}
        {mode === 'text' && (
          <>
            <textarea
              className="scam-textarea"
              placeholder={t.phText}
              value={text}
              onChange={e => setText(e.target.value)}
              rows={5}
            />
            <div className="sample-btns">
              {SAMPLES.map((s, i) => (
                <button key={i} className="sample-btn" onClick={() => setText(s)}>
                  {t.sample} {i + 1}
                </button>
              ))}
            </div>
          </>
        )}

        {/* IMAGE MODE */}
        {mode === 'image' && (
          <>
            {!image ? (
              <div
                className={`scam-drop-zone ${dragging ? 'drag-over' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleImage(e.dataTransfer.files[0]); }}
              >
                <div className="drop-icon">📸</div>
                <div className="drop-title">{t.dropTitle}</div>
                <div className="drop-sub">{t.dropSub}</div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleImage(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="scam-image-preview">
                <img src={image.preview} alt="Upload preview" />
                <button className="remove-image-btn" onClick={() => { setImage(null); setResult(null); }}>
                  {t.remove}
                </button>
              </div>
            )}
            {/* Optional extra context */}
            <textarea
              className="scam-textarea"
              style={{ marginTop: 12, minHeight: 60 }}
              placeholder={t.phImg}
              value={text}
              onChange={e => setText(e.target.value)}
              rows={2}
            />
          </>
        )}

        <button
          className="check-btn"
          onClick={checkScam}
          disabled={!canCheck || loading}
        >
          {loading
            ? <><div className="spinner" /> {t.btnChecking}</>
            : <><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> {t.btnCheck}</>
          }
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="scam-error">{error}</div>
      )}

      {/* Result */}
      {result && riskInfo && (
        <div className="result-card">
          <div className={`risk-badge ${riskInfo.cls}`}>
            {riskInfo.emoji} {riskInfo.text} — {result.risk_level}
          </div>

          {/* Confidence bar */}
          <div className="conf-bar-wrap">
            <div className="conf-bar-label">
              <span>{t.resConf}</span>
              <span><strong>{result.confidence}%</strong></span>
            </div>
            <div className="conf-bar-track">
              <div
                className="conf-bar-fill"
                style={{
                  width: `${result.confidence}%`,
                  background: result.risk_level === 'SAFE' ? '#4caf50'
                    : result.risk_level === 'DANGER' ? '#f44336' : '#ff9800',
                }}
              />
            </div>
          </div>

          {result.explanation && (
            <div className="result-section">
              <div className="result-label">{t.resExpl}</div>
              <p className="result-explanation">{result.explanation}</p>
            </div>
          )}

          {result.warning_signs?.length > 0 && (
            <div className="result-section">
              <div className="result-label">{t.resWarn}</div>
              <ul className="warning-list">
                {result.warning_signs.map((w, i) => <li key={i} className="warning-item">{w}</li>)}
              </ul>
            </div>
          )}

          {result.rules_violated?.length > 0 && (
            <div className="result-section">
              <div className="result-label">{t.resRules}</div>
              <ul className="rules-list">
                {result.rules_violated.map((r, i) => <li key={i} className="rule-item">{r}</li>)}
              </ul>
            </div>
          )}

          {result.advice && (
            <div className="result-section">
              <div className="result-label">{t.resAdvice}</div>
              <div className="result-advice">💡 {result.advice}</div>
            </div>
          )}

          <div className="helpline-note">
            {t.help}
          </div>
        </div>
      )}
    </div>
  );
}
