import { FiPlay } from 'react-icons/fi'
import { lessons } from './homeData.js'
import AnimatedLink from './AnimatedLink.jsx'
import useScrollReveal from './useScrollReveal.js'

function LearningSection() {
  const [sectionRef, visible] = useScrollReveal()
  return (
    <section className={`learning-section scroll-section${visible ? ' is-visible' : ''}`} ref={sectionRef} id="client-reviews" aria-labelledby="reviews-heading">
      <div className="review-cards">
        {[0, 1].map((item) => (
          <article className={`review-card review-card-${item + 1}`} key={item}>
            <div className="review-thumbnail" role="img" aria-label="Customer review video preview">
              <span className="play-icon"><FiPlay aria-hidden="true" /></span>
            </div>
            <h3>Real Trader Review</h3><p>Setup Experience</p>
          </article>
        ))}
      </div>
      <div className="learning-copy">
        <span className="section-eyebrow">Client reviews</span>
        <h2 className="scroll-title" id="reviews-heading">Real <span>Experiences.</span><br />Honest <span>Feedback.</span></h2>
        <p className="scroll-copy">Discover how customers use Expert Emirates trading technology, explore their experiences, and learn about their setup journeys.</p>
        <AnimatedLink href="#product-videos">Watch Client Reviews</AnimatedLink>
      </div>
      <div className="education-copy">
        <span className="section-eyebrow">Trading education</span>
        <h2 className="scroll-title">Learn the Technology Behind<br /><span>Automated Trading</span></h2>
        <p className="scroll-copy">Build your understanding of Expert Advisors, MetaTrader 5, trading strategies, and risk management with our educational video library.</p>
        <AnimatedLink href="#product-videos">Explore Educational Videos</AnimatedLink>
      </div>
      <div className="lesson-grid" aria-label="Education video topics">
        {lessons.map(([title, subtitle, Icon], index) => (
          <article className="lesson-card" key={title} style={{ '--item-delay': `${index * 70}ms` }}>
            <Icon aria-hidden="true" /><h3>{title}</h3><p>{subtitle}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LearningSection
