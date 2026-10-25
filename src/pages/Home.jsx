import { useEffect, useState } from 'react'
import HeroSection from '../components/home/HeroSection.jsx'
import BotsSection from '../components/home/BotsSection.jsx'
import FeatureSection from '../components/home/FeatureSection.jsx'
import WhyChooseSection from '../components/home/WhyChooseSection.jsx'
import EcosystemSection from '../components/home/EcosystemSection.jsx'
import PerformanceSection from '../components/home/PerformanceSection.jsx'
import LearningSection from '../components/home/LearningSection.jsx'
import ClientReviewsSection from '../components/home/ClientReviewsSection.jsx'
import ProductVideoSection from '../components/home/ProductVideoSection.jsx'
import HowItWorksSection from '../components/home/HowItWorksSection.jsx'
import VpsSupportSection from '../components/home/VpsSupportSection.jsx'
import FaqSection from '../components/home/FaqSection.jsx'
import ContactSection from '../components/home/ContactSection.jsx'
import PricingSection from '../components/home/PricingSection.jsx'
import FadeContent from '../components/visuals/FadeContent.jsx'

const fadeContentProps = {
  effect: 'mist',
  duration: 1.1,
  ease: 'power2.out',
  stagger: 0.1,
  threshold: 0.1,
  staggerChildren: true,
}

function Home() {
  const [sectionsReady, setSectionsReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setSectionsReady(true), 450)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <FadeContent {...fadeContentProps}><HeroSection /></FadeContent>
      {sectionsReady && (
        <>
          <FeatureSection />
          <FadeContent {...fadeContentProps}><EcosystemSection /></FadeContent>
          <WhyChooseSection />
          <FadeContent {...fadeContentProps}><PerformanceSection /></FadeContent>
          <LearningSection />
          <FadeContent {...fadeContentProps}><ProductVideoSection /></FadeContent>
          <BotsSection />
          <HowItWorksSection />
          <VpsSupportSection />
          <FadeContent {...fadeContentProps}><PricingSection /></FadeContent>
          <ClientReviewsSection />
          <FaqSection />
          <FadeContent {...fadeContentProps}><ContactSection /></FadeContent>
        </>
      )}
    </>
  )
}

export default Home
