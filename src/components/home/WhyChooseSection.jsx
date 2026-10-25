import { reasons } from './homeData.js'
import useScrollReveal from './useScrollReveal.js'
import ScrollText from './ScrollText.jsx'
import BorderGlow from '../visuals/BorderGlow.jsx'

function WhyChooseSection() {
  const [sectionRef, isVisible] = useScrollReveal()

  return (
    <section
      className={`why-section${isVisible ? ' is-visible' : ''}`}
      id="about"
      aria-labelledby="why-heading"
      ref={sectionRef}
    >
      <div className="why-heading-block">
        <span className="why-eyebrow">Why choose Expert Emirates</span>
        <ScrollText id="why-heading" className="why-scroll-title"><span>Technology Designed for</span><span>Systematic Trading</span></ScrollText>
      </div>
      <div className="why-grid">
        {reasons.map(([title, description], index) => (
          <BorderGlow className="why-card" key={title} style={{ '--why-delay': `${index * 75}ms` }} backgroundColor="#201f27" borderRadius={25} glowRadius={24}>
            <h3>{title}</h3>
            <p>{description}</p>
          </BorderGlow>
        ))}
      </div>
    </section>
  )
}

export default WhyChooseSection
