import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiChevronDown, FiZap } from 'react-icons/fi'
import { metrics, strategies } from './homeData.js'
import useScrollReveal from './useScrollReveal.js'

function CountUp({ value, format, active }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return undefined
    const duration = 1500
    let frame
    let start
    const animate = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 4
      setCount(value * eased)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [active, value])

  return <>{format(count)}</>
}

function HeroSection() {
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0])
  const [heroRef, heroVisible] = useScrollReveal()

  return (
    <section className={`hero-card${heroVisible ? ' is-visible' : ''}`} aria-labelledby="hero-title" ref={heroRef}>
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/Figma/hero-section.png"
        aria-hidden="true"
      >
        <source src="/Figma/heo-section-bg-video.mp4" type="video/mp4" />
      </video>
      <div className="hero-scrim" />

      <div className="hero-topline">
        <div className="hero-copy">
          <span className="eyebrow"><FiZap aria-hidden="true" /> Next-gen algorithmic trading</span>
          <h1 id="hero-title" className="text-reveal"><span className="reveal-line">Automate Your</span><span className="reveal-line reveal-line-gold">Trading Strategy</span></h1>
          <p className="description-reveal">
            Convert your manual strategy into a fully automated MT5 Expert Advisor
            with professional risk management and institutional-grade execution logic.
          </p>
        </div>

        <div className="hero-metrics" aria-label="Platform performance">
          {metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <strong><CountUp value={metric.value} format={metric.format} active={heroVisible} /></strong>
              <span>{metric.label}</span>
            </div>
          ))}
          <div className="hero-actions">
            <a className="button button-light" href="#bots"><span className="button-label"><span>Explore Our Bots</span><span aria-hidden="true">Explore Our Bots</span></span><FiArrowUpRight aria-hidden="true" /></a>
            <a className="button button-outline" href="#demo"><span className="button-label"><span>Watch Demo</span><span aria-hidden="true">Watch Demo</span></span><FiArrowUpRight aria-hidden="true" /></a>
          </div>
        </div>
      </div>

      <div className="hero-bottom">
        <div className="strategy-list" id="bots" aria-label="Choose a trading bot">
          {strategies.map((strategy) => (
            <button
              className={`strategy-chip${selectedStrategy === strategy ? ' is-selected' : ''}`}
              key={strategy}
              type="button"
              onClick={() => setSelectedStrategy(strategy)}
              aria-pressed={selectedStrategy === strategy}
            >
              {strategy}
            </button>
          ))}
        </div>
        <div className="account-stats" aria-label={`${selectedStrategy} account settings`}>
          <div><strong>5%</strong><span>Allocation</span></div>
          <div><strong>$1,000</strong><span>Account Size</span></div>
          <div><strong>0.05–0.3</strong><span>Value</span></div>
          <div><strong>5%</strong><span>Risk</span></div>
          <div><strong>100%</strong><span>Target</span></div>
          <div><strong>70% hedge</strong><span>Hedge</span></div>
        </div>
      </div>
      <a className="scroll-cue" href="#bots" aria-label="Scroll to bot options"><FiChevronDown aria-hidden="true" /></a>
    </section>
  )
}

export default HeroSection
