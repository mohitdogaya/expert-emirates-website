import { useEffect, useRef, useState } from 'react'
import { FiPlay } from 'react-icons/fi'
import TiltedCard, { TiltedCardLayer } from '../visuals/TiltedCard.jsx'

const reviews = [
  { id: 'review-1', title: 'Real Trader Review', description: 'Setup Experience', videoId: 'i08qgWcPCJw' },
  { id: 'review-2', title: 'Real Trader Review', description: 'Setup Experience', videoId: '5Tk90bbBbIc' },
  { id: 'review-3', title: 'Real Trader Review', description: 'Setup Experience', videoId: 'Wi1phdTNJy4' },
  { id: 'review-4', title: 'Real Trader Review', description: 'Setup Experience', videoId: 'yGAOkXIUoBE' },
]

function ReviewCard({ review }) {
  const [flipped, setFlipped] = useState(false)
  const image = `https://img.youtube.com/vi/${review.videoId}/hqdefault.jpg`

  return (
    <TiltedCard
      imageSrc={image}
      altText={`${review.title} video thumbnail`}
      captionText="Play client review"
      containerHeight="100%"
      containerWidth="100%"
      imageHeight="100%"
      imageWidth="100%"
      rotateAmplitude={10}
      scaleOnHover={1.04}
      glare={0.35}
      shadow={0.45}
      radius={18}
      flipped={flipped}
      onFlip={setFlipped}
      className="review-tilted-card"
      backContent={
        <>
          {flipped && (
          <iframe
            className="review-video-frame"
            src={`https://www.youtube-nocookie.com/embed/${review.videoId}?autoplay=1&mute=1&rel=0&playsinline=1`}
            title={review.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          )}
        </>
      }
    >
      <TiltedCardLayer depth={24} className="review-card-caption">
        <span className="review-play-mark" aria-hidden="true"><FiPlay /></span>
        <span><strong>{review.title}</strong><small>{review.description}</small></span>
      </TiltedCardLayer>
    </TiltedCard>
  )
}

function ReviewCarousel() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || reviews.length < 2) return undefined

    let frame = 0
    let previousTime = 0
    let hovered = false
    let pausedByClick = false
    let clickToggleUsed = false
    let visible = false
    const onPointerEnter = () => { hovered = true }
    const onPointerLeave = () => {
      hovered = false
      clickToggleUsed = false
    }
    const onClick = () => {
      pausedByClick = !pausedByClick
      clickToggleUsed = true
      hovered = false
    }
    const animate = time => {
      const hoverPaused = hovered && !clickToggleUsed
      if (previousTime && !document.hidden && !hoverPaused && !pausedByClick) {
        const elapsed = Math.min((time - previousTime) / 1000, 0.05)
        const item = track.querySelector('.review-carousel-item')
        const loopWidth = item
          ? (item.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || '0')) * reviews.length
          : track.scrollWidth / 2
        track.scrollLeft += elapsed * 95
        if (loopWidth > 0 && track.scrollLeft >= loopWidth) track.scrollLeft -= loopWidth
      }
      previousTime = time
      frame = visible ? window.requestAnimationFrame(animate) : 0
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      previousTime = 0
      if (visible && !frame) frame = window.requestAnimationFrame(animate)
      if (!visible && frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
    })
    observer.observe(track)

    track.addEventListener('pointerenter', onPointerEnter)
    track.addEventListener('pointerleave', onPointerLeave)
    track.addEventListener('click', onClick)
    return () => {
      observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
      track.removeEventListener('pointerenter', onPointerEnter)
      track.removeEventListener('pointerleave', onPointerLeave)
      track.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div className="review-carousel-container" aria-label="Client video reviews">
      <div className="review-carousel-track" ref={trackRef} tabIndex={0}>
        {[...reviews, ...reviews].map((review, index) => (
          <article className="review-carousel-item" key={`${review.id}-${index}`}>
            <ReviewCard review={review} />
          </article>
        ))}
      </div>
    </div>
  )
}

export default ReviewCarousel
