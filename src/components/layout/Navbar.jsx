import { useState } from 'react'
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services', dropdown: true },
  { label: 'Forecasts', href: '#forecasts', dropdown: true },
  { label: 'FAQ', href: '#faq' },
  { label: 'Support', href: '#support' },
  { label: 'About us', href: '#about' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header" id="home">
      <a className="brand" href="#home" aria-label="Expert Emirates home">
        <img src="/UseIcons/navlogo.webp" alt="Expert Emirates" />
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
      <a className="login-button" href="#login">Login</a>
    </header>
  )
}

export default Navbar
