import { lazy, Suspense } from "react";
import { FiAward, FiCheck, FiStar, FiTag } from "react-icons/fi";
import ScrollText from "./ScrollText.jsx";

const ReflectiveCard = lazy(() => import("../visuals/ReflectiveCard.jsx"));

const features = [
  "Premium Trade Signals (12–15/Week)",
  "Risk Reward Ratio - 1:2, 1:3, 1:4",
  "Instant Telegram Trade Alerts",
  "Exclusive Weekly Market Blueprint",
  "Smart Risk Management Tips",
  "Dedicated VIP Support",
  "Forex + Gold Elite Access",
  "First to New Features & Tools",
];

const plans = [
  {
    name: "Standard Plan",
    price: "199",
    billing: "Monthly",
    description: "Perfect for small teams or unlimited evaluation.",
    Icon: FiTag,
    tint: "#201f27",
    variant: "standard",
  },
  {
    name: "Pro Plan",
    price: "499",
    billing: "Quarterly",
    description:
      "Everything in Standard, plus enhanced features for serious traders.",
    Icon: FiAward,
    featured: true,
    tint: "#FFD700",
    variant: "pro",
  },
  {
    name: "Ultra Plan",
    price: "999",
    billing: "Half-yearly",
    description:
      "Our premium package for ultimate trading performance. Includes everything in Pro.",
    Icon: FiStar,
    tint: "#201f27",
    variant: "ultra",
  },
];

function PricingSection() {
  return (
    <section
      className="pricing-section scroll-section"
      id="pricing"
      aria-labelledby="pricing-heading"
    >
      <div className="pricing-heading">
        <span className="section-eyebrow">Why choose Expert Emirates</span>
        <ScrollText className="scroll-title" id="pricing-heading">
          Choose the Right Plan for <span><br />
          Your Trading Goals</span>
        </ScrollText>
        <ScrollText
          as="p"
          className="scroll-copy"
          wordClassName="scroll-description-word"
        >
          Explore our available Expert Advisor licenses and select a plan based
          on your requirements.
        </ScrollText>
      </div>

      <div className="pricing-grid">
        {plans.map(({ name, price, billing, description, Icon, featured, tint, variant }) => (
          <Suspense
            key={name}
            fallback={
              <div className="pricing-card-loading" aria-hidden="true" />
            }
          >
            <ReflectiveCard
              className={`pricing-reflective-card plan-${variant}${featured ? " is-featured" : ""}`}
              name={name}
              role={billing}
              width="100%"
              height={570}
              radius={24}
              tint={tint}
              metalness={1}
              roughness={0.3}
              blurStrength={6}
              shine={1}
              glare={0.5}
              grayscale={1}
              warp={0.6}
              warpScale={1}
              bevel={3}
              tiltStrength={12}
              enableTilt
              intro
            >
              <div className="pricing-card-content">
                <div className="pricing-plan-name">
                  <span className="pricing-plan-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span>{name}</span>
                </div>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  {price}
                  <span className="pricing-billing">/ {billing}</span>
                </div>
                <p className="pricing-description">{description}</p>
                <a className="pricing-buy-button" href="#contact">
                  Buy Now
                </a>
                <ul className="pricing-feature-list">
                  {features.map((feature) => (
                    <li key={feature}>
                      <span className="pricing-check">
                        <FiCheck aria-hidden="true" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ReflectiveCard>
          </Suspense>
        ))}
      </div>
    </section>
  );
}

export default PricingSection;
