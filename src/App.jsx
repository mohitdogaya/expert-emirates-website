import Navbar from './components/layout/Navbar.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/layout/Footer.jsx'
import './App.css'
import SplashCursor from './components/visuals/SplashCursor.jsx'
import FadeContent from './components/visuals/FadeContent.jsx'
import BinaryOrbitsBackground from './components/visuals/BinaryOrbitsBackground.jsx'

const binaryOrbitsSections = ['.hero-card', '#support']

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
        <FadeContent {...fadeContentProps}><Navbar /></FadeContent>
        <main>
          <Home />
        </main>
        <FadeContent {...fadeContentProps}><Footer /></FadeContent>
      </div>
    </>
  )
}

export default App
