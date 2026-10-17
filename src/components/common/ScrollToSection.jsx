import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToSection() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      return
    }

    const id = hash.replace('#', '')

    const element = document.getElementById(id)

    if (element) {
      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 50)
    }
  }, [hash])

  return null
}

export default ScrollToSection