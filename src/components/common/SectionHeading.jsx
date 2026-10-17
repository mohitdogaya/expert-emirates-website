function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}) {
  const alignment =
    align === 'center'
      ? 'items-center text-center mx-auto'
      : 'items-start text-left'

  return (
    <div className={`flex flex-col ${alignment} max-w-2xl gap-4 mb-14 ${className}`}>
      {eyebrow && (
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)] animate-pulse-dot" />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            {eyebrow}
          </span>
        </div>
      )}

      {title && (
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.05] tracking-tight text-balance">
          {title}
        </h2>
      )}

      {description && (
        <p className="text-base sm:text-lg text-[color:var(--color-muted)] leading-relaxed text-pretty">
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeading