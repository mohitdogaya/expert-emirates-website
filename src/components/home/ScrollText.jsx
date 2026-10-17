import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react'

function revealWords(nodes, sequence) {
  return Children.map(nodes, (node) => {
    if (typeof node === 'string') {
      return node.split(/(\s+)/).map((part) => {
        if (!part.trim()) return part
        const index = sequence.current++
        return <span className="scroll-title-word" style={{ '--word-index': index }} key={`word-${index}`}>{part}</span>
      })
    }

    if (isValidElement(node) && node.props.children) {
      return cloneElement(node, undefined, revealWords(node.props.children, sequence))
    }

    return node
  })
}

function ScrollText({ as: Tag = 'h2', className = '', children, ...props }) {
  const sequence = { current: 0 }
  const titleRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const title = titleRef.current
    if (!title) return undefined

    let observer
    const observeTitle = () => {
      observer?.disconnect()
      const inset = Math.round(window.innerHeight * 0.1)
      observer = new IntersectionObserver(([entry]) => {
        setVisible(entry.isIntersecting)
      }, { threshold: 0, rootMargin: `-${inset}px 0px -${inset}px 0px` })
      observer.observe(title)
    }

    observeTitle()
    window.addEventListener('resize', observeTitle)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', observeTitle)
    }
  }, [])

  return <Tag ref={titleRef} className={`scroll-text-title${visible ? ' is-visible' : ''} ${className}`.trim()} {...props}>{revealWords(children, sequence)}</Tag>
}

export default ScrollText
