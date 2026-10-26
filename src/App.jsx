import { Component, lazy, Suspense, useEffect, useState } from 'react'
import './stylesheets/App.css'
import './stylesheets/SectionShared.css'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import FadeContent from './components/visuals/FadeContent.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

const SplashCursor = lazy(() => import('./components/visuals/SplashCursor.jsx'))
const BinaryOrbitsBackground = lazy(() => import('./components/visuals/BinaryOrbitsBackground.jsx'))
const LightningBackground = lazy(() => import('./components/visuals/LightningBackground.jsx'))

class BackgroundErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return <div className="background-fallback" aria-hidden="true" />
    }

    return this.props.children
  }
}

const binaryOrbitsSections = ['.hero-card']
const particleRainSections = [
  '.site-content > main',
  '#services',
  '#forecasts',
  '#about',
  '.performance-section',
  '#trading-education',
  '#product-videos',
  '#bots',
  '#how-it-works',
  '#pricing',
  '#support',
  '#client-reviews',
  '#faq',
  '#contact',
  '.details-page',
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
  const [coarsePointer, setCoarsePointer] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)')
    const update = () => setCoarsePointer(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return (
    <>
      <BackgroundErrorBoundary>
        <Suspense fallback={<div className="background-fallback" aria-hidden="true" />}>
          {!coarsePointer && <SplashCursor
            quality="low"
            intensity={0.7}
            force={0.7}
            swirl={2}
            trail={0.75}
            momentum={0.8}
            shading={0}
            glow={0}
            intro={false}
          />}
          <BinaryOrbitsBackground sections={binaryOrbitsSections} />
        </Suspense>
      </BackgroundErrorBoundary>
      <div className="site-shell">
        <BackgroundErrorBoundary>
          <Suspense fallback={<div className="background-fallback" aria-hidden="true" />}>
            <LightningBackground sections={particleRainSections} excludedSections={binaryOrbitsSections} />
          </Suspense>
        </BackgroundErrorBoundary>
        <div className="site-content">
          <FadeContent {...fadeContentProps}><Navbar /></FadeContent>
          <main>
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App
