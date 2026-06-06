import { useEffect, useRef } from 'react';

const T = {
  hindi: {
    eyebrow: '✨ स्मार्ट साथी · AI साथी',
    h1a: 'डिजिटल दुनिया में आपका',
    h1b: 'भरोसेमंद साथी',
    tagline: 'सुरक्षित डिजिटल जीवन की ओर आपका मार्गदर्शक',
    desc: 'SmartSathi ग्रामीण भारत के पहली बार स्मार्टफ़ोन इस्तेमाल करने वालों को UPI, WhatsApp और सरकारी ऐप्स सीखने, घोटाले पहचानने में मदद करता है — 5 भारतीय भाषाओं में।',
    cta1: 'शुरू करें →',
    cta2: '🛡️ SMS जाँचें',
    badge1: '5 भाषाएँ', badge2: 'वॉयस सपोर्ट', badge3: 'RBI / NPCI सत्यापित',
    feat1: 'AI शिक्षक (साहायक)', feat1d: 'आपकी भाषा में धैर्यवान आवाज़ कोच।',
    feat2: 'घोटाला जाँच', feat2d: 'कोई भी SMS पेस्ट करें — जानें सुरक्षित है या नहीं।',
    feat3: 'स्क्रीनशॉट विश्लेषक', feat3d: 'चरण-दर-चरण विज़ुअल मार्गदर्शन।',
    feat4: 'ताज़ा घोटाला समाचार', feat4d: 'आज के भारत में ट्रेंडिंग घोटाले।',
    sectionTitle: 'आपके लिए सब कुछ',
    stat1n: '5', stat1l: 'भाषाएं', stat2n: '1000+', stat2l: 'स्कैम पकड़े', stat3n: '100%', stat3l: 'मुफ्त',
    howTitle: 'यह कैसे काम करता है?',
    step1t: 'अपनी भाषा चुनें', step1d: 'हिंदी, मराठी, तमिल, बांग्ला या अंग्रेज़ी में काम करें',
    step2t: 'सवाल पूछें', step2d: 'टाइप करें या बोलकर पूछें — Sahayak समझेगा',
    step3t: 'सुरक्षित रहें', step3d: 'AI जवाब, स्कैम अलर्ट और विज़ुअल गाइड पाएं',
    ticker: '⚠️ नया स्कैम: KYC अपडेट SMS • ⚠️ UPI Collect Request फ्रॉड • ⚠️ Lottery WhatsApp स्कैम • ⚠️ Fake Bank Call OTP स्कैम • ⚠️ नया स्कैम: KYC अपडेट SMS • ⚠️ UPI Collect Request फ्रॉड • ⚠️ Lottery WhatsApp स्कैम • ⚠️ Fake Bank Call OTP स्कैम',
    trustTitle: 'लोगों ने क्या कहा?',
    q1: 'मुझे नहीं पता था UPI क्या है, अब मैं खुद पैसे भेज सकता हूं', q1n: 'रामलाल', q1p: 'किसान, उत्तर प्रदेश',
    q2: 'WhatsApp पर आए लॉटरी मैसेज को SmartSathi ने पकड़ लिया — मेरे ₹5000 बचे', q2n: 'सुनीता देवी', q2p: 'गृहिणी, बिहार',
    q3: 'बहुत आसान है, मेरी माँ भी इस्तेमाल करती हैं — आवाज़ में सुनकर सीखती हैं', q3n: 'अजय कुमार', q3p: 'दुकानदार, राजस्थान',
    openBtn: 'खोलें',
  },
  marathi: {
    eyebrow: '✨ स्मार्ट साथी · AI सोबती',
    h1a: 'डिजिटल जगात तुमचा',
    h1b: 'विश्वासू साथी',
    tagline: 'सुरक्षित डिजिटल जीवनासाठी मार्गदर्शक',
    desc: 'SmartSathi ग्रामीण भारतातील पहिल्यांदा स्मार्टफोन वापरणाऱ्यांना UPI, WhatsApp आणि सरकारी ऐप्स शिकण्यास मदत करते — 5 भारतीय भाषांमध्ये.',
    cta1: 'सुरू करा →',
    cta2: '🛡️ SMS तपासा',
    badge1: '5 भाषा', badge2: 'व्हॉइस सपोर्ट', badge3: 'RBI / NPCI सत्यापित',
    feat1: 'AI शिक्षक (साहायक)', feat1d: 'तुमच्या भाषेत धैर्यवान व्हॉइस कोच.',
    feat2: 'घोटाला तपासक', feat2d: 'कोणताही SMS पेस्ट करा — सुरक्षित आहे का जाणा.',
    feat3: 'स्क्रीनशॉट विश्लेषक', feat3d: 'चरण-दर-चरण व्हिज्युअल मार्गदर्शन.',
    feat4: 'ताज्या घोटाला बातम्या', feat4d: 'आजच्या भारतातील ट्रेंडिंग घोटाले.',
    sectionTitle: 'तुमच्यासाठी सर्व काही',
    stat1n: '5', stat1l: 'भाषा', stat2n: '1000+', stat2l: 'घोटाळे पकडले', stat3n: '100%', stat3l: 'मोफत',
    howTitle: 'हे कसे काम करते?',
    step1t: 'तुमची भाषा निवडा', step1d: 'हिंदी, मराठी, तमिळ, बांगला किंवा इंग्रजीत काम करा',
    step2t: 'प्रश्न विचारा', step2d: 'टाइप करा किंवा बोलून विचारा — Sahayak समजेल',
    step3t: 'सुरक्षित राहा', step3d: 'AI उत्तरे, घोटाळा अलर्ट आणि व्हिज्युअल गाइड मिळवा',
    ticker: '⚠️ नवीन घोटाळा: KYC अपडेट SMS • ⚠️ UPI Collect Request फसवणूक • ⚠️ Lottery WhatsApp घोटाळा • ⚠️ Fake Bank Call OTP घोटाळा',
    trustTitle: 'लोकांनी काय सांगितले?',
    q1: 'मला UPI काय आहे हे माहीत नव्हते, आता मी स्वतः पैसे पाठवू शकतो', q1n: 'रामलाल', q1p: 'शेतकरी, उत्तर प्रदेश',
    q2: 'WhatsApp वर आलेला Lottery Message SmartSathi ने ओळखला — माझे ₹5000 वाचले', q2n: 'सुनीता देवी', q2p: 'गृहिणी, बिहार',
    q3: 'खूप सोपे आहे, माझी आई पण वापरते — आवाजात ऐकून शिकते', q3n: 'अजय कुमार', q3p: 'दुकानदार, राजस्थान',
    openBtn: 'उघडा',
  },
  tamil: {
    eyebrow: '✨ ஸ்மார்ட் சாதி · AI தோழன்',
    h1a: 'டிஜிட்டல் உலகில் உங்கள்',
    h1b: 'நம்பகமான வழிகாட்டி',
    tagline: 'பாதுகாப்பான டிஜிட்டல் வாழ்க்கைக்கான உங்கள் வழிகாட்டி',
    desc: 'SmartSathi கிராமப்புற இந்தியாவில் முதன்முறையாக ஸ்மார்ட்போன் பயன்படுத்துபவர்களுக்கு UPI, WhatsApp மற்றும் அரசு செயலிகளைக் கற்க உதவுகிறது — 5 இந்திய மொழிகளில்.',
    cta1: 'தொடங்கு →',
    cta2: '🛡️ SMS சரிபார்',
    badge1: '5 மொழிகள்', badge2: 'குரல் ஆதரவு', badge3: 'RBI / NPCI சான்றிதழ்',
    feat1: 'AI ஆசிரியர் (சாயக்)', feat1d: 'உங்கள் மொழியில் பொறுமையான குரல் பயிற்சியாளர்.',
    feat2: 'மோசடி சோதனை', feat2d: 'எந்த SMS ஐயும் ஒட்டவும் — பாதுகாப்பானதா என அறியவும்.',
    feat3: 'ஸ்கிரீன்ஷாட் பகுப்பாய்வி', feat3d: 'படிப்படியான காட்சி வழிகாட்டுதல்.',
    feat4: 'நேரடி மோசடி செய்திகள்', feat4d: 'இன்றைய இந்தியாவில் ட்ரெண்டிங் மோசடிகள்.',
    sectionTitle: 'உங்களுக்கு தேவையான அனைத்தும்',
    stat1n: '5', stat1l: 'மொழிகள்', stat2n: '1000+', stat2l: 'மோசடிகள் கண்டறியப்பட்டன', stat3n: '100%', stat3l: 'இலவசம்',
    howTitle: 'இது எவ்வாறு செயல்படுகிறது?',
    step1t: 'உங்கள் மொழியை தேர்வு செய்யுங்கள்', step1d: 'தமிழ், இந்தி, மராத்தி, வங்காளம் அல்லது ஆங்கிலத்தில் பணியாற்றுங்கள்',
    step2t: 'கேள்வி கேளுங்கள்', step2d: 'தட்டச்சு செய்யுங்கள் அல்லது பேசுங்கள் — Sahayak புரிந்துகொள்வார்',
    step3t: 'பாதுகாப்பாக இருங்கள்', step3d: 'AI பதில்கள், மோசடி எச்சரிக்கைகள் மற்றும் காட்சி வழிகாட்டி பெறுங்கள்',
    ticker: '⚠️ புதிய மோசடி: KYC புதுப்பிப்பு SMS • ⚠️ UPI Collect Request மோசடி • ⚠️ Lottery WhatsApp மோசடி • ⚠️ Fake Bank Call OTP மோசடி',
    trustTitle: 'மக்கள் என்ன சொன்னார்கள்?',
    q1: 'UPI என்னவென்று தெரியவில்லை, இப்போது நானே பணம் அனுப்புகிறேன்', q1n: 'ராமலால்', q1p: 'விவசாயி, உத்தர பிரதேசம்',
    q2: 'WhatsApp Lottery செய்தியை SmartSathi கண்டுபிடித்தது — ₹5000 மிச்சமானது', q2n: 'சுனிதா தேவி', q2p: 'இல்லத்தரசி, பிஹார்',
    q3: 'மிகவும் எளிதானது, என் அம்மாவும் பயன்படுத்துகிறார்கள்', q3n: 'அஜய் குமார்', q3p: 'கடைக்காரர், ராஜஸ்தான்',
    openBtn: 'திற',
  },
  bengali: {
    eyebrow: '✨ স্মার্ট সাথী · AI সঙ্গী',
    h1a: 'ডিজিটাল জগতে আপনার',
    h1b: 'বিশ্বস্ত সঙ্গী',
    tagline: 'নিরাপদ ডিজিটাল জীবনের পথপ্রদর্শক',
    desc: 'SmartSathi গ্রামীণ ভারতে প্রথমবার স্মার্টফোন ব্যবহারকারীদের UPI, WhatsApp এবং সরকারি অ্যাপস শিখতে, প্রতারণা চিনতে সাহায্য করে — ৫টি ভারতীয় ভাষায়।',
    cta1: 'শুরু করুন →',
    cta2: '🛡️ SMS যাচাই',
    badge1: '৫ ভাষা', badge2: 'ভয়েস সাপোর্ট', badge3: 'RBI / NPCI যাচাইকৃত',
    feat1: 'AI শিক্ষক (সাহায়ক)', feat1d: 'আপনার ভাষায় ধৈর্যশীল ভয়েস কোচ।',
    feat2: 'প্রতারণা পরীক্ষক', feat2d: 'যেকোনো SMS পেস্ট করুন — নিরাপদ কিনা জানুন।',
    feat3: 'স্ক্রিনশট বিশ্লেষক', feat3d: 'ধাপে ধাপে ভিজ্যুয়াল গাইড।',
    feat4: 'সর্বশেষ প্রতারণা সংবাদ', feat4d: 'আজকের ভারতে ট্রেন্ডিং প্রতারণা।',
    sectionTitle: 'আপনার জন্য সবকিছু',
    stat1n: '5', stat1l: 'ভাষা', stat2n: '1000+', stat2l: 'স্ক্যাম ধরা পড়েছে', stat3n: '100%', stat3l: 'বিনামূল্যে',
    howTitle: 'এটি কীভাবে কাজ করে?',
    step1t: 'আপনার ভাষা বেছে নিন', step1d: 'হিন্দি, মারাঠি, তামিল, বাংলা বা ইংরেজিতে কাজ করুন',
    step2t: 'প্রশ্ন করুন', step2d: 'টাইপ করুন বা বলুন — Sahayak বুঝবে',
    step3t: 'নিরাপদ থাকুন', step3d: 'AI উত্তর, স্ক্যাম সতর্কতা এবং ভিজ্যুয়াল গাইড পান',
    ticker: '⚠️ নতুন স্ক্যাম: KYC আপডেট SMS • ⚠️ UPI Collect Request জালিয়াতি • ⚠️ Lottery WhatsApp স্ক্যাম • ⚠️ Fake Bank Call OTP স্ক্যাম',
    trustTitle: 'মানুষ কী বলেছে?',
    q1: 'UPI কী তা জানতাম না, এখন নিজেই টাকা পাঠাতে পারি', q1n: 'রামলাল', q1p: 'কৃষক, উত্তর প্রদেশ',
    q2: 'WhatsApp Lottery বার্তা SmartSathi ধরে ফেলল — ₹5000 বাঁচল', q2n: 'সুনিতা দেবী', q2p: 'গৃহিণী, বিহার',
    q3: 'অনেক সহজ, আমার মা-ও ব্যবহার করেন — শুনে শিখছেন', q3n: 'অজয় কুমার', q3p: 'দোকানদার, রাজস্থান',
    openBtn: 'খুলুন',
  },
  english: {
    eyebrow: '✨ SmartSathi · AI Companion',
    h1a: 'Your friendly guide to a',
    h1b: 'safe digital life',
    tagline: 'Your companion in the digital world',
    desc: 'SmartSathi helps first-time smartphone users in rural India learn, spot scams, and use UPI, WhatsApp & government apps with confidence — in 5 Indian languages.',
    cta1: 'Get Started →',
    cta2: '🛡️ Check a scam SMS',
    badge1: '5 languages', badge2: 'Voice support', badge3: 'RBI / NPCI verified tips',
    feat1: 'AI Tutor (Sahayak)', feat1d: 'Patient voice coach in your language.',
    feat2: 'Scam Checker', feat2d: "Paste any SMS — know if it's safe.",
    feat3: 'Screenshot Analyzer', feat3d: 'Get visual step-by-step guidance.',
    feat4: 'Live Scam News', feat4d: "Today's trending scams in India.",
    sectionTitle: 'Everything you need',
    stat1n: '5', stat1l: 'Languages', stat2n: '1000+', stat2l: 'Scams Detected', stat3n: '100%', stat3l: 'Free Forever',
    howTitle: 'How does it work?',
    step1t: 'Choose your language', step1d: 'Work in Hindi, Marathi, Tamil, Bengali or English',
    step2t: 'Ask your question', step2d: 'Type or speak — Sahayak understands you',
    step3t: 'Stay safe', step3d: 'Get AI answers, scam alerts and visual guides',
    ticker: '⚠️ New Scam: KYC Update SMS • ⚠️ UPI Collect Request Fraud • ⚠️ Lottery WhatsApp Scam • ⚠️ Fake Bank Call OTP Scam • ⚠️ New Scam: KYC Update SMS • ⚠️ UPI Collect Request Fraud • ⚠️ Lottery WhatsApp Scam',
    trustTitle: 'What people are saying',
    q1: "I didn't know what UPI was — now I send money myself every day", q1n: 'Ramlal', q1p: 'Farmer, Uttar Pradesh',
    q2: 'SmartSathi caught a WhatsApp Lottery scam — saved me ₹5,000', q2n: 'Sunita Devi', q2p: 'Homemaker, Bihar',
    q3: 'Very easy to use. Even my mother uses it — she learns by listening', q3n: 'Ajay Kumar', q3p: 'Shopkeeper, Rajasthan',
    openBtn: 'Open',
  },
};


