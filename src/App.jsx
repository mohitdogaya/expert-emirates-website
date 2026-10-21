import Navbar from './components/layout/Navbar.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/layout/Footer.jsx'
import BinaryOrbits from './components/visuals/BinaryOrbits.jsx'
import './App.css'
import SplashCursor from './components/visuals/SplashCursor.jsx'
import FadeContent from './components/visuals/FadeContent.jsx'

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
      <BinaryOrbits
        className="binary-orbits-background"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          width: '100vw',
          height: '100vh',
          minHeight: 0,
          pointerEvents: 'none',
        }}
        colors={['#fde35f', '#ffed4e']}
        backgroundColor="#0A0A0A"
        mode="auto"
        stars={70000}
        starSize={1.3}
        sparkle={5}
        arms={4}
        twist={4.5}
        armStrength={0.9}
        dust={0.2}
        core={1.2}
        coreSize={0.012}
        innerVoid={0}
        thickness={0.01}
        tilt={62}
        roll={-8}
        scale={0.7}
        centerX={0.5}
        centerY={0.52}
        speed={-1.7}
        twinkle={0.82}
        depth={0.4}
        glow={0.2}
        intensity={1.2}
        interactive={false}
        hoverWake={false}
        clickRipple={false}
        quality={1}
      />
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
