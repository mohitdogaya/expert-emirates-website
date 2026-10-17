import AnimatedLink from './AnimatedLink.jsx'
import useScrollReveal from './useScrollReveal.js'
import ScrollText from './ScrollText.jsx'

function VpsSupportSection() {
  const [sectionRef, visible] = useScrollReveal()
  const supportItems = [
    'VPS Setup Guidance',
    'MT5 Installation Assistance',
    'EA Configuration Instructions',
    'Domain Setup Assistance',
    'Technical Troubleshooting',
    'Product Documentation',
  ]

  return (
    <section className={`vps-support-section${visible ? ' is-visible' : ''}`} ref={sectionRef} id="support" aria-labelledby="vps-heading">
      <div className="vps-copy">
        <span className="section-eyebrow">VPS &amp; technical support</span>
        <ScrollText id="vps-heading">Stay Connected to<br />Your Trading Setup</ScrollText>
        <p>Get guidance on VPS, MT5 installation, configuration, and troubleshooting.</p>
        <AnimatedLink href="mailto:support@expertemirates.com">Get Technical Support</AnimatedLink>
      </div>
      <img className="vps-illustration" src="/UseIcons/cta-section-img.png" alt="Cloud VPS server illustration" />
      <ul className="vps-support-list">
        {supportItems.map((item, index) => (
          <li key={item} style={{ '--item-delay': `${index * 85}ms` }}>
            <img src="/UseIcons/arrow-icon.png" alt="" aria-hidden="true" /><span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default VpsSupportSection
