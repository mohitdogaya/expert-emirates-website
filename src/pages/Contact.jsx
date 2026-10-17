import { useState } from 'react'
import {
  FiArrowUpRight,
  FiMail,
  FiGithub,
  FiLinkedin,
} from 'react-icons/fi'

import Section from '../components/common/Section.jsx'

const socials = [
  {
    label: 'Email',
    value: 'mohitdogaya@gmail.com',
    href: 'mailto:mohitdogaya@gmail.com',
    icon: FiMail,
  },
  {
    label: 'LinkedIn',
    value: 'LinkedIn',
    href: 'https://linkedin.com/in/mohitdogaya',
    icon: FiLinkedin,
  },
  {
    label: 'GitHub',
    value: 'GitHub',
    href: 'https://github.com/mohitdogaya',
    icon: FiGithub,
  },
]

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const subject = `New message from ${formData.name}`

    const body = `
Name: ${formData.name}
Email: ${formData.email}

${formData.message}
    `

    window.location.href = `mailto:mohitdogaya@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <main className="bg-[color:var(--color-bg)]">

      {/* HERO */}

      <Section padding="lg">

        <div className="max-w-6xl mx-auto px-5 md:px-8">

          <div className="pt-10 md:pt-20">

            {/* small label */}

            <div className="flex items-center justify-between mb-20 md:mb-28">

              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                Contact
              </span>

              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                2026
              </span>

            </div>


            {/* heading */}

            <div className="max-w-4xl">

              <h1
                className="
                  font-display
                  text-5xl
                  sm:text-6xl
                  md:text-7xl
                  lg:text-[7rem]
                  leading-[0.92]
                  tracking-[-0.055em]
                  text-[color:var(--color-ink)]
                "
              >
                Let's talk
                <br />

                <span className="text-[color:var(--color-muted)]">
                  about what's
                </span>

                <br />

                <span className="text-[color:var(--color-accent)]">
                  next.
                </span>
              </h1>

            </div>


            {/* intro */}

            <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:items-start md:justify-between gap-8">

              <p className="max-w-md text-base md:text-lg leading-relaxed text-[color:var(--color-muted)]">
                Whether you have a project in mind, an opportunity,
                or simply want to say hello — my inbox is open.
              </p>

              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                Scroll ↓
              </span>

            </div>

          </div>

        </div>

      </Section>


      {/* CONTACT + FORM */}

      <Section padding="lg">

        <div className="max-w-6xl mx-auto px-5 md:px-8">

          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-20 lg:gap-32">


            {/* LEFT */}

            <div>

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-10">
                Get in touch
              </p>


              {/* availability */}

              <div className="flex items-center gap-3 mb-14">

                <span className="relative flex w-2 h-2">

                  <span className="absolute inset-0 rounded-full bg-[color:var(--color-accent)] animate-ping opacity-50" />

                  <span className="relative w-2 h-2 rounded-full bg-[color:var(--color-accent)]" />

                </span>

                <span className="text-sm text-[color:var(--color-ink)]">
                  Available for new opportunities
                </span>

              </div>


              {/* socials */}

              <div className="space-y-5">

                {socials.map((item) => {
                  const Icon = item.icon

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={
                        item.href.startsWith('http')
                          ? '_blank'
                          : undefined
                      }
                      rel={
                        item.href.startsWith('http')
                          ? 'noreferrer'
                          : undefined
                      }
                      className="group flex items-center gap-4 w-fit"
                    >

                      <Icon
                        className="
                          w-4
                          h-4
                          text-[color:var(--color-muted)]
                          transition-colors
                          duration-300
                          group-hover:text-[color:var(--color-accent)]
                        "
                      />

                      <span
                        className="
                          text-sm
                          text-[color:var(--color-muted)]
                          transition-colors
                          duration-300
                          group-hover:text-[color:var(--color-ink)]
                        "
                      >
                        {item.value}
                      </span>

                      <FiArrowUpRight
                        className="
                          w-3.5
                          h-3.5
                          text-[color:var(--color-muted)]
                          opacity-0
                          -translate-x-2
                          translate-y-1
                          transition-all
                          duration-300
                          group-hover:opacity-100
                          group-hover:translate-x-0
                          group-hover:translate-y-0
                        "
                      />

                    </a>
                  )
                })}

              </div>


              {/* location */}

              <div className="mt-20">

                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-3">
                  Based in
                </p>

                <p className="text-sm text-[color:var(--color-ink)]">
                  Indore, India
                </p>

              </div>

            </div>


            {/* RIGHT FORM */}

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="mb-12">

                <label
                  htmlFor="name"
                  className="
                    block
                    font-mono
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    text-[color:var(--color-muted)]
                    mb-4
                  "
                >
                  01 — Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="
                    w-full
                    bg-transparent
                    border-0
                    border-b
                    border-[color:var(--color-line)]
                    py-4
                    text-xl
                    md:text-2xl
                    text-[color:var(--color-ink)]
                    placeholder:text-[color:var(--color-muted)]
                    outline-none
                    focus:border-[color:var(--color-ink)]
                    transition-colors
                  "
                />

              </div>


              {/* EMAIL */}

              <div className="mb-12">

                <label
                  htmlFor="email"
                  className="
                    block
                    font-mono
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    text-[color:var(--color-muted)]
                    mb-4
                  "
                >
                  02 — Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="
                    w-full
                    bg-transparent
                    border-0
                    border-b
                    border-[color:var(--color-line)]
                    py-4
                    text-xl
                    md:text-2xl
                    text-[color:var(--color-ink)]
                    placeholder:text-[color:var(--color-muted)]
                    outline-none
                    focus:border-[color:var(--color-ink)]
                    transition-colors
                  "
                />

              </div>


              {/* MESSAGE */}

              <div className="mb-12">

                <label
                  htmlFor="message"
                  className="
                    block
                    font-mono
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    text-[color:var(--color-muted)]
                    mb-4
                  "
                >
                  03 — Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me a little about your project..."
                  className="
                    w-full
                    resize-none
                    bg-transparent
                    border-0
                    border-b
                    border-[color:var(--color-line)]
                    py-4
                    text-xl
                    md:text-2xl
                    text-[color:var(--color-ink)]
                    placeholder:text-[color:var(--color-muted)]
                    outline-none
                    focus:border-[color:var(--color-ink)]
                    transition-colors
                  "
                />

              </div>


              {/* SUBMIT */}

              <div className="flex items-center justify-between pt-2">

                <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                  Usually replies within 24h
                </span>

                <button
                  type="submit"
                  className="
                    group
                    relative
                    inline-flex
                    items-center
                    gap-4
                    text-lg
                    font-medium
                    text-[color:var(--color-ink)]
                    pb-2
                  "
                >

                  <span
                    className="
                      relative
                      after:absolute
                      after:left-0
                      after:right-0
                      after:-bottom-1
                      after:h-px
                      after:bg-[color:var(--color-ink)]
                      after:origin-left
                      after:scale-x-100
                      group-hover:after:scale-x-0
                      after:transition-transform
                      after:duration-500
                    "
                  >
                    Send message
                  </span>

                  <span
                    className="
                      flex
                      items-center
                      justify-center
                      w-9
                      h-9
                      rounded-full
                      bg-[color:var(--color-ink)]
                      text-white
                      transition-all
                      duration-500
                      group-hover:bg-[color:var(--color-accent)]
                      group-hover:translate-x-1
                    "
                  >
                    <FiArrowUpRight className="w-4 h-4" />
                  </span>

                </button>

              </div>

            </form>

          </div>

        </div>

      </Section>


      {/* FOOTER STATEMENT */}

      <Section padding="sm">

        <div className="max-w-6xl mx-auto px-5 md:px-8">

          <div className="pt-8 md:pt-12">

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-muted)] mb-8">
              One last thing
            </p>

            <div className="max-w-4xl">
              <p className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.035em] text-[color:var(--color-ink)]">
                “One of the best investments
                <br className="hidden md:block" />
                you can make is in{' '}
                <span className="text-[color:var(--color-accent)]">
                  yourself.
                </span>”
              </p>

              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
                — Warren Buffett
              </p>
            </div>

          </div>

        </div>

      </Section>

    </main>
  )
}

export default Contact