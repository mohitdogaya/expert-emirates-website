import { FiArrowUpRight } from 'react-icons/fi'

function AnimatedLink({ href, children, className = '' }) {
  return (
    <a className={`button button-light animated-link ${className}`} href={href}>
      <span className="button-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>
      <FiArrowUpRight aria-hidden="true" />
    </a>
  )
}

export default AnimatedLink
