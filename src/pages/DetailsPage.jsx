import { Navigate, useParams } from 'react-router-dom'
import ClientReviewsSection from '../components/home/ClientReviewsSection.jsx'
import ContactSection from '../components/home/ContactSection.jsx'
import FaqSection from '../components/home/FaqSection.jsx'
import DetailsDashboard from '../components/details/DetailsDashboard.jsx'
import { bots } from '../data/bots.js'

function DetailsPage() {
  const { botId } = useParams()
  const bot = bots.find((item) => item.slug === botId)

  if (!bot) return <Navigate to="/" replace />

  return (
    <>
      <DetailsDashboard bot={bot} />
      <ClientReviewsSection />
      <FaqSection />
      <ContactSection />
    </>
  )
}

export default DetailsPage
