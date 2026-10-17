import { Children, cloneElement, isValidElement } from 'react'

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
  return <Tag className={`scroll-text-title ${className}`.trim()} {...props}>{revealWords(children, sequence)}</Tag>
}

export default ScrollText
