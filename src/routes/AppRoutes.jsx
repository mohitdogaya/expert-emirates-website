import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

const HomePage = lazy(() => import('../pages/Home.jsx'))
const ContactPage = lazy(() => import('../pages/Contact.jsx'))
const DetailsPage = lazy(() => import('../pages/DetailsPage.jsx'))

function RouteScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])

  return null
}

function AppRoutes() {
  return (
    <Suspense fallback={<main className="route-loading" aria-busy="true" aria-label="Loading page" />}>
      <RouteScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/bots/:botId" element={<DetailsPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
