import { useEffect, useRef } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import { features } from './homeData.js'
import './FeatureSection.css'

function FeatureCard({ title, image }) {
  const cardRef = useRef(null)

  const handlePointerMove = (event) => {
    const card = cardRef.current
    if (!card) return
    const b = card.getBoundingClientRect()
    const x = event.clientX - b.left
    const y = event.clientY - b.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
    card.style.setProperty('--tilt-x', `${((y / b.height) - 0.5) * -4}deg`)
    card.style.setProperty('--tilt-y', `${((x / b.width) - 0.5) * 4}deg`)
  }

  const resetPointer = () => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--tilt-x', '0deg')
    card.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <div className="feature-stage">
      <article
        ref={cardRef}
        className="feature-card"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <div className="feature-spotlight" aria-hidden="true" />
        <div className="feature-graphic">
          <img src={image} alt="" aria-hidden="true" />
        </div>
        <h3 className="feature-title">{title}</h3>
        <span className="feature-arrow" aria-hidden="true">
          <FiArrowUpRight />
        </span>
      </article>
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

    let ticking = false

    const update = () => {
      const rect = section.getBoundingClientRect()
      const viewH = window.innerHeight

      /*
        scrollProgress:
          0 = section top hits viewport top
          1 = section bottom hits viewport bottom
      */
      const scrollable = rect.height - viewH
      if (scrollable <= 0) return

      const raw = -rect.top / scrollable
      const scrollProgress = Math.max(0, Math.min(1, raw))

      /*
        stagger: gap between each card's start
        duration: how quickly each card snaps in

        With 8 cards:
          0.10 × 7 + 0.08 = 0.78  (fits inside 0–1)
      */
      const stagger = 0.10
      const duration = 0.08

      cards.forEach((card, i) => {
        const start = i * stagger
        const end = start + duration

        let p = (scrollProgress - start) / (end - start)
        p = Math.max(0, Math.min(1, p))

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

      {/* sticky wrapper keeps grid pinned while section scrolls */}
      <div className="feature-sticky">
        <div className="feature-grid">
          {features.map(({ title, image }, index) => (
            <FeatureCard key={title} title={title} image={image} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureSection