import { useEffect, useRef, useState } from 'react'
import Lightning from './Lightning.jsx'

const randomAt = (a, b) => {
  const value = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return value - Math.floor(value)
}

function createParticles() {
  const particles = []
  for (let index = 0; index < 350; index += 1) {
    particles.push({
      key: index,
      x: 36 + randomAt(index, 1) * 1528,
      y: randomAt(index, 2) * 6400,
      radius: 0.8 + randomAt(index, 3) * 2.7,
      opacity: 0.2 + randomAt(index, 4) * 0.6,
      fallDelay: -(randomAt(index, 5) * 6),
      fallDuration: 3.2 + randomAt(index, 6) * 3.8,
    })
  }

  return particles
}

const particles = createParticles()

function LightningBackground({ sections = [], excludedSections = [] }) {
  const backgroundRef = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const background = backgroundRef.current
    if (!background) return undefined

    const getTargets = (selectors) => selectors.flatMap((selector) => {
      try {
        return Array.from(document.querySelectorAll(selector))
      } catch {
        return []
      }
    })
    const allowedTargets = new Set()
    const excludedTargets = new Set()
    const targets = new Set()
    const visibleTargets = new Set()
    const updateActive = () => {
      const sectionVisible = [...allowedTargets].some((target) => visibleTargets.has(target))
      const excludedVisible = [...excludedTargets].some((target) => visibleTargets.has(target))
      setActive(sectionVisible && !excludedVisible)
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleTargets.add(entry.target)
        else visibleTargets.delete(entry.target)
      })
      updateActive()
    }, { threshold: 0.01 })
    const syncTargets = () => {
      const nextAllowed = new Set(getTargets(sections))
      const nextExcluded = new Set(getTargets(excludedSections))
      const nextTargets = new Set([...nextAllowed, ...nextExcluded])

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

      allowedTargets.clear()
      nextAllowed.forEach((target) => allowedTargets.add(target))
      excludedTargets.clear()
      nextExcluded.forEach((target) => excludedTargets.add(target))
      updateActive()
    }

    // Keep targets current as lazy routes mount and unmount.
    const mutationObserver = new MutationObserver(syncTargets)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
    syncTargets()
    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [sections, excludedSections])

  return (
    <div
      ref={backgroundRef}
      className={`lightning-background${active ? ' is-active' : ''}`}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <svg className="landing-rain-art" viewBox="0 0 1600 6400" preserveAspectRatio="none" focusable="false">
        <defs>
          <radialGradient id="gold-particle">
            <stop offset="0%" stopColor="#fff6c8" />
            <stop offset="38%" stopColor="#f4d45a" />
            <stop offset="100%" stopColor="#a9780c" />
          </radialGradient>
        </defs>
        <g className="landing-rain-particles" fill="url(#gold-particle)">
          {particles.map((particle) => (
            <circle
              key={particle.key}
              className="landing-particle-fall"
              cx={particle.x.toFixed(1)}
              cy={particle.y.toFixed(1)}
              r={particle.radius.toFixed(1)}
              opacity={particle.opacity.toFixed(2)}
              style={{ '--fall-delay': `${particle.fallDelay.toFixed(2)}s`, '--fall-duration': `${particle.fallDuration.toFixed(2)}s` }}
            />
          ))}
        </g>
      </svg>
      <Lightning
        color="#eab308"
        bolts={1}
        spread={0.6}
        branches={0.5}
        xOffset={0}
        angle={-10}
        size={1}
        thickness={1}
        glow={0.35}
        intensity={0.4}
        speed={0.6}
        flicker={0.4}
        mouseInteraction
        mouseStrength={1}
        clickStrike
        intro
        paused={!active}
        fade={0}
        opacity={0.025}
        lightMode={false}
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: 'transparent' }}
      />
    </div>
  )
}

export default LightningBackground
