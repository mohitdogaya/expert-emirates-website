import { useEffect, useRef, useState } from 'react'
import { FiCheck, FiChevronDown, FiCopy, FiInstagram, FiMenu, FiSend, FiX, FiYoutube } from 'react-icons/fi'
import { MdQrCode2 } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { makeQrSvg } from './qrCode.js'

const telegramUrl = 'https://t.me/expertemiratesOfficial'
const socialLinks = [
  { label: 'Telegram', href: telegramUrl, Icon: FiSend },
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: FiInstagram },
  { label: 'YouTube', href: 'https://www.youtube.com/', Icon: FiYoutube },
]

const links = [
  { label: 'Home', href: '#home' },
  {
    label: 'Services',
    children: [
      { label: 'Forex + Gold', href: '#bots' },
      { label: 'Crypto', href: '#bots' },
      { label: 'Portfolio Management', href: '#performance-heading' },
      { label: 'Copy Trading', href: '#how-it-works' },
    ],
  },
  {
    label: 'Forecasts',
    children: [
      { label: 'Company News', href: '#forecasts' },
      { label: 'Awards', href: '#forecasts' },
    ],
  },
  { label: 'FAQ', href: '#faq' },
  { label: 'Support', href: '#support' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '/contact' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [qrOpen, setQrOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!openDropdown) return undefined
    const closeOnOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setOpenDropdown(null)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [openDropdown])

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
    <header className="site-header" id="home">
      <a className="brand" href="#home" aria-label="Expert Emirates home">
        <img className="brand-logo" src="/UseIcons/navlogo.webp" alt="Expert Emirates" />
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
        {links.map(({ label, href, children }) => (
          children ? (
            <div
              className={`nav-dropdown${openDropdown === label ? ' is-open' : ''}`}
              key={label}
              ref={openDropdown === label ? dropdownRef : null}
            >
              <button
                className="nav-dropdown-trigger"
                type="button"
                aria-expanded={openDropdown === label}
                onClick={() => setOpenDropdown((current) => current === label ? null : label)}
              >
                {label}<FiChevronDown aria-hidden="true" />
              </button>
              <div className="nav-submenu">
                {children.map((child) => (
                  <Link to={`/${child.href}`} key={child.label} onClick={() => { setOpen(false); setOpenDropdown(null) }}>
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link to={href.startsWith('/') ? href : `/${href}`} key={label} onClick={() => setOpen(false)}>
              {label}
            </Link>
          )
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