export default function WelcomeScreen({ setPage, language = 'hindi' }) {
  const t = T[language] || T.hindi;

  const features = [
    { emoji: '🤖', tint: '#EFF8DA', title: t.feat1, desc: t.feat1d, page: 'chat' },
    { emoji: '🚨', tint: 'rgba(224,82,82,0.10)', title: t.feat2, desc: t.feat2d, page: 'scam' },
    { emoji: '📸', tint: 'rgba(107,158,94,0.12)', title: t.feat3, desc: t.feat3d, page: 'screenshot' },
    { emoji: '📰', tint: 'rgba(224,123,46,0.12)', title: t.feat4, desc: t.feat4d, page: 'news' },
  ];

  // Intersection observer for scroll-in animations
  const observerRef = useRef(null);
  useEffect(() => {
    // Disconnect any previous observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      }),
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    );

    // Small delay to let React render the DOM first
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => {
        observerRef.current?.observe(el);
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [language]);


  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero">
        <div style={{
          position: 'absolute', right: -80, top: -80,
          width: 384, height: 384, borderRadius: '50%',
          background: '#EEFABD', filter: 'blur(64px)', opacity: 0.65,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: -80, top: 160,
          width: 320, height: 320, borderRadius: '50%',
          background: 'rgba(107,158,94,0.15)', filter: 'blur(64px)', opacity: 0.55,
          pointerEvents: 'none',
        }} />

        <div className="hero-main" style={{ position: 'relative' }}>
          <div className="hero-left">
            <h1 className="hero-h1">
              {t.h1a}{' '}
              <span>{t.h1b}</span>
            </h1>

            <p style={{
              fontFamily: '"Noto Sans Devanagari", Inter, sans-serif',
              fontSize: 17, color: 'var(--text-700)',
              opacity: 0.85, marginBottom: 10, fontWeight: 500,
            }}>
              {t.tagline}
            </p>

            <p className="hero-desc">{t.desc}</p>

            {/* CTA buttons */}
            <div className="hero-ctas">
              <button
                className="btn-primary animate-pulse-ring"
                onClick={() => setPage('chat')}
              >
                {t.cta1}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setPage('scam')}
              >
                {t.cta2}
              </button>
            </div>

            {/* Trust badges */}
            <div className="hero-badges">
              <span className="hero-badge">
                <span className="hero-badge-icon" style={{ color: 'var(--green-600)' }}>🌐</span>
                {t.badge1}
              </span>
              <span className="hero-badge">
                <span className="hero-badge-icon" style={{ color: 'var(--green-600)' }}>🎙️</span>
                {t.badge2}
              </span>
              <span className="hero-badge">
                <span className="hero-badge-icon" style={{ color: 'var(--green-600)' }}>🛡️</span>
                {t.badge3}
              </span>
            </div>
          </div>

          {/* Right column — Mascot */}
          <div className="hero-right">
            <div className="hero-blob" />
            <img
              src="/tutor.png"
              alt="SmartSathi tutor character"
              className="hero-mascot animate-float"
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hero-mascot-fallback" style={{ display: 'none' }}>🌿</div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="features-section">
        <div className="features-inner">
          <h2 className="features-title">{t.sectionTitle}</h2>
          <div className="features-grid" style={{ marginTop: 32 }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
                onClick={() => setPage(f.page)}
              >
                <div className="feature-icon-wrap" style={{ background: f.tint }}>{f.emoji}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <button className="feature-open">
                  {t.openBtn} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="hiw-section">
        <div className="features-inner">
          <h2 className="features-title reveal">{t.howTitle}</h2>
          <div className="hiw-grid">
            {[
              { num: 1, emoji: '📱', title: t.step1t, desc: t.step1d },
              { num: 2, emoji: '🤖', title: t.step2t, desc: t.step2d },
              { num: 3, emoji: '✅', title: t.step3t, desc: t.step3d },
            ].map((step, i) => (
              <div key={i} className="hiw-step-wrap">
                <div className="hiw-card reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                  <div className="hiw-num">{step.num}</div>
                  <div className="hiw-emoji">{step.emoji}</div>
                  <h3 className="hiw-title">{step.title}</h3>
                  <p className="hiw-desc">{step.desc}</p>
                </div>
                {i < 2 && <div className="hiw-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scam Alert Ticker ─────────────────────────────────── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          <span>{t.ticker}&nbsp;&nbsp;&nbsp;&nbsp;{t.ticker}</span>
        </div>
      </div>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="trust-section">
        <div className="features-inner">
          <h2 className="features-title reveal">{t.trustTitle}</h2>
          <div className="trust-grid">
            {[
              { q: t.q1, n: t.q1n, p: t.q1p, avatar: '👨‍🌾' },
              { q: t.q2, n: t.q2n, p: t.q2p, avatar: '👩' },
              { q: t.q3, n: t.q3n, p: t.q3p, avatar: '👨‍💼' },
            ].map((card, i) => (
              <div key={i} className="trust-card reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="trust-stars">⭐⭐⭐⭐⭐</div>
                <p className="trust-quote">"{card.q}"</p>
                <div className="trust-author">
                  <span className="trust-avatar">{card.avatar}</span>
                  <div>
                    <div className="trust-name">{card.n}</div>
                    <div className="trust-prof">{card.p}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Developer Credits ──────────────────────────────────── */}
      <section style={{
        padding: '40px 20px 50px',
        textAlign: 'center',
        background: 'transparent',
      }}>
        <div style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <p style={{
            fontSize: 13,
            color: 'var(--text-500)',
            fontWeight: 500,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}>
            Built with ❤️ for Rural India
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {[
              { 
                name: 'Atharv', 
                emoji: '👨‍💻',
                linkedin: 'https://www.linkedin.com/in/atharvchaturvedi/',
                github: 'https://github.com/atharv3046'
              },
              { 
                name: 'Aakriti', 
                emoji: '👩‍💻',
                linkedin: 'https://www.linkedin.com/in/aakritiahirwar22/',
                github: 'https://github.com/aakriti1002'
              },
            ].map((dev) => (
              <div key={dev.name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255,255,255,0.85)',
                border: '1.5px solid #E8F0DC',
                borderRadius: '9999px',
                padding: '8px 20px',
                boxShadow: '0 2px 10px rgba(61,90,48,0.08)',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: 20 }}>{dev.emoji}</span>
                  <span style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--green-700)',
                    letterSpacing: '-0.01em',
                  }}>
                    {dev.name}
                  </span>
                </div>
                <div style={{ width: '1px', height: '20px', background: 'rgba(61,90,48,0.15)', margin: '0 4px' }} />
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a href={dev.linkedin} target="_blank" rel="noreferrer" style={{ color: '#0077b5', display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} title="LinkedIn" onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href={dev.github} target="_blank" rel="noreferrer" style={{ color: '#333', display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} title="GitHub" onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-300)', marginTop: 4 }}>
            © 2024 SmartSathi · Sahayak
          </p>
        </div>
      </section>
    </>
  );
}
