import { lazy, Suspense } from 'react'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import './App.css'
import FadeContent from './components/visuals/FadeContent.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

const SplashCursor = lazy(() => import('./components/visuals/SplashCursor.jsx'))
const BinaryOrbitsBackground = lazy(() => import('./components/visuals/BinaryOrbitsBackground.jsx'))
const LightningBackground = lazy(() => import('./components/visuals/LightningBackground.jsx'))

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
  return (
    <>
      <Suspense fallback={null}>
        <SplashCursor
          quality="low"
          intensity={0.7}
          force={0.7}
          swirl={2}
          trail={0.75}
          momentum={0.8}
          shading={0}
          glow={0}
          intro={false}
        />
        <BinaryOrbitsBackground sections={binaryOrbitsSections} />
      </Suspense>
      <div className="site-shell">
        <Suspense fallback={null}>
          <LightningBackground sections={particleRainSections} excludedSections={binaryOrbitsSections} />
        </Suspense>
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
