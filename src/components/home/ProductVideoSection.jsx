import { FiPlay } from 'react-icons/fi'
import AnimatedLink from './AnimatedLink.jsx'
import useScrollReveal from './useScrollReveal.js'

function ProductVideoSection() {
  const [sectionRef, visible] = useScrollReveal()
  const videos = [
    ['Strategy Overview', 'thumb-strategy'],
    ['Features & Functionality', 'thumb-features'],
    ['Configuration & Settings', 'thumb-settings'],
    ['Product Demonstration', 'thumb-product'],
  ]
  return (
    <section className={`product-video-section scroll-section${visible ? ' is-visible' : ''}`} ref={sectionRef} id="product-videos" aria-labelledby="product-videos-heading">
      <div className="product-video-list">
        <div className="product-video-grid">
          {videos.map(([title, thumbnail], index) => (
            <article className="product-video-card" key={title} style={{ '--item-delay': `${index * 80}ms` }}>
              <div className={`product-thumbnail ${thumbnail}`}><span className="play-icon"><FiPlay aria-hidden="true" /></span></div>
              <h3>{title}</h3>
            </article>
          ))}
        </div>
        <div className="installation-guide"><span className="play-icon"><FiPlay aria-hidden="true" /></span><strong>Complete Bot Installation &amp; VPS Setup Guide</strong></div>
      </div>
      <div className="product-video-copy">
        <span className="section-eyebrow">Product video library</span>
        <h2 className="scroll-title" id="product-videos-heading">Explore Every <span>Bot in Detail</span></h2>
        <p className="scroll-copy">Each Expert Advisor features dedicated videos to help you understand its functionality, configuration, and usage.</p>
        <AnimatedLink href="#product-videos">Watch Product Tutorials</AnimatedLink>
      </div>
    </section>
  )
}

export default ProductVideoSection
