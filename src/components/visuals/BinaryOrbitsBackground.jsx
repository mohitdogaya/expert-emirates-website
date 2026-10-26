import { useEffect, useState } from 'react'
import BinaryOrbits from './BinaryOrbits.jsx'

function BinaryOrbitsBackground({ sections = [] }) {
  const [visible, setVisible] = useState(false)
  const [started, setStarted] = useState(false)
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 760px), (pointer: coarse)').matches,
  )

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
      stars={compact ? 18000 : 48000}
      starSize={compact ? 1.3 : 1.3}
      sparkle={compact ? 1 : 4}
      arms={compact ? 2 : 4}
      twist={compact ? 3.2 : 4.5}
      armStrength={compact ? 1 : 0.9}
      armBrightness={compact ? 2.2 : 1}
      dust={compact ? 0 : 0.2}
      core={1.2}
      coreSize={0.012}
      orbitalStreams={compact ? 120 : 200}
      nebulaClouds={compact ? 16 : 25}
      energyArcs={compact ? 5 : 8}
      innerVoid={0}
      thickness={0.01}
      tilt={compact ? 35 : 62}
      roll={-8}
      scale={compact ? 1.9 : 0.7}
      centerX={0.5}
      centerY={compact ? 0.38 : 0.52}
      speed={-1.7}
      twinkle={compact ? 0.48 : 0.82}
      depth={0.4}
      glow={compact ? 0.2 : 0.2}
      intensity={compact ? 1.5 : 1.2}
      bloomIntensity={compact ? 0.25 : 0.6}
      colorShift={!compact}
      particleTrails={!compact}
      vortexEffect={!compact}
      maxFps={compact ? 30 : 60}
      interactive={false}
      paused={!visible}
      hoverWake={false}
      clickRipple={false}
      quality={compact ? 0.62 : 0.92}
    />
  )
}

export default BinaryOrbitsBackground
