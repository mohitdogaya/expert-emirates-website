import { useEffect, useRef, useState } from 'react'
import { FiCheck, FiChevronDown, FiCopy, FiInstagram, FiMenu, FiSend, FiX, FiYoutube } from 'react-icons/fi'
import { MdQrCode2 } from 'react-icons/md'
import { makeQrSvg } from './qrCode.js'

const telegramUrl = 'https://t.me/expertemiratesOfficial'
const socialLinks = [
  { label: 'Telegram', href: telegramUrl, Icon: FiSend },
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: FiInstagram },
  { label: 'YouTube', href: 'https://www.youtube.com/', Icon: FiYoutube },
]

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services', dropdown: true },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Forecasts', href: '#forecasts', dropdown: true },
  { label: 'FAQ', href: '#faq' },
  { label: 'Support', href: '#support' },
  { label: 'About us', href: '#about' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef(null)

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 36)
    updateScrolled()
    window.addEventListener('scroll', updateScrolled, { passive: true })
    return () => window.removeEventListener('scroll', updateScrolled)
  }, [])

  useEffect(() => {
    if (!qrOpen) return undefined
    const closeOnOutsideClick = (event) => {
      if (!qrRef.current?.contains(event.target)) setQrOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setQrOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [qrOpen])

  const copyTelegramLink = async () => {
    try {
      await navigator.clipboard.writeText(telegramUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy the Telegram link', telegramUrl)
    }
  }

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`} id="home">
      <a className="brand" href="#home" aria-label="Expert Emirates home">
        <img className="brand-logo" src="/UseIcons/navlogo.webp" alt="Expert Emirates" />
        <img className="brand-favicon" src="/favicon.png" alt="" aria-hidden="true" />
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <FiX /> : <FiMenu />}
      </button>
      <nav className={`primary-nav${open ? ' is-open' : ''}`} aria-label="Main navigation">
        {links.map(({ label, href, dropdown }) => (
          <a href={href} key={label} onClick={() => setOpen(false)}>
            {label}{dropdown && <FiChevronDown aria-hidden="true" />}
          </a>
        ))}
      </nav>
      <div className="header-qr" ref={qrRef}>
        <button
          className="header-qr-trigger"
          type="button"
          aria-label={qrOpen ? 'Close QR code' : 'Open QR code'}
          aria-expanded={qrOpen}
          aria-controls="header-qr-popover"
          onClick={() => setQrOpen((value) => !value)}
        >
          {qrOpen ? <FiX aria-hidden="true" /> : <MdQrCode2 aria-hidden="true" />}
        </button>
        {qrOpen && (
          <div className="qr-popover" id="header-qr-popover" role="dialog" aria-label="Connect with Expert Emirates">
            <img
              className="qr-code-image"
              src={`data:image/svg+xml,${encodeURIComponent(makeQrSvg(telegramUrl))}`}
              alt="QR code linking to Expert Emirates on Telegram"
            />
            <div className="qr-link-row">
              <a href={telegramUrl} target="_blank" rel="noreferrer">t.me/expertemiratesOfficial</a>
              <button type="button" aria-label={copied ? 'Telegram link copied' : 'Copy Telegram link'} onClick={copyTelegramLink}>
                {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
              </button>
            </div>
            <div className="qr-social-links">
              {socialLinks.map(({ label, href, Icon }) => (
                <a className={`qr-social-link qr-social-${label.toLowerCase()}`} href={href} key={label} target="_blank" rel="noreferrer">
                  <Icon aria-hidden="true" />{label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <a className="login-button" href="#login">Login</a>
    </header>
  )
}

export default Navbar
