import { useEffect, useState } from 'react'
import Lightning from './Lightning.jsx'

function LightningBackground({ sections = [] }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const targets = sections.flatMap((selector) => {
      try {
        return Array.from(document.querySelectorAll(selector))
      } catch {
        return []
      }
    })

    if (!targets.length) {
      setVisible(false)
      return undefined
    }

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

  if (!sections.length || !visible) return null

  return (
    <div
      className="lightning-background"
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <Lightning
        color="#eab308"
        bolts={1.2}
        spread={0.6}
        branches={0.5}
        xOffset={0}
        angle={-10}
        size={1}
        thickness={1}
        glow={1}
        intensity={1}
        speed={0.8}
        flicker={0.6}
        mouseInteraction
        mouseStrength={1}
        clickStrike
        intro
        fade={0}
        opacity={0.9}
        lightMode={false}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      />
    </div>
  )
}

export default LightningBackground
