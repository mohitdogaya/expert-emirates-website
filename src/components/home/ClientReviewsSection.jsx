import AnimatedLink from './AnimatedLink.jsx'
import useScrollReveal from './useScrollReveal.js'
import ScrollText from './ScrollText.jsx'
import ReviewCarousel from './ReviewCarousel.jsx'
import '../../stylesheets/ClientReviewsSection.css'

function ClientReviewsSection() {
  const [sectionRef, visible] = useScrollReveal()

  return (
    <section className={`client-reviews-section scroll-section${visible ? ' is-visible' : ''}`} ref={sectionRef} id="client-reviews" aria-labelledby="reviews-heading">
      <div className="client-reviews-heading">
        <div className="learning-copy">
          <span className="section-eyebrow">Client reviews</span>
          <ScrollText className="scroll-title" id="reviews-heading">Real <span>Experiences.</span><br />Honest <span>Feedback.</span></ScrollText>
          <ScrollText as="p" className="scroll-copy" wordClassName="scroll-description-word">Discover how customers use Expert Emirates trading technology, explore their experiences, and learn about their setup journeys.</ScrollText>
        </div>
        <AnimatedLink href="#product-videos">Watch Client Reviews</AnimatedLink>
      </div>
      <div className="review-cards"><ReviewCarousel /></div>
    </section>
  )
}

export default ClientReviewsSection
