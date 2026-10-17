import { reasons } from './homeData.js'
import useScrollReveal from './useScrollReveal.js'

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
        <h2 id="why-heading"><span>Technology Designed for</span><span>Systematic Trading</span></h2>
      </div>
      <div className="why-grid">
        {reasons.map(([title, description], index) => (
          <article className="why-card" key={title} style={{ '--why-delay': `${index * 75}ms` }}>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WhyChooseSection
