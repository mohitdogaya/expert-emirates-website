import { useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { faqs } from './homeData.js'
import AnimatedLink from './AnimatedLink.jsx'
import useScrollReveal from './useScrollReveal.js'
import ScrollText from './ScrollText.jsx'
import '../../stylesheets/FaqSection.css'

function FaqSection() {
  const [sectionRef, visible] = useScrollReveal()
  const [activeFaq, setActiveFaq] = useState(0)

  return (
    <section className={`faq-section scroll-section${visible ? ' is-visible' : ''}`} ref={sectionRef} id="faq" aria-labelledby="faq-heading">
      <div className="faq-copy">
        <span className="section-eyebrow">Frequently asked questions</span>
        <ScrollText id="faq-heading">Got Questions? We’ve<br />Got Answers.</ScrollText>
        <p>Find answers to common questions about our Expert Advisors, setup process, and support.</p>
        <AnimatedLink href="#faq-list">View All FAQs</AnimatedLink>
      </div>
      <div className="faq-list" id="faq-list">
        {faqs.map(([question, answer], index) => {
          const isOpen = activeFaq === index
          const answerId = `faq-answer-${index}`
          return (
            <article className={`faq-item${isOpen ? ' is-open' : ''}`} key={question} style={{ '--item-delay': `${index * 65}ms` }}>
              <button type="button" className="faq-question" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setActiveFaq(isOpen ? -1 : index)}>
                <span className="faq-diamond" aria-hidden="true">◆</span><span>{question}</span>{isOpen ? <FiMinus aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
              </button>
              <div className="faq-answer" id={answerId} hidden={!isOpen}><p>{answer}</p></div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default FaqSection
