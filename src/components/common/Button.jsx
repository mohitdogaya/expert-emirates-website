import { Link } from 'react-router-dom'

function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  children,
  ...rest
}) {
  const base =
    'group inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 ease-out select-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)] disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary:
      'bg-[color:var(--color-ink)] text-white hover:bg-[color:var(--color-accent)] hover:shadow-[var(--shadow-glow)]',
    secondary:
      'bg-white text-[color:var(--color-ink)] border border-[color:var(--color-line)] hover:border-[color:var(--color-ink)] hover:-translate-y-0.5',
    ghost:
      'bg-transparent text-[color:var(--color-ink)] hover:bg-black/5',
    accent:
      'bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-dark)] hover:shadow-[var(--shadow-glow)]',
    outline:
      'bg-transparent text-[color:var(--color-ink)] border border-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)] hover:text-white',
  }

  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-[15px] px-7 py-3.5',
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={rest.target ?? '_blank'}
        rel={rest.rel ?? 'noopener noreferrer'}
        {...rest}
      >
        {content}
      </a>
    )
  }

  const Tag = as || 'button'
  return (
    <Tag className={classes} {...rest}>
      {content}
    </Tag>
  )
}

export default Button