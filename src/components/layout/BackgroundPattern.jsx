const patterns = {
  crossBottomRight: {
    backgroundImage: `
      linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
      linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
    `,
    backgroundSize: '40px 40px',
    WebkitMaskImage:
      'radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)',
    maskImage:
      'radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)',
  },
  greenSpotlightGrid: {
    backgroundImage: `
      linear-gradient(90deg, rgba(16, 185, 129, 0.25) 1px, transparent 0),
      linear-gradient(180deg, rgba(16, 185, 129, 0.25) 1px, transparent 0),
      repeating-linear-gradient(45deg, rgba(16, 185, 129, 0.2) 0 2px, transparent 2px 6px)
    `,
    backgroundSize: '24px 24px, 24px 24px, 24px 24px',
    animation: 'spotlight 8s ease-in-out infinite',
  },
  bottomAmberGlow: {
    animation: 'spotlight 8s ease-in-out infinite',
     backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)
      `,
      backgroundSize: "100% 100%",
  },
}

function BackgroundPattern({ pattern = 'crossBottomRight', className = '' }) {
  const selectedPattern = patterns[pattern] ?? patterns.crossBottomRight

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 ${className}`.trim()}
      style={selectedPattern}
    />
  )
}

export default BackgroundPattern
