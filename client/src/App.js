import { useState } from 'react';
import Navbar from './components/Navbar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatWindow from './components/ChatWindow';
import ScamChecker from './components/ScamChecker';
import ScreenshotAnalyzer from './components/ScreenshotAnalyzer';
import NewsPage from './components/NewsPage';

const LANGS = [
  { id: 'hindi',   label: 'हिंदी',  flag: '🇮🇳', cls: '' },
  { id: 'marathi', label: 'मराठी', flag: '🔴', cls: 'marathi' },
  { id: 'tamil',   label: 'தமிழ்', flag: '🔴', cls: 'tamil' },
  { id: 'bengali', label: 'বাংলা', flag: '🟠', cls: 'bengali' },
  { id: 'english', label: 'English', flag: '🔵', cls: 'english' },
];

export { LANGS };

export default function App() {
  const [page, setPage] = useState('home');
  const [language, setLanguage] = useState('hindi');

  return (
    <div className="app">
      <Navbar
        page={page} setPage={setPage}
        language={language} setLanguage={setLanguage}
        langs={LANGS}
      />
      <main className="page">
        <div style={{ display: page === 'home' ? 'block' : 'none' }}>
          <WelcomeScreen setPage={setPage} language={language} />
        </div>
        <div style={{ display: page === 'chat' ? 'block' : 'none' }}>
          <ChatWindow language={language} setLanguage={setLanguage} langs={LANGS} />
        </div>
        <div style={{ display: page === 'scam' ? 'block' : 'none' }}>
          <ScamChecker language={language} />
        </div>
        <div style={{ display: page === 'screenshot' ? 'block' : 'none' }}>
          <ScreenshotAnalyzer language={language} setLanguage={setLanguage} langs={LANGS} />
        </div>
        <div style={{ display: page === 'news' ? 'block' : 'none' }}>
          <NewsPage language={language} />
        </div>
      </main>
    </div>
  );
}
