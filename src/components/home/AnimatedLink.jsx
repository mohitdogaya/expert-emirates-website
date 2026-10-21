import { FiArrowUpRight } from 'react-icons/fi'
import Magnet from '../visuals/Magnet.jsx'

function AnimatedLink({ href, children, className = '' }) {
  return (
    <Magnet padding={100} magnetStrength={4}>
      <a className={`button button-light animated-link ${className}`} href={href}>
        <span className="button-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>
        <FiArrowUpRight aria-hidden="true" />
      </a>
    </Magnet>
  )
}

export default AnimatedLink
