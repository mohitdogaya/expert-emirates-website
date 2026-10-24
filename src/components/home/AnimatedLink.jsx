import { FiArrowUpRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Magnet from '../visuals/Magnet.jsx'

function AnimatedLink({ href, to, children, className = '' }) {
  return (
    <Magnet padding={100} magnetStrength={5}>
      {to ? (
        <Link to={to} className={`button button-light animated-link ${className}`}>
          <span className="button-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>
          <FiArrowUpRight aria-hidden="true" />
        </Link>
      ) : (
        <a href={href} className={`button button-light animated-link ${className}`}>
          <span className="button-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>
          <FiArrowUpRight aria-hidden="true" />
        </a>
      )}
    </Magnet>
  )
}

export default AnimatedLink
