import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'

function AnimationButton({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseStyles = `
    group
    relative
    inline-flex
    items-center
    justify-center
    overflow-hidden
    rounded-full
    font-medium
    tracking-tight
    transition-all
    duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]
    active:scale-[0.97]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[color:var(--color-accent)]
    focus-visible:ring-offset-2
  `

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3.5 text-base',
  }

  const variants = {
    primary: `
      bg-[color:var(--color-ink)]
      text-white
      border
      border-[color:var(--color-ink)]
      hover:-translate-y-1
      hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)]
    `,

    ghost: `
      bg-transparent
      text-[color:var(--color-ink)]
      border
      border-[color:var(--color-line)]
      hover:-translate-y-1
      hover:border-[color:var(--color-ink)]
      hover:bg-black/[0.03]
    `,
  }

  const content = (
    <>
      {/* Animated background */}
      {variant === 'primary' && (
        <span
          className="
            absolute
            inset-0
            origin-bottom-left
            scale-x-0
            bg-[color:var(--color-accent)]
            transition-transform
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:scale-x-100
          "
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">

        {/* Main text */}
        <span
          className="
            relative
            overflow-hidden
            leading-none
          "
        >
          <span
            className="
              block
              transition-transform
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:-translate-y-full
            "
          >
            {children}
          </span>

          {/* Hover text */}
          <span
            className="
              absolute
              left-0
              top-full
              block
              whitespace-nowrap
              transition-transform
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:-translate-y-full
            "
          >
            {children}
          </span>
        </span>

        {/* Arrow */}
        <span
          className="
            relative
            flex
            h-5
            w-5
            items-center
            justify-center
            overflow-hidden
          "
        >
          <FiArrowUpRight
            className="
              absolute
              h-4
              w-4
              transition-all
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:translate-x-5
              group-hover:-translate-y-5
            "
          />

          <FiArrowUpRight
            className="
              absolute
              h-4
              w-4
              -translate-x-5
              translate-y-5
              transition-all
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:translate-x-0
              group-hover:translate-y-0
            "
          />
        </span>

      </span>

      {/* Shine */}
      <span
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-1/2
          w-1/3
          rotate-[20deg]
          bg-white/20
          blur-md
          transition-all
          duration-700
          group-hover:left-[120%]
        "
      />
    </>
  )

  const classes = `
    ${baseStyles}
    ${sizes[size] || sizes.md}
    ${variants[variant] || variants.primary}
    ${className}
  `

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      {...props}
    >
      {content}
    </button>
  )
}

export default AnimationButton