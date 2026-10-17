import useScrollReveal from './useScrollReveal.js'
import AnimatedLink from './AnimatedLink.jsx'
import ScrollText from './ScrollText.jsx'

function PerformanceSection() {
  const [sectionRef, visible] = useScrollReveal()
  return (
    <section className={`performance-section scroll-section${visible ? ' is-visible' : ''}`} ref={sectionRef} aria-labelledby="performance-heading">
      <div className="performance-copy">
        <span className="section-eyebrow">Performance &amp; Myfxbook integration</span>
        <ScrollText className="scroll-title" id="performance-heading">Real <span>Data.</span><br />Greater <span>Transparency.</span></ScrollText>
        <ScrollText as="p" className="scroll-copy" wordClassName="scroll-description-word">Evaluate trading performance using available account statistics and verified reporting. Review equity growth, drawdown, trade history, and more through supported Myfxbook integration.</ScrollText>
        <AnimatedLink href="#client-reviews">View Verified Performance</AnimatedLink>
        <p className="risk-note">Trading involves risk. Historical performance does not guarantee future results.</p>
      </div>
      <div className="performance-panel" aria-label="Illustrative verified performance chart">
        <div className="chart-heading"><strong>Verified Performance</strong><span className="myfx-logo">my<span>fx</span>book</span></div>
        <div className="chart-wrap">
          <div className="chart-y-labels"><span>150%</span><span>100%</span><span>50%</span><span>0%</span></div>
          <svg className="performance-chart" viewBox="0 0 780 220" role="img" aria-label="Illustrative upward performance graph" preserveAspectRatio="none">
            <defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00e89a" stopOpacity=".55" /><stop offset="100%" stopColor="#00e89a" stopOpacity=".04" /></linearGradient></defs>
            {[25, 75, 125, 175].map((y) => <line key={y} x1="0" x2="780" y1={y} y2={y} className="chart-gridline" />)}
            {[145, 300, 455, 610].map((x) => <line key={x} x1={x} x2={x} y1="0" y2="200" className="chart-gridline" />)}
            <path d="M0 178 L40 168 L72 170 L102 151 L132 157 L164 139 L198 145 L228 126 L260 131 L291 111 L322 118 L353 101 L382 107 L414 82 L443 89 L475 65 L502 75 L530 56 L557 60 L587 42 L617 53 L647 34 L676 42 L709 21 L744 27 L780 8 V200 H0 Z" fill="url(#chart-fill)" />
            <path d="M0 178 L40 168 L72 170 L102 151 L132 157 L164 139 L198 145 L228 126 L260 131 L291 111 L322 118 L353 101 L382 107 L414 82 L443 89 L475 65 L502 75 L530 56 L557 60 L587 42 L617 53 L647 34 L676 42 L709 21 L744 27 L780 8" className="chart-line" />
            <circle cx="780" cy="8" r="5" className="chart-point" />
          </svg>
        </div>
        <div className="chart-stats">
          <div><strong>+152.4%</strong><span>Total Return</span></div><div><strong>8.2%</strong><span>Max Drawdown</span></div><div><strong>1,248</strong><span>Total Trades</span></div><div><strong>82.6%</strong><span>Win Rate</span></div>
        </div>
        <small className="chart-disclaimer">Illustrative example for demonstration purposes.</small>
      </div>
    </section>
  )
}

export default PerformanceSection
