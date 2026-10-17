import { steps } from './homeData.js'
import useScrollReveal from './useScrollReveal.js'
import ScrollText from './ScrollText.jsx'

function HowItWorksSection() {
  const [sectionRef, visible] = useScrollReveal()

  return (
    <section className={`how-section scroll-section${visible ? ' is-visible' : ''}`} ref={sectionRef} id="how-it-works" aria-labelledby="how-heading">
      <div className="how-intro">
        <span className="section-eyebrow">How it works</span>
        <ScrollText className="scroll-title" id="how-heading">Start Your Automated<br />Trading Journey</ScrollText>
        <div className="how-robot" role="img" aria-label="Expert Emirates trading assistant robot" />
      </div>
      <ol className="how-steps">
        {steps.map(([title, description], index) => (
          <li className="how-step" key={title} style={{ '--item-delay': `${index * 100}ms` }}>
            <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
            <div className="step-card"><h3>{title}</h3><p>{description}</p></div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default HowItWorksSection
