import { FiMapPin } from 'react-icons/fi'
import useScrollReveal from './useScrollReveal.js'

function ContactSection() {
  const [sectionRef, visible] = useScrollReveal()
  return (
    <section className={`contact-section scroll-section${visible ? ' is-visible' : ''}`} ref={sectionRef} id="contact" aria-labelledby="contact-heading">
      <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
        <h2>Contact Us</h2>
        <div className="contact-fields">
          <label><span className="visually-hidden">First name</span><input type="text" name="firstName" placeholder="First Name" autoComplete="given-name" required /></label>
          <label><span className="visually-hidden">Last name</span><input type="text" name="lastName" placeholder="Last Name" autoComplete="family-name" required /></label>
          <label className="field-full"><span className="visually-hidden">Email</span><input type="email" name="email" placeholder="Email" autoComplete="email" required /></label>
          <label className="field-full"><span className="visually-hidden">Phone number</span><input type="tel" name="phone" placeholder="Phone Number" autoComplete="tel" /></label>
          <label className="field-full"><span className="visually-hidden">Message</span><textarea name="message" placeholder="Type Your Message Here" rows="5" required /></label>
        </div>
        <label className="terms-check"><input type="checkbox" required /><span>Accept Terms of service and Privacy Policy</span></label>
        <button className="contact-submit" type="submit"><span className="button-label"><span>Send Message</span><span aria-hidden="true">Send Message</span></span></button>
      </form>
      <div className="contact-details">
        <h2 id="contact-heading">Get In Touch</h2>
        <p className="contact-intro">We are here to assist you. Contact us for tailored solutions to elevate your business.</p>
        <div className="contact-address">
          <FiMapPin aria-hidden="true" />
          <div><h3>India - Indore</h3><p>New Administrative Complex, Moti Tabela, Indore, Madhya Pradesh, PIN 452007</p></div>
        </div>
        <img className="contact-robot" src="/UseIcons/image%20164%20(1).png" alt="Expert Emirates assistant robot" />
      </div>
    </section>
  )
}

export default ContactSection
