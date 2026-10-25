import { useEffect, useRef } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import { features } from './homeData.js'
import BorderGlow from '../visuals/BorderGlow.jsx'
import '../../stylesheets/FeatureSection.css'

function FeatureCard({ title, image }) {
  const handlePointerMove = (event) => {
    const card = event.currentTarget
    if (!card) return
    const b = card.getBoundingClientRect()
    const x = event.clientX - b.left
    const y = event.clientY - b.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div className="feature-stage">
      <BorderGlow
        className="feature-card"
        onPointerMove={handlePointerMove}
        backgroundColor="#1e1c25"
        borderRadius={20}
        glowColor="40 80 80"
        glowRadius={24}
        glowIntensity={1}
        colors={['#c084fc', '#f472b6', '#38bdf8']}
      >
        <div className="" aria-hidden="true" />
        <div className="feature-graphic">
          <img src={image} alt="" aria-hidden="true" />
        </div>
        <h3 className="feature-title">{title}</h3>
        <span className="feature-arrow" aria-hidden="true">
          <FiArrowUpRight />
        </span>
      </BorderGlow>
    </div>
  )
}

function FeatureSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = Array.from(section.querySelectorAll('.feature-card'))
    if (!cards.length) return

    section.style.setProperty('--card-count', cards.length)

    let ticking = false

    const update = () => {
      const rect = section.getBoundingClientRect()
      const viewH = window.innerHeight
      // Begin the reveal as the feature section enters the viewport, then
      // finish by the time it reaches the top so there is no empty black pause.
      const triggerDistance = viewH * 0.8
      const scrollProgress = Math.max(
        0,
        Math.min(1, (triggerDistance - rect.top) / triggerDistance),
      )

      const n = cards.length
      const pad = 0.02          // tiny dead zone at start/end
      const usable = 1 - pad * 2
      const duration = 0.3      // overlap reveals so the middle cards do not pause

      cards.forEach((card, i) => {
        const normalized = n > 1 ? i / (n - 1) : 0.5
        const start = pad + normalized * (usable - duration)
        const end = start + duration

        let p = (scrollProgress - start) / (end - start)
        p = Math.max(0, Math.min(1, p))
        // Smooth the start and finish of each card's scroll-driven reveal.
        p = p * p * (3 - 2 * p)

        card.style.setProperty('--progress', p)
      })

      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="feature-section"
      id="services"
      aria-labelledby="feature-heading"
    >
      <h2 id="feature-heading" className="visually-hidden">
        Trading platform features
      </h2>
      <div className="feature-sticky">
        <div className="feature-grid">
          {features.map(({ title, image }) => (
            <FeatureCard key={title} title={title} image={image} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection
