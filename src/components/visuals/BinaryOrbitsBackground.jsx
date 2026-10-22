import { useEffect, useState } from 'react'
import BinaryOrbits from './BinaryOrbits.jsx'

function BinaryOrbitsBackground({ sections = [] }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const targets = sections.flatMap((selector) => {
      try {
        return Array.from(document.querySelectorAll(selector))
      } catch {
        return []
      }
    })

    if (!targets.length) return undefined

    const visibleTargets = new Set()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleTargets.add(entry.target)
        else visibleTargets.delete(entry.target)
      })
      setVisible(visibleTargets.size > 0)
    }, { threshold: 0.01 })

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [sections])

  return (
    <BinaryOrbits
      className="binary-orbits-background"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        width: '100vw',
        height: '100vh',
        minHeight: 0,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}
      colors={['#fde35f', '#ffed4e']}
      backgroundColor="#0A0A0A"
      mode="auto"
      stars={70000}
      starSize={1.3}
      sparkle={5}
      arms={4}
      twist={4.5}
      armStrength={0.9}
      dust={0.2}
      core={1.2}
      coreSize={0.012}
      innerVoid={0}
      thickness={0.01}
      tilt={62}
      roll={-8}
      scale={0.7}
      centerX={0.5}
      centerY={0.52}
      speed={-1.7}
      twinkle={0.82}
      depth={0.4}
      glow={0.2}
      intensity={1.2}
      interactive={false}
      hoverWake={false}
      clickRipple={false}
      quality={1}
    />
  )
}

export default BinaryOrbitsBackground
