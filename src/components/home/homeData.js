import { FiAward, FiBookOpen, FiGrid, FiServer, FiSettings, FiTrendingUp } from 'react-icons/fi'

export const strategies = ['ROCKET BOT', 'GALAXY BOT', 'EURUSD BOT', 'ATM BOT', 'XAUR']

export const metrics = [
  { value: 99.98, format: (value) => `${value.toFixed(2)}%`, label: 'Execution Accuracy' },
  { value: 24, format: (value) => `${Math.round(value)}/7`, label: 'Market Monitoring' },
  { value: 20, format: (value) => `<${Math.round(value)}ms`, label: 'Average Execution' },
  { value: 100, format: (value) => `${Math.round(value)}+`, label: 'Risk Parameters' },
]

export const features = [
  { title: 'Automated Trading Technology', image: '/UseIcons/feature-img1.png' },
  { title: 'MT5 Compatibility', image: '/UseIcons/feature-img2.png' },
  { title: 'MyFxBook Performance Tracking', image: '/UseIcons/feature-img3.png' },
  { title: 'VPS Setup Assistance', image: '/UseIcons/feature-img4.png' },
]

export const reasons = [
  ['Automated Execution', 'Execute trades based on predefined rules.'],
  ['Systematic Approach', 'Follow structured trading logic.'],
  ['Risk Management', 'Configure supported risk controls.'],
  ['MT5 Compatibility', 'Use compatible Expert Advisors in MetaTrader 5.'],
  ['Performance Transparency', 'Review available trading history.'],
  ['Setup Assistance', 'Get installation guidance.'],
  ['VPS Compatibility', 'Explore hosting options for continuous trading.'],
]

export const lessons = [
  ['Introduction', 'to Expert Advisors', FiBookOpen],
  ['Understanding', 'Automated Trading', FiGrid],
  ['MT5', 'Installation and Configuration', FiSettings],
  ['Trading', 'Parameters and Risk Settings', FiTrendingUp],
  ['VPS', 'Setup and Connectivity', FiServer],
  ['Monitoring', 'Trading Performance', FiAward],
]

export const steps = [
  ['Choose Your Bot', 'Explore our four Expert Advisors and select the product that suits your requirements.'],
  ['Select Your Package', 'Review pricing, license terms, included services, and available payment options.'],
  ['Receive Your Product', 'Get EA files, documentation, and setup instructions after payment confirmation.'],
  ['Install and Configure', 'Follow the installation guide to configure your MT5 environment.'],
  ['Monitor Your Trading', 'Review trading activity and manage your settings according to your trading plan.'],
]

export const faqs = [
  ['What is an Expert Advisor?', 'An Expert Advisor (EA) is a program that can automate trading actions in MetaTrader 5 according to its configured rules.'],
  ['Which platform do your bots support?', 'The Expert Advisors shown here are designed for MetaTrader 5. Check each product listing for its specific requirements.'],
  ['Do I need a VPS?', 'A VPS can keep your MT5 terminal running when your personal computer is offline. It is optional and depends on your setup.'],
  ['Can I track my trading performance?', 'You can review account statistics and supported reporting integrations. Past performance does not guarantee future results.'],
  ['Are profits guaranteed?', 'No. Trading involves risk, and automated systems can lose money. Historical or illustrative results do not guarantee future performance.'],
  ['How do I install my trading bot?', 'Follow the product documentation and installation guide to add the EA to MetaTrader 5 and configure its settings.'],
  ['How can I contact support?', 'Use the contact form below to send your question about setup, configuration, or technical support.'],
]
