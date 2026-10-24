import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import './App.css'
import SplashCursor from './components/visuals/SplashCursor.jsx'
import FadeContent from './components/visuals/FadeContent.jsx'
import BinaryOrbitsBackground from './components/visuals/BinaryOrbitsBackground.jsx'
import LightningBackground from './components/visuals/LightningBackground.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

const binaryOrbitsSections = ['.hero-card', '#support']
const particleRainSections = [
  '#services',
  '#forecasts',
  '#about',
  '.performance-section',
  '#trading-education',
  '#product-videos',
  '#bots',
  '#how-it-works',
  '#pricing',
  '#client-reviews',
  '#faq',
  '#contact',
]
const fadeContentProps = {
  effect: 'mist',
  duration: 1.8,
  ease: 'power2.out',
  stagger: 0.1,
  threshold: 0.1,
  staggerChildren: true,
}

function App() {
  return (
    <>
      <SplashCursor />
      <BinaryOrbitsBackground sections={binaryOrbitsSections} />
      <div className="site-shell">
        <LightningBackground sections={particleRainSections} excludedSections={binaryOrbitsSections} />
        <div className="site-content">
          <FadeContent {...fadeContentProps}><Navbar /></FadeContent>
          <main>
            <AppRoutes />
          </main>
          <FadeContent {...fadeContentProps}><Footer /></FadeContent>
        </div>
      </div>
    </>
  )
}

export default App
