import { useState } from 'react'
import { FiActivity } from 'react-icons/fi'
import { getBotPerformanceSeries } from '../../data/performanceHistory.js'

const chartViews = [
  { id: 'growth', label: 'Growth', unit: '%' },
  { id: 'balance', label: 'Balance', unit: '$' },
  { id: 'profit', label: 'Profit', unit: '$' },
  { id: 'drawdown', label: 'Drawdown', unit: '%' },
]

const chart = { width: 760, height: 270, left: 62, right: 16, top: 16, bottom: 34 }
const plotWidth = chart.width - chart.left - chart.right
const plotHeight = chart.height - chart.top - chart.bottom
const formatValue = (value, unit) => unit === '$'
  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
  : `${value.toFixed(1)}%`

function PerformanceChart({ bot }) {
  const [view, setView] = useState('growth')
  const [activeIndex, setActiveIndex] = useState(null)
  const selectedView = chartViews.find((item) => item.id === view)
  const series = getBotPerformanceSeries(bot)
  const values = series.map((point) => point[view])
  const minimum = Math.min(0, ...values)
  const maximum = Math.max(0, ...values)
  const range = maximum - minimum || 1
  const padding = range * 0.12
  const minY = minimum < 0 ? minimum - padding : 0
  const maxY = maximum + padding
  const scaleY = (value) => chart.top + ((maxY - value) / (maxY - minY)) * plotHeight
  const points = values.map((value, index) => ({
    ...series[index],
    value,
    x: chart.left + (index / (series.length - 1)) * plotWidth,
    y: scaleY(value),
  }))
  const linePoints = points.map(({ x, y }) => `${x},${y}`).join(' ')
  const gridValues = Array.from({ length: 5 }, (_, index) => maxY - ((maxY - minY) * index) / 4)
  const activePoint = activeIndex === null ? points.at(-1) : points[activeIndex]

  return (
    <div className="td-panel td-chart-panel" aria-label={`${bot.name} performance chart`}>
      <div className="td-panel-title">
        <div className="td-panel-title-main"><div className="td-chart-title"><FiActivity aria-hidden="true" /><span>Performance</span></div></div>
        <span className="td-chart-period">12 month sample</span>
      </div>
      <div className="td-chart-toolbar">
        <TabList items={chartViews.map(({ label }) => label)} selected={selectedView.label} onSelect={(label) => { setView(chartViews.find((item) => item.label === label).id); setActiveIndex(null) }} label="Chart data view" />
        <span className="td-chart-current-value">{formatValue(activePoint.value, selectedView.unit)}</span>
      </div>
      <div className="td-chart-plot-wrap">
        <svg className="td-performance-svg" viewBox={`0 0 ${chart.width} ${chart.height}`} preserveAspectRatio="none" role="img" aria-label={`${selectedView.label} chart for ${bot.name}. Static sample values from November 2025 through October 2026.`}>
          <defs>
            <linearGradient id="performance-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#e8c743" stopOpacity=".25" />
              <stop offset="100%" stopColor="#e8c743" stopOpacity="0" />
            </linearGradient>
          </defs>
          {gridValues.map((value, index) => {
            const y = scaleY(value)
            return <g key={index}>
              <line x1={chart.left} x2={chart.width - chart.right} y1={y} y2={y} className="td-chart-gridline" />
              <text x={chart.left - 10} y={y + 4} textAnchor="end" className="td-chart-axis-label">{formatValue(value, selectedView.unit)}</text>
            </g>
          })}
          <path d={`M ${points[0].x},${chart.height - chart.bottom} L ${linePoints} L ${points.at(-1).x},${chart.height - chart.bottom} Z`} fill="url(#performance-area)" />
          <polyline points={linePoints} className="td-performance-line" />
          {points.map((point, index) => <g key={point.date}>
            <circle cx={point.x} cy={point.y} r={activeIndex === index ? 5 : 2.5} className="td-performance-point" onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)} tabIndex="0" aria-label={`${point.date}: ${formatValue(point.value, selectedView.unit)}`} />
            {(index % 2 === 0 || index === points.length - 1) && <text x={point.x} y={chart.height - 10} textAnchor="middle" className="td-chart-axis-label">{point.date}</text>}
          </g>)}
        </svg>
      </div>
      <p className="td-chart-caption">Static sample series based on the bot’s listed gain and drawdown. This is not live Myfxbook history.</p>
    </div>
  )
}

function TabList({ items, selected, onSelect, label }) {
  return (
    <div className="td-tabs" role="tablist" aria-label={label}>
      {items.map((item) => <button key={item} type="button" role="tab" aria-selected={selected === item} className={selected === item ? 'is-selected' : ''} onClick={() => onSelect(item)}>{item}</button>)}
    </div>
  )
}

export default PerformanceChart
