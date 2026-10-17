function Container({ as: Tag = 'div', size = 'default', className = '', children, ...rest }) {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-none',
  }

  return (
    <Tag
      className={`mx-auto w-full px-5 sm:px-8 lg:px-10 ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default Container