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
        {page === 'home'       && <WelcomeScreen setPage={setPage} language={language} />}
        {page === 'chat'       && <ChatWindow language={language} setLanguage={setLanguage} langs={LANGS} />}
        {page === 'scam'       && <ScamChecker language={language} />}
        {page === 'screenshot' && <ScreenshotAnalyzer language={language} setLanguage={setLanguage} langs={LANGS} />}
        {page === 'news'       && <NewsPage language={language} />}
      </main>
    </div>
  );
}
