import { useEffect, useRef, useState } from "react";
import AnimatedLink from "./AnimatedLink.jsx";
import CardSwap, { Card } from "../visuals/CardSwap.jsx";
import ScrollText from "./ScrollText.jsx";
import { Link } from "react-router-dom";
import { FiCheck, FiCopy } from "react-icons/fi";
import { bots } from "../../data/bots.js";
import '../../stylesheets/BotsSection.css'

function CopyValue({ value }) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy this value", String(value));
    }
  };

  return (
    <dd className="bots-access-value">
      <span>{value}</span>
      <button
        className="bots-copy-button"
        type="button"
        onClick={copyValue}
        aria-label={copied ? `${value} copied` : `Copy ${value}`}
        title={copied ? "Copied" : "Copy value"}
      >
        {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
      </button>
    </dd>
  );
}

function BotCard({ bot }) {
  return (
    <div className="bots-feature-card">
      <div className="bots-card-main">
        <div className="bots-card-heading">
          <span className="bots-eyebrow">// OUR TRADING BOTS</span>
          <h3>{bot.name}</h3>
          <p>
            {bot.capital} {bot.symbol} Bot
          </p>
        </div>
        <img className="bots-product-art" src={bot.image} alt="" />
        <div
          className="bots-card-results"
          aria-label={`${bot.name} illustrative performance`}
        >
          <div>
            <span>Gain</span>
            <strong>{bot.gain}</strong>
          </div>
          <div>
            <span>Drawdown</span>
            <strong>{bot.drawdown}</strong>
          </div>
          <div>
            <span>Pips</span>
            <strong>{bot.pips}</strong>
          </div>
        </div>
      </div>
      <aside className="bots-access-card">
        <h4>MT5 INVESTOR ACCESS</h4>
        <dl>
          <div>
            <dt>Broker</dt>
            <CopyValue value="Signature Prime Capital Ltd" />
          </div>
          <div>
            <dt>Account</dt>
            <CopyValue value="Investor" />
          </div>
          <div>
            <dt>Server</dt>
            <CopyValue value="SignaturePrime-Server" />
          </div>
          <div>
            <dt>Platform</dt>
            <CopyValue value="MetaTrader 5" />
          </div>
          <div>
            <dt>Starting Capital</dt>
            <CopyValue value={bot.capital} />
          </div>
          <div>
            <dt>Access details</dt>
            <CopyValue value="Shared privately" />
          </div>
        </dl>
      </aside>
      <div className="bots-card-action">
        <AnimatedLink to={`/bots/${bot.slug}`} className="bots-view-link">
          View {bot.name}
        </AnimatedLink>
      </div>
    </div>
  );
}

function BotsSection() {
  const headingRef = useRef(null);
  const swapFrameRef = useRef(null);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [swapSize, setSwapSize] = useState({
    width: 900,
    height: 300,
    verticalDistance: 50,
  });

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return undefined;

    let revealTimer;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      observer.disconnect();
      revealTimer = window.setTimeout(() => setCardsVisible(true), 1350);
    }, { threshold: 0.1 });

    observer.observe(heading);
    return () => {
      observer.disconnect();
      window.clearTimeout(revealTimer);
    };
  }, []);

  useEffect(() => {
    const frame = swapFrameRef.current;
    if (!frame) return undefined;
    const measure = () => {
      const compact = frame.clientWidth <= 900;
      const narrow = frame.clientWidth <= 480;
      const accessCard = frame.querySelector(".bots-access-card");
      const accessHeight = accessCard?.getBoundingClientRect().height ?? 0;
      setSwapSize({
        width: Math.max(260, frame.clientWidth - (narrow ? 8 : 24)),
        height: narrow ? 540 : compact ? 520 : Math.ceil(accessHeight + 88),
        verticalDistance: narrow ? 18 : compact ? 36 : 50,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    const accessCard = frame.querySelector(".bots-access-card");
    if (accessCard) observer.observe(accessCard);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`bots-section${cardsVisible ? " cards-visible" : ""}`} id="bots" aria-labelledby="bots-heading">
      <div className="bots-section-heading" ref={headingRef}>
        <div>
          <span className="section-eyebrow">Automated strategies</span>
          <ScrollText className="scroll-title" id="bots">
            Find your <span>trading bot</span>
          </ScrollText>
          <ScrollText
            as="p"
            className="scroll-copy"
            wordClassName="scroll-description-word"
          >
            Explore our MetaTrader 5 systems and review the available account
            statistics.
          </ScrollText>
        </div>
      </div>

      <div className="bots-card-swap-frame" ref={swapFrameRef}>
        <CardSwap
          className="bots-card-swap"
          width={swapSize.width}
          height={swapSize.height}
          cardDistance={0}
          verticalDistance={swapSize.verticalDistance}
          depth={100}
          skewAmount={0}
          visibleCards={swapSize.width <= 600 ? 2 : 4}
          delay={4000}
          cardRadius={18}
          speed={1}
          bounce={0.35}
          parallax={0.08}
          hoverSpread={0.12}
          dim={0.4}
          autoplay={false}
          pauseOnHover
          draggable
        >
          {bots.map((bot) => (
            <Card key={bot.name} className="bots-swap-card">
              <BotCard bot={bot} />
            </Card>
          ))}
        </CardSwap>
        <div className="bots-stack-hint" aria-hidden="true">
          Drag, use arrow keys, or wait to explore
        </div>
      </div>

      <div className="bots-systems-table-wrap">
        <table className="bots-systems-table">
          <caption>Systems by Expert Emirates</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Gain</th>
              <th scope="col">Drawdown</th>
              <th scope="col">Pips</th>
              <th scope="col">Trading</th>
              <th scope="col">Leverage</th>
              <th scope="col">Type</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((bot) => (
              <tr key={bot.name}>
                <th scope="row">
                  <Link to={`/bots/${bot.slug}`}>{bot.name}</Link>
                </th>
                <td className="bots-table-gain">{bot.gain}</td>
                <td>{bot.drawdown}</td>
                <td>{bot.pips}</td>
                <td>Automated</td>
                <td>1:500</td>
                <td>Real</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="bots-disclaimer">
        Trading involves risk. Statistics shown are illustrative and do not
        guarantee future results.
      </p>
    </section>
  );
}

export default BotsSection;
