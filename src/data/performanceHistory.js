// Static preview timeline. Values are normalized so each bot's plotted series
// ends at the gain and drawdown already listed in bots.js.
export const performanceTimeline = [
  { date: 'Nov 2025', growthFactor: 0, drawdownFactor: 0 },
  { date: 'Dec 2025', growthFactor: 0.08, drawdownFactor: 0.12 },
  { date: 'Jan 2026', growthFactor: 0.04, drawdownFactor: 0.08 },
  { date: 'Feb 2026', growthFactor: 0.19, drawdownFactor: 0.22 },
  { date: 'Mar 2026', growthFactor: 0.27, drawdownFactor: 0.18 },
  { date: 'Apr 2026', growthFactor: 0.23, drawdownFactor: 0.31 },
  { date: 'May 2026', growthFactor: 0.46, drawdownFactor: 0.24 },
  { date: 'Jun 2026', growthFactor: 0.52, drawdownFactor: 0.38 },
  { date: 'Jul 2026', growthFactor: 0.48, drawdownFactor: 0.29 },
  { date: 'Aug 2026', growthFactor: 0.73, drawdownFactor: 0.45 },
  { date: 'Sep 2026', growthFactor: 0.82, drawdownFactor: 0.36 },
  { date: 'Oct 2026', growthFactor: 1, drawdownFactor: 1 },
]

// Static dashboard samples by period. Year gain is taken from the bot listing;
// shorter periods are preview values and are not broker-reported results.
export const tradingPeriodSamples = {
  today: { annualShare: 0.012, pipsShare: 0.006, winRate: 60, trades: 3, lots: 0.12 },
  week: { annualShare: 0.055, pipsShare: 0.035, winRate: 64, trades: 18, lots: 0.72 },
  month: { annualShare: 0.24, pipsShare: 0.19, winRate: 62, trades: 76, lots: 3.04 },
  year: { annualShare: 1, pipsShare: 1, winRate: 61, trades: 842, lots: 33.68 },
}

const parseAmount = (value) => Number(value.replace(/[^\d.-]/g, '')) || 0

export function getBotPerformanceSeries(bot) {
  const gain = parseAmount(bot.gain)
  const drawdown = parseAmount(bot.drawdown)
  const startingCapital = parseAmount(bot.capital)

  return performanceTimeline.map((point) => {
    const growth = gain * point.growthFactor
    const loss = drawdown * point.drawdownFactor

    return {
      ...point,
      growth,
      balance: startingCapital * (1 + growth / 100),
      profit: startingCapital * growth / 100,
      drawdown: -loss,
    }
  })
}

export function getBotTradingPeriods(bot) {
  const gain = parseAmount(bot.gain)
  const capital = parseAmount(bot.capital)
  const pips = parseAmount(bot.pips)

  return [
    ['Today', tradingPeriodSamples.today],
    ['This Week', tradingPeriodSamples.week],
    ['This Month', tradingPeriodSamples.month],
    ['This Year', tradingPeriodSamples.year],
  ].map(([label, sample]) => {
    const periodGain = gain * sample.annualShare
    return {
      label,
      gain: periodGain,
      profit: capital * periodGain / 100,
      pips: pips * sample.pipsShare,
      winRate: sample.winRate,
      trades: sample.trades,
      lots: sample.lots,
    }
  })
}
