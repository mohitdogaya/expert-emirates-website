import { useEffect, useRef, useState } from "react";
import AnimatedLink from "./AnimatedLink.jsx";
import CardSwap, { Card } from "../visuals/CardSwap.jsx";
import ScrollText from "./ScrollText.jsx";

const bots = [
  {
    name: "Rocket Bot",
    symbol: "XAUUSD",
    gain: "20.23%",
    drawdown: "20.98%",
    pips: "187,851.5",
    capital: "$10,000",
    image: "/UseIcons/image 34.png",
  },
  {
    name: "Galaxy Bot",
    symbol: "Forex",
    gain: "3.51%",
    drawdown: "10.36%",
    pips: "187,851.5",
    capital: "$5,000",
    image: "/UseIcons/image 164.png",
  },
  {
    name: "EURUSD Bot",
    symbol: "EURUSD",
    gain: "12.34%",
    drawdown: "11.21%",
    pips: "187,851.5",
    capital: "$5,000",
    image: "/UseIcons/image 164 (1).png",
  },
  {
    name: "Jupiter Bot",
    symbol: "Multi-market",
    gain: "62.03%",
    drawdown: "51.30%",
    pips: "187,851.5",
    capital: "$10,000",
    image: "/UseIcons/image 34.png",
  },
  {
    name: "XAUR Bot",
    symbol: "Gold",
    gain: "34.50%",
    drawdown: "39.02%",
    pips: "187,851.5",
    capital: "$5,000",
    image: "/UseIcons/image 164.png",
  },
];

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
            <dd>Signature Prime Capital Ltd</dd>
          </div>
          <div>
            <dt>Account</dt>
            <dd>Investor</dd>
          </div>
          <div>
            <dt>Server</dt>
            <dd>SignaturePrime-Server</dd>
          </div>
          <div>
            <dt>Platform</dt>
            <dd>MetaTrader 5</dd>
          </div>
          <div>
            <dt>Starting Capital</dt>
            <dd>{bot.capital}</dd>
          </div>
          <div>
            <dt>Access details</dt>
            <dd>Shared privately</dd>
          </div>
        </dl>
      </aside>
      <div className="bots-card-action">
        <AnimatedLink href="#pricing" className="bots-view-link">
          View {bot.name}
        </AnimatedLink>
      </div>
    </div>
  );
}

function BotsSection() {
  const swapFrameRef = useRef(null);
  const [swapSize, setSwapSize] = useState({
    width: 900,
    height: 300,
    verticalDistance: 50,
  });

  useEffect(() => {
    const frame = swapFrameRef.current;
    if (!frame) return undefined;
    const measure = () => {
      const compact = frame.clientWidth <= 900;
      const narrow = frame.clientWidth <= 480;
      const accessCard = frame.querySelector(".bots-access-card");
      const accessHeight = accessCard?.getBoundingClientRect().height ?? 0;
      setSwapSize({
        width: Math.max(260, frame.clientWidth - 24),
        height: narrow ? 470 : compact ? 520 : Math.ceil(accessHeight + 88),
        verticalDistance: narrow ? 30 : compact ? 36 : 50,
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
    <section className="bots-section" id="bots" aria-labelledby="bots-heading">
      <div className="bots-section-heading">
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
          visibleCards={4}
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
                  <a href="#contact">{bot.name}</a>
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
