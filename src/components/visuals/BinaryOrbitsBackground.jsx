import { useEffect, useState } from 'react'
import BinaryOrbits from './BinaryOrbits.jsx'

function BinaryOrbitsBackground({ sections = [] }) {
  const [visible, setVisible] = useState(false)
  const [started, setStarted] = useState(false)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px), (pointer: coarse)')
    const updateCompact = () => setCompact(media.matches)
    updateCompact()
    media.addEventListener('change', updateCompact)
    return () => media.removeEventListener('change', updateCompact)
  }, [])

  useEffect(() => {
    const targets = new Set()
    const visibleTargets = new Set()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleTargets.add(entry.target)
        else visibleTargets.delete(entry.target)
      })
      const isVisible = visibleTargets.size > 0
      setVisible(isVisible)
      if (isVisible) setStarted(true)
    }, { threshold: 0.01 })
    const syncTargets = () => {
      const nextTargets = new Set(sections.flatMap((selector) => {
        try {
          return Array.from(document.querySelectorAll(selector))
        } catch {
          return []
        }
      }))

      targets.forEach((target) => {
        if (nextTargets.has(target)) return
        observer.unobserve(target)
        visibleTargets.delete(target)
        targets.delete(target)
      })
      nextTargets.forEach((target) => {
        if (targets.has(target)) return
        targets.add(target)
        observer.observe(target)
      })
      setVisible(visibleTargets.size > 0)
    }

    // Keep targets current as lazy routes mount and unmount.
    const mutationObserver = new MutationObserver(syncTargets)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
    syncTargets()
    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [sections])

  const backgroundStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    width: '100vw',
    height: '100vh',
    minHeight: 0,
    pointerEvents: 'none',
    opacity: visible ? 1 : 0,
    transition: 'opacity 400ms ease',
  }

  if (!started) {
    return <div className="binary-orbits-background" style={backgroundStyle} aria-hidden="true" />
  }

  return (
    <BinaryOrbits
      className="binary-orbits-background"
      style={backgroundStyle}
      colors={['#fde35f', '#ffed4e']}
      backgroundColor="#0A0A0A"
      mode="auto"
      stars={compact ? 12000 : 32000}
      starSize={compact ? 1.15 : 1.3}
      sparkle={4}
      arms={4}
      twist={4.5}
      armStrength={0.9}
      dust={0.2}
      core={1.2}
      coreSize={0.012}
      innerVoid={0}
      thickness={0.01}
      tilt={compact ? 50 : 62}
      roll={-8}
      scale={compact ? 1.5 : 0.7}
      centerX={0.5}
      centerY={compact ? 0.6 : 0.52}
      speed={-1.7}
      twinkle={0.82}
      depth={0.4}
      glow={0.2}
      intensity={1.2}
      interactive={false}
      paused={!visible}
      hoverWake={false}
      clickRipple={false}
      quality={compact ? 0.55 : 0.72}
    />
  )
}

export default BinaryOrbitsBackground
