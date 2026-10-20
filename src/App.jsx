import Navbar from './components/layout/Navbar.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/layout/Footer.jsx'
import BinaryOrbits from './components/visuals/BinaryOrbits.jsx'
import './App.css'

function App() {
  return (
    <>
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
        colors={['#ffeb81', '#e2ff4e']}
        backgroundColor="#0A0A0A"
        mode="auto"
        stars={70000}
        starSize={1.7}
        sparkle={0.5}
        arms={3}
        twist={3.5}
        armStrength={0.5}
        dust={0.5}
        core={1}
        coreSize={0.05}
        innerVoid={0}
        thickness={0.04}
        tilt={62}
        roll={-8}
        scale={0.8}
        centerX={0.5}
        centerY={0.52}
        speed={0.65}
        twinkle={0.35}
        depth={0.4}
        glow={0.5}
        intensity={1.35}
        interactive={false}
        hoverWake={false}
        clickRipple={false}
        quality={0.8}
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
