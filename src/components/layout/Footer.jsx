import { FiArrowUp, FiBarChart2, FiInstagram, FiMail, FiSend, FiTwitter, FiYoutube } from 'react-icons/fi'
import useScrollReveal from '../home/useScrollReveal.js'
import ScrollText from '../home/ScrollText.jsx'

const footerGroups = [
  { title: 'Trading', links: [['How It Works', '#how-it-works'], ['Trading Bots', '#bots'], ['Performance', '#performance-heading']] },
  { title: 'Pages', links: [['Home', '#home'], ['Services', '#services'], ['Forecasts', '#forecasts'], ['FAQ', '#faq'], ['About', '#about'], ['Support', '#support']] },
  { title: 'Products', links: [['Client Reviews', '#client-reviews'], ['Education', '#client-reviews'], ['Product Videos', '#product-videos']] },
  { title: 'Platforms', links: [['MT5 Platform', '#how-it-works'], ['VPS Support', '#support']] },
  { title: 'Accounts', links: [['Risk Management', '#about'], ['Setup Assistance', '#support']] },
]

const socials = [
  { label: 'Instagram', Icon: FiInstagram },
  { label: 'Telegram', Icon: FiSend },
  { label: 'YouTube', Icon: FiYoutube },
  { label: 'Twitter', Icon: FiTwitter },
]

function Footer() {
  const [footerRef, footerVisible] = useScrollReveal()

  return (
    <footer className={`site-footer${footerVisible ? ' is-visible' : ''}`} ref={footerRef}>
      <div className="footer-marquee" aria-label="Secure checkout, setup support included, find your perfect Expert Advisor">
        <div className="footer-marquee-track" aria-hidden="true">
          <span>Secure Checkout <b>•</b> Setup Support Included <b>•</b> Find Your Perfect EA <b>•</b>&nbsp;</span>
          <span>Secure Checkout <b>•</b> Setup Support Included <b>•</b> Find Your Perfect EA <b>•</b>&nbsp;</span>
        </div>
      </div>

      <div className="footer-inner">
        <div className="footer-brand-row">
          <a className="footer-brand" href="#home" aria-label="Expert Emirates home">
            <FiBarChart2 aria-hidden="true" />
            <span>EXPERT<br />EMIRATES</span>
          </a>
          <button className="back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="back-to-top-label"><span>Go to Top</span><span aria-hidden="true">Go to Top</span></span>
            <span className="back-to-top-arrow"><FiArrowUp aria-hidden="true" /><FiArrowUp aria-hidden="true" /></span>
          </button>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          {footerGroups.map(({ title, links }, groupIndex) => (
            <div className="footer-link-group" key={title} style={{ transitionDelay: `${0.22 + groupIndex * 0.075}s` }}>
              <ScrollText>{title}</ScrollText>
              {links.map(([label, href], linkIndex) => (
                <a href={href} key={label} style={{ transitionDelay: `${0.3 + groupIndex * 0.075 + linkIndex * 0.035}s` }}>{label}</a>
              ))}
            </div>
          ))}
        </nav>

        <div className="footer-contact-row">
          <a className="footer-email" href="mailto:info@expertemirates.com"><FiMail aria-hidden="true" /> info@expertemirates.com</a>
          <div className="footer-socials" aria-label="Social media">
            {socials.map(({ label, Icon }) => (
              <span className="social-icon" key={label} role="img" aria-label={label} title={label}><Icon aria-hidden="true" /></span>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright © {new Date().getFullYear()} Expert Emirates. All rights reserved.</p>
          <div><a href="#contact">Privacy Policy</a><span aria-hidden="true">|</span><a href="#contact">Terms &amp; Conditions</a></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
