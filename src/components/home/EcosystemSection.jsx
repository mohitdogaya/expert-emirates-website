import useScrollReveal from './useScrollReveal.js'
import ScrollText from './ScrollText.jsx'

function EcosystemSection() {
  const [sectionRef, visible] = useScrollReveal()
  const stats = [
    ['05', 'Trading Bots'],
    ['Live', 'Performance Reporting'],
    ['Capital', 'Flexible Compatibility'],
    ['$10,000', 'Maximum Trading Capital Invest'],
    ['100+ Clients', 'Verified customer count'],
  ]

  return (
    <section className={`ecosystem-section scroll-section${visible ? ' is-visible' : ''}`} ref={sectionRef} id="forecasts" aria-labelledby="ecosystem-heading">
      <div className="ecosystem-intro">
        <div>
          <span className="section-eyebrow">The Expert Emirates ecosystem</span>
          <ScrollText className="scroll-title" id="ecosystem-heading">Automation Meets<br />Practical Support.</ScrollText>
        </div>
        <p className="scroll-copy">Explore automated trading technology, specialized Expert Advisors, and tools designed to support your trading journey.</p>
      </div>
      <div className="ecosystem-stats">
        {stats.map(([value, label], index) => (
          <div className="ecosystem-stat" key={label} style={{ '--item-delay': `${index * 90}ms` }}>
            <strong>{value}</strong><span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EcosystemSection
