import ContactSection from '../components/home/ContactSection.jsx'
import '../stylesheets/ContactPage.css'

function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = [formData.get('firstName'), formData.get('lastName')].filter(Boolean).join(' ')
    const email = formData.get('email')
    const phone = formData.get('phone')
    const message = formData.get('message')
    const subject = 'Contact request from ' + (name || 'website visitor')
    const body = 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (phone || 'Not provided') + '\n\n' + message

    window.location.href = 'mailto:info@expertemirates.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body)
  }

  return (
    <main className="contact-route">
      <ContactSection onSubmit={handleSubmit} />
    </main>
  )
}

export default Contact
