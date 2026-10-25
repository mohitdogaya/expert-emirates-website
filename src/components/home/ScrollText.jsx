import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react'
import '../../stylesheets/ScrollText.css'

function revealWords(nodes, sequence, wordClassName) {
  return Children.map(nodes, (node) => {
    if (typeof node === 'string') {
      return node.split(/(\s+)/).map((part) => {
        if (!part.trim()) return part
        const index = sequence.current++
        return <span className={wordClassName} style={{ '--word-index': index }} key={`word-${index}`}>{part}</span>
      })
    }

    if (isValidElement(node) && node.props.children) {
      return cloneElement(node, undefined, revealWords(node.props.children, sequence, wordClassName))
    }

    return node
  })
}

function ScrollText({ as: Tag = 'h2', className = '', wordClassName = 'scroll-title-word', children, ...props }) {
  const sequence = { current: 0 }
  const titleRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const title = titleRef.current
    if (!title) return undefined

    const inset = Math.round(window.innerHeight * 0.1)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      setVisible(true)
      observer.disconnect()
    }, { threshold: 0, rootMargin: `-${inset}px 0px -${inset}px 0px` })
    observer.observe(title)

    return () => {
      observer.disconnect()
    }
  }, [])

  return <Tag ref={titleRef} className={`scroll-text-title${visible ? ' is-visible' : ''} ${className}`.trim()} {...props}>{revealWords(children, sequence, wordClassName)}</Tag>
}

export default ScrollText
