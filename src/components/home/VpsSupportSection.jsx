import { lazy, Suspense } from "react";
import AnimatedLink from "./AnimatedLink.jsx";
import useScrollReveal from "./useScrollReveal.js";
import ScrollText from "./ScrollText.jsx";

const WebThreads = lazy(() => import("../visuals/WebThreads.jsx"));

function VpsSupportSection() {
  const [sectionRef, visible] = useScrollReveal();
  const supportItems = [
    "VPS Setup Guidance",
    "MT5 Installation Assistance",
    "EA Configuration Instructions",
    "Domain Setup Assistance",
    "Technical Troubleshooting",
    "Product Documentation",
  ];

  return (
    <section
      className={`vps-support-section${visible ? " is-visible" : ""}`}
      ref={sectionRef}
      id="support"
      aria-labelledby="vps-heading"
    >
      <div className="vps-support-threads" aria-hidden="true">
        <Suspense fallback={null}>
          <WebThreads
            colors={["#ffd727", "#fffd9f"]}
            coreColor="#FFFFFF"
            threadCount={8}
            spread={0.18}
            lightMode={false}
            speed={0.2}
            frequency={5}
            taper={1}
            position={0.5}
            pinch={0.5}
            nodes={1}
            angle={15}
            glow={0.01}
            falloff={0.6}
            thickness={1.1}
            brightness={0.6}
            opacity={1}
            depth={0}
            pulses={0}
            mirror
            shimmer={false}
            fade={0}
            grain={0.05}
            intro
            mouseInteraction
            mouseStrength={0.5}
            pulseOnClick
            paused={false}
          />
        </Suspense>
      </div>
      <div className="vps-copy">
        <span className="section-eyebrow">VPS &amp; technical support</span>
        <ScrollText id="vps-heading">
          Stay Connected to
          <br />
          Your Trading Setup
        </ScrollText>
        <p>
          Get guidance on VPS, MT5 installation, configuration, and
          troubleshooting.
        </p>
        <AnimatedLink href="mailto:support@expertemirates.com">
          Get Technical Support
        </AnimatedLink>
      </div>
      <img
        className="vps-illustration"
        src="/UseIcons/cta-section-img.png"
        alt="Cloud VPS server illustration"
      />
      <ul className="vps-support-list">
        {supportItems.map((item, index) => (
          <li key={item} style={{ "--item-delay": `${index * 85}ms` }}>
            <img src="/UseIcons/arrow-icon.png" alt="" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default VpsSupportSection;
