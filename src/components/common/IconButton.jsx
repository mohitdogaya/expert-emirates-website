function IconButton({
  as,
  href,
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  children,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center rounded-full transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]'

  const variants = {
    ghost:
      'bg-transparent text-[color:var(--color-ink)] hover:bg-black/5 hover:text-[color:var(--color-accent)]',
    solid:
      'bg-[color:var(--color-ink)] text-white hover:bg-[color:var(--color-accent)]',
    outline:
      'border border-[color:var(--color-line)] text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)] hover:-translate-y-0.5',
  }

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        title={label}
        target={rest.target ?? '_blank'}
        rel={rest.rel ?? 'noopener noreferrer'}
        className={classes}
        {...rest}
      >
        {children}
      </a>
    )
  }

  const Tag = as || 'button'
  return (
    <Tag aria-label={label} title={label} className={classes} {...rest}>
      {children}
    </Tag>
  )
}

export default IconButton