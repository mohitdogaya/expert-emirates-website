import Container from './Container.jsx'

function Section({
  id,
  as: Tag = 'section',
  size = 'default',
  padding = 'default',
  bordered = false,
  className = '',
  containerClassName = '',
  children,
  ...rest
}) {
  const paddings = {
    sm: 'py-12 sm:py-16',
    default: 'py-20 sm:py-28',
    lg: 'py-24 sm:py-26',
    none: '',
  }

  return (
    <Tag
      id={id}
      className={`relative ${paddings[padding]} ${
        bordered ? 'border-t border-[color:var(--color-line)]' : ''
      } ${className}`}
      {...rest}
    >
      <Container size={size} className={containerClassName}>
        {children}
      </Container>
    </Tag>
  )
}

export default Section