import Navbar from './components/layout/Navbar.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/layout/Footer.jsx'
import BinaryOrbits from './components/visuals/BinaryOrbits.jsx'
import AnimatedCursor from './components/visuals/AnimatedCursor.jsx'
import './App.css'
import SplashCursor from './components/visuals/SplashCursor.jsx'

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
        stars={90000}
        starSize={1.9}
        sparkle={5}
        arms={4}
        twist={4.5}
        armStrength={0.9}
        dust={0.9}
        core={1.9}
        coreSize={0.01}
        innerVoid={0}
        thickness={0.01}
        tilt={62}
        roll={-8}
        scale={0.7}
        centerX={0.5}
        centerY={0.52}
        speed={-1.7}
        twinkle={0.2}
        depth={0.4}
        glow={0.5}
        intensity={1.6}
        interactive={false}
        hoverWake={false}
        clickRipple={false}
        quality={1}
      />
      <div className="site-shell">
        <Navbar />
        <main>
          <Home />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
