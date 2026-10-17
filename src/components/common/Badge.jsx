function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  className = '',
  children,
  ...rest
}) {
  const variants = {
    default:
      'bg-white text-[color:var(--color-ink)] border-[color:var(--color-line)]',
    ink: 'bg-[color:var(--color-ink)] text-white border-[color:var(--color-ink)]',
    accent:
      'bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent-dark)] border-[color:var(--color-accent)]/30',
    muted:
      'bg-[color:var(--color-paper-soft)] text-[color:var(--color-muted)] border-[color:var(--color-line)]',
    outline:
      'bg-transparent text-[color:var(--color-ink)] border-[color:var(--color-ink)]',
  }

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono uppercase tracking-wider ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-accent)] animate-pulse-dot" />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

export default Badge