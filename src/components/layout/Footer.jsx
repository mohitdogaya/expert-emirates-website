import { useRef, useState } from 'react'
import { FiAperture, FiArrowUp, FiCircle, FiInstagram, FiMail, FiPlus, FiSend, FiStar, FiSun, FiTwitter, FiYoutube, FiZap } from 'react-icons/fi'
import useScrollReveal from '../home/useScrollReveal.js'
import ScrollText from '../home/ScrollText.jsx'
import ParticleText from '../visuals/ParticleText.jsx'
import TextLoop from '../visuals/TextLoop.jsx'
import '../../stylesheets/Footer.css'

const footerGroups = [
  { title: 'Trade', links: [['Dashboard', '#home']] },
  { title: 'Pages', links: [['Home', '#home'], ['Services', '#services'], ['Forecasts', '#forecasts'], ['FAQ', '#faq'], ['About', '#about'], ['Support', '#support']] },
  { title: 'Products', links: [['Forex + Gold', '#bots'], ['Cryptocurrency', '#bots'], ['Portfolio Management', '#performance-heading'], ['Copy Trading', '#how-it-works']] },
  { title: 'Platform', links: [['MT4 Platform', '#how-it-works'], ['MT5 Platform', '#how-it-works']] },
  { title: 'Accounts', links: [['Standard', '#pricing'], ['Pro', '#pricing'], ['Ultra', '#pricing']] },
]

const socials = [
  { label: 'Instagram', Icon: FiInstagram },
  { label: 'Telegram', Icon: FiSend },
  { label: 'YouTube', Icon: FiYoutube },
  { label: 'Twitter', Icon: FiTwitter },
]

const footerCursorIcons = [FiAperture, FiCircle, FiPlus, FiStar, FiSun, FiZap]
const footerIconColors = ['#e8c743', '#f5f3f2', '#8be7e1', '#f6a6cf']

function Footer() {
  const [footerRef, footerVisible] = useScrollReveal()
  const [cursorIcons, setCursorIcons] = useState([])
  const lastIconAt = useRef(0)
  const iconId = useRef(0)

  const showCursorIcon = (event) => {
    const now = performance.now()
    if (now - lastIconAt.current < 75) return
    lastIconAt.current = now

    const bounds = event.currentTarget.getBoundingClientRect()
    const Icon = footerCursorIcons[Math.floor(Math.random() * footerCursorIcons.length)]
    const offset = 12 + Math.random() * 26
    const id = iconId.current++
    setCursorIcons((icons) => [...icons, {
      id,
      Icon,
      x: event.clientX - bounds.left + (Math.random() - 0.5) * offset,
      y: event.clientY - bounds.top + (Math.random() - 0.5) * offset,
      size: 14 + Math.random() * 12,
      rotation: Math.round(Math.random() * 70 - 35),
      color: footerIconColors[Math.floor(Math.random() * footerIconColors.length)],
    }])
  }

  const removeCursorIcon = (id) => {
    setCursorIcons((icons) => icons.filter((icon) => icon.id !== id))
  }

  return (
    <footer className={`site-footer${footerVisible ? ' is-visible' : ''}`} ref={footerRef}>
      <div className="footer-marquee">
        <TextLoop
          text="Meet Your Trading Edge • Discover Expert Advisors • Gold Trading"
          shape="wave"
          speed={90}
          direction="forward"
          separator="✦"
          curviness={12}
          tilt={0}
          fontSize={36}
          fontWeight={800}
          letterSpacing={2}
          uppercase
          ribbon
          color="#000000"
          ribbonColor="#FFD700"
          ribbonWidth={46}
          edgeFade={0}
          cross={false}
          crossAngle={16}
          draggable={false}
          scrollBoost={0}
          outline={false}
          pauseOnHover
          outlineWidth={1.5}
        />
      </div>

      <div className="footer-inner">
        <div className="footer-brand-row">
          <a className="footer-brand" href="#home" aria-label="Expert Emirates home">
            <img src="/UseIcons/navlogo.webp" alt="Expert Emirates" />
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

        <div className="footer-wordmark" aria-hidden="true" onPointerMove={showCursorIcon}>
          {cursorIcons.map(({ id, Icon, x, y, size, rotation, color }) => (
            <Icon
              className="footer-cursor-icon"
              key={id}
              style={{ left: x, top: y, width: size, height: size, color, '--icon-rotation': `${rotation}deg` }}
              onAnimationEnd={() => removeCursorIcon(id)}
            />
          ))}
          <ParticleText
            text="EXPERT EMIRATES"
            className="footer-particle-text"
            style={{ width: '100%', height: '100%' }}
            particleSize={2.2}
            density={4}
            color="currentColor"
            highlightColor="#ff5a36"
            highlightMode="motion"
            shape="circle"
            intro="gather"
            scatter={190}
            gatherDuration={1600}
            stagger={420}
            clickBurst
            burstStrength={1}
            pointerRepel={42}
            repelRadius={120}
            idleDrift={0.8}
            trigger="mount"
            fontSize="clamp(4.5rem, 20vw, 16rem)"
            fontWeight={800}
            fontFamily="inherit"
            glow
          />
        </div>

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
