import { lazy, Suspense, useEffect, useState } from "react";
import AnimatedLink from "./AnimatedLink.jsx";
import useScrollReveal from "./useScrollReveal.js";
import ScrollText from "./ScrollText.jsx";
import '../../stylesheets/VpsSupportSection.css'

const WebThreads = lazy(() => import("../visuals/WebThreads.jsx"));

const getThreadProfile = () => {
  if (window.innerWidth <= 600) return "mobile";
  if (window.innerWidth <= 900) return "tablet";
  return "desktop";
};

const threadProfiles = {
  mobile: { threadCount: 4, speed: 0.14, spread: 0.12, glow: 0.03, thickness: 0.9, brightness: 0.65, dpr: 0.8 },
  tablet: { threadCount: 6, speed: 0.2, spread: 0.15, glow: 0.065, thickness: 1, brightness: 0.75, dpr: 1 },
  desktop: { threadCount: 8, speed: 0.2, spread: 0.18, glow: 0.01, thickness: 1.1, brightness: 0.6, dpr: 2 },
};

function VpsSupportSection() {
  const [sectionRef, visible] = useScrollReveal();
  const [threadProfile, setThreadProfile] = useState(getThreadProfile);
  const threadSettings = threadProfiles[threadProfile];

  useEffect(() => {
    const updateProfile = () => setThreadProfile(getThreadProfile());
    window.addEventListener("resize", updateProfile, { passive: true });
    return () => window.removeEventListener("resize", updateProfile);
  }, []);

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
            className="vps-support-webthreads"
            style={{ width: "100%", height: "100%" }}
            threadCount={threadSettings.threadCount}
            spread={threadSettings.spread}
            lightMode={false}
            speed={threadSettings.speed}
            frequency={5}
            taper={1}
            position={0.5}
            pinch={0.5}
            nodes={1}
            angle={15}
            glow={threadSettings.glow}
            falloff={0.6}
            thickness={threadSettings.thickness}
            brightness={threadSettings.brightness}
            dpr={threadSettings.dpr}
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
