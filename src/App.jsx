import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import OnboardingGate from './components/OnboardingGate.jsx'
import PWAInstallBanner from './components/PWAInstallBanner.jsx'
import HomePage from './pages/HomePage.jsx'
import ImagePage from './pages/ImagePage.jsx'
import VideoPage from './pages/VideoPage.jsx'
import AudioPage from './pages/AudioPage.jsx'
import MusicPage from './pages/MusicPage.jsx'
import TextPage from './pages/TextPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

export default function App() {
  return (
    <OnboardingGate>
      <div className="scanlines grid-bg min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/image" element={<ImagePage />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/audio" element={<AudioPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/text" element={<TextPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <Footer />
        <PWAInstallBanner />
      </div>
    </OnboardingGate>
  )
}
