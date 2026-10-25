import { FiPlay } from "react-icons/fi";
import AnimatedLink from "./AnimatedLink.jsx";
import useScrollReveal from "./useScrollReveal.js";
import ScrollText from "./ScrollText.jsx";
import BorderGlow from "../visuals/BorderGlow.jsx";
import '../../stylesheets/ProductVideoSection.css'

function ProductVideoSection() {
  const [sectionRef, visible] = useScrollReveal();
  const videos = [
    ["Strategy Overview", "thumb-strategy"],
    ["Features & Functionality", "thumb-features"],
    ["Configuration & Settings", "thumb-settings"],
    ["Product Demonstration", "thumb-product"],
  ];
  return (
    <section
      className={`product-video-section scroll-section${visible ? " is-visible" : ""}`}
      ref={sectionRef}
      id="product-videos"
      aria-labelledby="product-videos-heading"
    >
      <div className="product-video-list">
        <div className="product-video-grid">
          {videos.map(([title, thumbnail], index) => (
            <BorderGlow
              className="product-video-card"
              key={title}
              style={{ "--item-delay": `${index * 80}ms` }}
              backgroundColor="#201f27"
              borderRadius={24}
              glowRadius={24}
            >
              <div className={`product-thumbnail ${thumbnail}`}>
                <span className="play-icon">
                  <FiPlay aria-hidden="true" />
                </span>
              </div>
              <h3>{title}</h3>
            </BorderGlow>
          ))}
        </div>
        <BorderGlow
          className="installation-guide"
          backgroundColor="#201f27"
          borderRadius={18}
          glowRadius={24}
        >
          <span className="play-icon">
            <FiPlay aria-hidden="true" />
          </span>
          <strong>Complete Bot Installation &amp; VPS Setup Guide</strong>
        </BorderGlow>
      </div>
      <div className="product-video-copy">
        <span className="section-eyebrow">Product video library</span>
        <ScrollText className="scroll-title" id="product-videos-heading">
          Explore Every <span>Bot in Detail</span>
        </ScrollText>
        <ScrollText
          as="p"
          className="scroll-copy"
          wordClassName="scroll-description-word"
        >
          Each Expert Advisor features dedicated videos to help you understand
          its functionality, configuration, and usage.
        </ScrollText>
        <AnimatedLink href="#product-videos">
          Watch Product Tutorials
        </AnimatedLink>
      </div>
    </section>
  );
}

export default ProductVideoSection;
