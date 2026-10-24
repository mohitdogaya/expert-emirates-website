import { useState } from 'react'
import { FiActivity, FiCheck, FiChevronLeft, FiChevronRight, FiLock, FiMessageCircle, FiPlus, FiShare2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import AnimatedLink from '../home/AnimatedLink.jsx'
import { bots } from '../../data/bots.js'
import { getBotTradingPeriods } from '../../data/performanceHistory.js'
import PerformanceChart from './PerformanceChart.jsx'
import './DetailsDashboard.css'

const tableViews = ['Periods', 'Calendar', 'Goals', 'Browser', 'Forecast']
const activityViews = ['Open Trades', 'Open Orders', 'History', 'Exposure']

const formatBotStatistics = (bot) => [
  ['Gain', bot.gain],
  ['Drawdown', bot.drawdown],
  ['Market', bot.symbol],
  ['Pips', bot.pips],
  ['Starting capital', bot.capital],
  ['Platform', 'MetaTrader 5'],
  ['Trading mode', 'Automated'],
  ['Broker', 'Signature Prime Capital Ltd'],
]

function PanelTitle({ children, aside }) {
  return <div className="td-panel-title"><div className="td-panel-title-main">{typeof children === 'string' ? <h2>{children}</h2> : children}</div>{aside}</div>
}

function TabList({ items, selected, onSelect, label }) {
  return (
    <div className="td-tabs" role="tablist" aria-label={label}>
      {items.map((item) => (
        <button key={item} type="button" role="tab" aria-selected={selected === item} className={selected === item ? 'is-selected' : ''} onClick={() => onSelect(item)}>{item}</button>
      ))}
    </div>
  )
}

function AccountInfo({ bot }) {
  const [view, setView] = useState('Info')
  const items = view === 'Info'
    ? formatBotStatistics(bot)
    : view === 'Stats'
      ? [['Daily', '—'], ['Monthly', '—'], ['Highest', '—'], ['Interest', '—'], ['Deposits', '—'], ['Withdrawals', '—'], ['Updated', '—'], ['Tracking', '—']]
      : [['Account', 'Investor'], ['Server', 'Shared privately'], ['Terminal', 'MetaTrader 5'], ['Instrument', bot.symbol], ['Leverage', 'Broker dependent'], ['License', 'Contact for details']]

  return (
    <div className="td-panel td-account-panel">
      <PanelTitle aside={<TabList items={['Info', 'Stats', 'General']} selected={view} onSelect={setView} label="Account information" />}>{bot.name}</PanelTitle>
      <dl className="td-account-list">
        {items.map(([label, value]) => <div key={label}><dt>{label}:</dt><dd className={label === 'Gain' ? 'is-gain' : ''}>{value}</dd></div>)}
      </dl>
    </div>
  )
}


function TradingPeriods({ bot }) {
  const [view, setView] = useState('Periods')
  const rows = getBotTradingPeriods(bot)
  const columns = ['Gain', 'Profit', 'Pips', 'Win rate', 'Trades', 'Lots']
  const formatCurrency = (value) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`

  return (
    <div className="td-panel td-table-panel">
      <PanelTitle><div className="td-chart-title"><span>Trading</span><TabList items={tableViews} selected={view} onSelect={setView} label="Trading history view" /></div></PanelTitle>
      <div className="td-table-scroll"><table className="td-data-table td-period-table"><thead><tr><th scope="col">Period</th>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td className="td-positive">{row.gain.toFixed(2)}%</td><td>{formatCurrency(row.profit)}</td><td>{row.pips.toLocaleString('en-US', { maximumFractionDigits: 1 })}</td><td>{row.winRate}%</td><td>{row.trades.toLocaleString('en-US')}</td><td>{row.lots.toFixed(2)}</td></tr>)}</tbody></table></div>
      <p className="td-chart-caption">Static sample data. Short period figures are illustrative and are not live broker or Myfxbook results.</p>
    </div>
  )
}

function TradingStatistics({ bot }) {
  const [view, setView] = useState('Periods')
  const columns = [
    [['Trades', '—'], ['Profitability', '—'], ['Pips', bot.pips], ['Average Win', '—'], ['Average Loss', '—'], ['Lots', '—'], ['Commissions', '—']],
    [['Longs Won', '—'], ['Shorts Won', '—'], ['Best Trade', '—'], ['Worst Trade', '—'], ['Average Trade', '—'], ['Avg. Trade Length', '—']],
    [['Profit Factor', '—'], ['Standard Deviation', '—'], ['Sharpe Ratio', '—'], ['Z-Score', '—'], ['Expectancy', '—'], ['AHPR', '—'], ['GHPR', '—']],
  ]

  return (
    <div className="td-panel td-table-panel">
      <PanelTitle><div className="td-chart-title"><span>Trading</span><TabList items={tableViews} selected={view} onSelect={setView} label="Trading statistics view" /></div></PanelTitle>
      <div className="td-stat-columns">{columns.map((column, index) => <dl key={index}>{column.map(([label, value]) => <div key={label}><dt>{label}:</dt><dd>{value}</dd></div>)}</dl>)}</div>
    </div>
  )
}

function TradingActivity() {
  const [view, setView] = useState('Open Trades')
  return (
    <div className="td-panel td-activity-panel">
      <PanelTitle aside={<FiActivity aria-hidden="true" />}><div className="td-chart-title"><span>Trading Activity</span><TabList items={activityViews} selected={view} onSelect={setView} label="Trading activity view" /></div></PanelTitle>
      <div className="td-private-activity"><FiLock aria-hidden="true" /><p>{view} are private.</p><AnimatedLink href="mailto:info@expertemirates.com?subject=Investor%20account%20access">Unlock</AnimatedLink></div>
    </div>
  )
}

function MonthlyAnalytics() {
  const months = ['May 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026']
  return (
    <div className="td-panel td-monthly-panel">
      <PanelTitle aside={<span className="td-year-badge">2026</span>}>Monthly Analytics</PanelTitle>
      <div className="td-monthly-grid">
        <div className="td-month-chart-panel"><h3>Illustrative Monthly Gain (Change)</h3><div className="td-month-chart">{months.map((month, index) => <div key={month}><span style={{ '--month-bar-height': `${[8, 18, 77, 34][index]}%` }} /><small>{month}</small></div>)}</div></div>
        {[0, 1, 2].map((item) => <div className="td-month-empty" key={item}>Please select a month.</div>)}
      </div>
      <p className="td-chart-caption">Illustrative layout only. Monthly performance data is not provided in this listing.</p>
    </div>
  )
}

function BotSystemsTable({ currentBot }) {
  return (
    <div className="td-panel td-table-panel td-other-systems">
      <PanelTitle>Other Systems by Expert Emirates</PanelTitle>
      <div className="td-table-scroll"><table className="td-data-table"><thead><tr><th>Name</th><th>Gain</th><th>Drawdown</th><th>Pips</th><th>Trading</th><th>Leverage</th><th>Type</th></tr></thead><tbody>
        {bots.map((bot) => <tr className={bot.slug === currentBot.slug ? 'is-current' : ''} key={bot.slug}>
          <th scope="row"><Link to={`/bots/${bot.slug}`}>{bot.name}</Link>{bot.slug === currentBot.slug && <span className="td-current-badge">Current</span>}</th>
          <td className="td-positive">{bot.gain}</td><td>{bot.drawdown}</td><td>{bot.pips}</td><td>Automated</td><td>1:500</td><td>Real</td>
        </tr>)}
      </tbody></table></div>
    </div>
  )
}

function DetailsDashboard({ bot }) {
  return (
    <div className="details-page">
      <div className="details-container">
        <nav className="details-breadcrumbs" aria-label="Breadcrumb"><Link to="/#bots">Trading Bots</Link><span>/</span><span>{bot.name}</span></nav>
        <header className="details-hero">
          <div className={`details-hero-art${bot.slug === 'rocket-bot' ? ' is-rocket-banner' : ''}`}>
            {bot.slug === 'rocket-bot' ? <img className="details-hero-banner" src="/UseIcons/rocket-bot.png" alt="Rocket Bot — algorithmic trading for XAUUSD" /> : <>
              <div className="details-hero-copy"><span className="details-kicker">Expert Emirates · Automated strategy</span><h1>{bot.name}</h1><p>Algorithmic trading for <strong>{bot.symbol}</strong></p></div>
              <img src={bot.image} alt={`${bot.name} illustration`} /><div className="details-hero-orbit" />
            </>}
          </div>
          <div className="details-product-row">
            <div className="details-product-title"><span className="details-status"><i /> Investor account connected</span><h2>{bot.name}</h2><p>MetaTrader 5 · Algorithmic trading for {bot.symbol}</p></div>
            <div className="details-product-actions">
              <a className="details-icon-action" href="mailto:info@expertemirates.com?subject=Bot%20discussion"><FiMessageCircle />Discuss</a>
              <a className="details-icon-action" href="mailto:info@expertemirates.com?subject=Bot%20information"><FiPlus />Add to watch</a>
              <button className="details-icon-action" type="button" onClick={() => navigator.share?.({ title: bot.name, url: window.location.href })}><FiShare2 />Share</button>
              <div>
              <AnimatedLink href="#contact" className="details-subscribe">Subscribe</AnimatedLink>
              </div>
            </div>
          </div>
          <div className="details-tags"><span><FiCheck /> Track record</span><span><FiCheck /> Trading privileges</span><span><FiCheck /> Live update</span><span><FiCheck /> Cashback</span></div>
        </header>

        <div className="td-main-grid"><AccountInfo bot={bot} /><PerformanceChart bot={bot} /></div>
        <TradingPeriods bot={bot} />
        <TradingStatistics bot={bot} />
        <TradingActivity />
        <MonthlyAnalytics />
        <BotSystemsTable currentBot={bot} />
        <p className="details-risk-note">Trading involves risk. Past performance does not guarantee future results. Live historical data must be reviewed through the investor account.</p>
        <div className="details-back-link"><Link to="/#bots"><FiChevronLeft /> Back to all trading bots <FiChevronRight /></Link></div>
      </div>
    </div>
  )
}

export default DetailsDashboard
