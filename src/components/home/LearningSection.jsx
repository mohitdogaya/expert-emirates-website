import { lessons } from './homeData.js'
import AnimatedLink from './AnimatedLink.jsx'
import useScrollReveal from './useScrollReveal.js'
import ScrollText from './ScrollText.jsx'
import BorderGlow from '../visuals/BorderGlow.jsx'
import ReviewCarousel from './ReviewCarousel.jsx'

function LearningSection() {
  const [sectionRef, visible] = useScrollReveal()
  return (
    <section className={`learning-section scroll-section${visible ? ' is-visible' : ''}`} ref={sectionRef} id="client-reviews" aria-labelledby="reviews-heading">
      <div className="review-cards"><ReviewCarousel /></div>
      <div className="learning-copy">
        <span className="section-eyebrow">Client reviews</span>
        <ScrollText className="scroll-title" id="reviews-heading">Real <span>Experiences.</span><br />Honest <span>Feedback.</span></ScrollText>
        <ScrollText as="p" className="scroll-copy" wordClassName="scroll-description-word">Discover how customers use Expert Emirates trading technology, explore their experiences, and learn about their setup journeys.</ScrollText>
        <AnimatedLink href="#product-videos">Watch Client Reviews</AnimatedLink>
      </div>
      <div className="education-copy">
        <span className="section-eyebrow">Trading education</span>
        <ScrollText className="scroll-title">Learn the Technology Behind<br /><span>Automated Trading</span></ScrollText>
        <ScrollText as="p" className="scroll-copy" wordClassName="scroll-description-word">Build your understanding of Expert Advisors, MetaTrader 5, trading strategies, and risk management with our educational video library.</ScrollText>
        <AnimatedLink href="#product-videos">Explore Educational Videos</AnimatedLink>
      </div>
      <div className="lesson-grid" aria-label="Education video topics">
        {lessons.map(([title, subtitle, Icon], index) => (
          <BorderGlow className="lesson-card" key={title} style={{ '--item-delay': `${index * 70}ms` }} backgroundColor="#201f27" borderRadius={18} glowRadius={20}>
            <Icon aria-hidden="true" /><h3>{title}</h3><p>{subtitle}</p>
          </BorderGlow>
        ))}
      </div>
    </section>
  )
}

export default LearningSection
