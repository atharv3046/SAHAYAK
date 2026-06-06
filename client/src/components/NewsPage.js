import { useState, useEffect, useCallback } from 'react';

const CATEGORIES = [
  { id: 'upi',     label: 'UPI',     emoji: '💳' },
  { id: 'kyc',     label: 'KYC',     emoji: '🪪' },
  { id: 'otp',     label: 'OTP',     emoji: '🔑' },
  { id: 'lottery', label: 'Lottery', emoji: '🎰' },
];

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line wide" />
      <div className="skeleton-line short" />
      <div className="skeleton-line medium" style={{ marginTop: 12 }} />
      <div className="skeleton-line wide" />
      <div className="skeleton-line medium" />
    </div>
  );
}

const T = {
  hindi: {
    title: '📰 ताज़ा घोटाला समाचार',
    desc: 'आज के भारत में ट्रेंडिंग डिजिटल घोटाले — AI द्वारा संचालित।',
    refresh: 'रिफ्रेश',
    errLoad: 'खबरें लोड नहीं हो सकीं। कृपया पुनः प्रयास करें।',
    risk: 'खतरा',
    cache: '📦 ये खबरें कैश से आई हैं (1 घंटे के लिए सेव) · Refresh करें नई खबरों के लिए',
    empty: 'इस श्रेणी में अभी कोई खबर नहीं है।\nRefresh करके पुनः प्रयास करें।',
    sev: { high: 'उच्च', medium: 'मध्यम', low: 'कम' },
  },
  marathi: {
    title: '📰 ताज्या घोटाळा बातम्या',
    desc: 'आजच्या भारतातील ट्रेंडिंग डिजिटल घोटाळे — AI द्वारा समर्थित.',
    refresh: 'रिफ्रेश',
    errLoad: 'बातम्या लोड होऊ शकल्या नाहीत. कृपया पुन्हा प्रयत्न करा.',
    risk: 'धोका',
    cache: '📦 या बातम्या कॅशमधून आल्या आहेत (1 तासासाठी सेव्ह) · नवीन बातम्यांसाठी Refresh करा',
    empty: 'या श्रेणीत सध्या कोणतीही बातमी नाही.\nRefresh करून पुन्हा प्रयत्न करा.',
    sev: { high: 'उच्च', medium: 'मध्यम', low: 'कमी' },
  },
  tamil: {
    title: '📰 நேரடி மோசடி செய்திகள்',
    desc: 'இன்றைய இந்தியாவில் ட்ரெண்டிங் டிஜிட்டல் மோசடிகள் — AI மூலம்.',
    refresh: 'புதுப்பி',
    errLoad: 'செய்திகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    risk: 'ஆபத்து',
    cache: '📦 இந்த செய்திகள் தற்காலிக சேமிப்பிலிருந்து வந்தவை · புதிய செய்திகளுக்கு புதுப்பிக்கவும்',
    empty: 'இந்த பிரிவில் தற்போது எந்த செய்தியும் இல்லை.\nபுதுப்பித்து மீண்டும் முயற்சிக்கவும்.',
    sev: { high: 'அதிக', medium: 'நடுத்தர', low: 'குறைந்த' },
  },
  bengali: {
    title: '📰 সর্বশেষ প্রতারণা সংবাদ',
    desc: 'আজকের ভারতে ট্রেন্ডিং ডিজিটাল প্রতারণা — AI দ্বারা পরিচালিত।',
    refresh: 'রিফ্রেশ',
    errLoad: 'খবর লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
    risk: 'ঝুঁকি',
    cache: '📦 এই খবরগুলি ক্যাশ থেকে এসেছে (১ ঘণ্টার জন্য সংরক্ষিত) · নতুন খবরের জন্য রিফ্রেশ করুন',
    empty: 'এই বিভাগে বর্তমানে কোনো খবর নেই।\nরিফ্রেশ করে আবার চেষ্টা করুন।',
    sev: { high: 'উচ্চ', medium: 'মাঝারি', low: 'কম' },
  },
  english: {
    title: '📰 Live Scam News',
    desc: "Today's trending digital scams in India — powered by AI.",
    refresh: 'Refresh',
    errLoad: 'Could not load news. Please try again.',
    risk: 'Risk',
    cache: '📦 These news are cached (saved for 1 hour) · Refresh for new news',
    empty: 'There is currently no news in this category.\nRefresh and try again.',
    sev: { high: 'High', medium: 'Medium', low: 'Low' },
  },
};

export default function NewsPage({ language = 'hindi' }) {
  const [category, setCategory] = useState('upi');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cached, setCached] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const t = T[language] || T.hindi;

  const fetchNews = useCallback(async (cat, lang, forceRefresh = false) => {
    setLoading(true); setError(''); setArticles([]);
    try {
      const url = `/api/news?category=${cat}&language=${lang}${forceRefresh ? '&refresh=1' : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.error && !data.articles?.length) throw new Error(data.error);
      setArticles(data.articles || []);
      setCached(data.cached || false);
    } catch {
      setError(t.errLoad);
    } finally {
      setLoading(false); setSpinning(false);
    }
  }, [t.errLoad]);

  useEffect(() => { fetchNews(category, language); }, [category, language, fetchNews]);

  const handleRefresh = () => {
    setSpinning(true);
    fetchNews(category, language, true);
  };

  return (
    <div className="news-page">
      <div className="page-header">
        <h1>{t.title}</h1>
        <p>{t.desc}</p>
      </div>

      {/* Category filters + refresh */}
      <div className="news-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
        <button
          className={`news-refresh-btn ${spinning ? 'spinning' : ''}`}
          onClick={handleRefresh}
          disabled={loading}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          {t.refresh}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', background: '#FFEBEE', borderRadius: 10, color: '#C62828', fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="news-grid">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* News articles */}
      {!loading && articles.length > 0 && (
        <>
          <div className="news-grid">
            {articles.map((article, i) => (
              <div key={i} className="news-card">
                <div className="news-card-header">
                  <div className="news-title">
                    {article.title}
                    <span className="news-cat-badge">{article.category}</span>
                  </div>
                  <div className={`severity-dot severity-${article.severity}`} title={`${t.risk}: ${t.sev[article.severity] || article.severity}`} />
                </div>
                <div className="news-meta">
                  <span>{article.source}</span>
                  <span>{article.date}</span>
                  <span>{t.risk}: {t.sev[article.severity] || article.severity}</span>
                </div>
                <p className="news-summary">{article.summary}</p>
                {article.advice && (
                  <div className="news-advice">💡 {article.advice}</div>
                )}
              </div>
            ))}
          </div>

          {cached && (
            <div className="cache-note">
              {t.cache}
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!loading && !error && articles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>{t.empty.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}</p>
        </div>
      )}

      {/* Helpline */}
      <div className="helpline-banner" style={{ marginTop: 32 }}>
        <span>📞 Helpline: <strong>1930</strong></span>
        <span className="helpline-divider">|</span>
        <span>🌐 <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>cybercrime.gov.in</a></span>
      </div>
    </div>
  );
}
