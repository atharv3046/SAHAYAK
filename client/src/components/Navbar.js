const NAV_T = {
  hindi:   { home: 'होम', chat: 'बात करें', scam: 'घोटाला जाँच', screenshot: 'स्क्रीनशॉट', news: 'खबरें' },
  marathi: { home: 'मुख्यपृष्ठ', chat: 'गप्पा', scam: 'घोटाळा तपासक', screenshot: 'स्क्रीनशॉट', news: 'बातम्या' },
  tamil:   { home: 'முகப்பு', chat: 'உரையாடல்', scam: 'மோசடி சோதனை', screenshot: 'ஸ்கிரீன்ஷாட்', news: 'செய்திகள்' },
  bengali: { home: 'হোম', chat: 'কথা বলুন', scam: 'প্রতারণা যাচাই', screenshot: 'স্ক্রিনশট', news: 'খবর' },
  english: { home: 'Home', chat: 'Chat', scam: 'Scam Check', screenshot: 'Screenshot', news: 'News' },
};

export default function Navbar({ page, setPage, language, setLanguage, langs }) {
  const t = NAV_T[language] || NAV_T.hindi;

  const navItems = [
    { id: 'home',       label: t.home },
    { id: 'chat',       label: t.chat },
    { id: 'scam',       label: t.scam },
    { id: 'screenshot', label: t.screenshot },
    { id: 'news',       label: t.news },
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <button className="nav-logo" onClick={() => setPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="nav-logo-icon">🌿</div>
        <span>SmartSathi</span>
      </button>

      {/* Nav links */}
      <ul className="nav-links">
        {navItems.map(item => (
          <li key={item.id}>
            <button
              className={`nav-link ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Language switcher */}
      <div className="nav-langs">
        {langs.map(l => (
          <button
            key={l.id}
            className={`lang-badge ${l.cls} ${language === l.id ? 'active-lang' : ''}`}
            onClick={() => setLanguage(l.id)}
            title={l.label}
          >
            {l.flag && <span style={{ fontSize: 13 }}>{l.flag}</span>}
            <span>{l.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
