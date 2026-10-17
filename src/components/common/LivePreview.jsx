import { useState } from 'react'
import { FiExternalLink, FiRefreshCw } from 'react-icons/fi'

function LivePreview({
  url,
  title = 'Live Preview',
  className = '',
}) {
  const [reloadKey, setReloadKey] = useState(0)

  if (!url) return null

  return (
    <section className={`w-full ${className}`}>
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
              Live Preview
            </p>

            <h2 className="text-2xl font-medium tracking-tight text-[color:var(--color-ink)] sm:text-3xl">
              {title}
            </h2>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setReloadKey((prev) => prev + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-line)] text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-ink)]"
              aria-label="Refresh preview"
            >
              <FiRefreshCw className="h-4 w-4" />
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-2 rounded-full border border-[color:var(--color-line)] px-4 text-sm font-medium text-[color:var(--color-ink)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-ink)]"
            >
              Open Website
              <FiExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Browser Frame */}
        <div className="overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
          
          {/* Browser Bar */}
          <div className="flex h-12 items-center gap-4 border-b border-[color:var(--color-line)] bg-[color:var(--color-paper)] px-4">
            
            {/* Browser dots */}
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
            </div>

            {/* URL */}
            <div className="min-w-0 flex-1">
              <div className="mx-auto max-w-xl truncate rounded-md border border-[color:var(--color-line)] bg-white px-3 py-1.5 text-xs text-black/50">
                {url}
              </div>
            </div>

          </div>

          {/* Website */}
          <div className="relative aspect-[16/10] w-full bg-white">
            <iframe
              key={reloadKey}
              src={url}
              title={title}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

        </div>

        {/* Mobile / External link */}
        <div className="mt-5 flex justify-end sm:hidden">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-[color:var(--color-ink)]"
          >
            Open Website
            <FiExternalLink className="h-4 w-4" />
          </a>
        </div>

      </div>
    </section>
  )
}

export default LivePreview