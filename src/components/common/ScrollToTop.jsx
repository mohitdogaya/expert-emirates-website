import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If URL contains a hash like #projects,
    // let the browser scroll to that section.
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''))

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })

        return
      }
    }

    // Otherwise scroll to the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [pathname, hash])

  return null
}

export default ScrollToTop