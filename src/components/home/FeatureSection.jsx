import { FiArrowUpRight } from 'react-icons/fi'
import { features } from './homeData.js'
import useScrollReveal from './useScrollReveal.js'

function FeatureSection() {
  const [sectionRef, visible] = useScrollReveal()

  return (
    <section className={`feature-section${visible ? ' is-visible' : ''}`} id="services" aria-labelledby="feature-heading" ref={sectionRef}>
      <h2 id="feature-heading" className="visually-hidden">Trading platform features</h2>
      <div className="feature-grid">
        {features.map(({ title, image }, index) => (
          <article className="feature-card" key={title} style={{ '--card-delay': `${index * 100}ms` }}>
            <div className="feature-graphic"><img src={image} alt="" aria-hidden="true" /></div>
            <div className="feature-lines" aria-hidden="true" />
            <h3 className="feature-title">{title}</h3>
            <span className="feature-arrow" aria-hidden="true"><FiArrowUpRight /></span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeatureSection
