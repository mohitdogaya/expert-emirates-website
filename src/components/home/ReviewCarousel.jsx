import { useState } from 'react'
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
        <iframe
          className="review-video-frame"
          src={`https://www.youtube-nocookie.com/embed/${review.videoId}?autoplay=1&mute=1&rel=0&playsinline=1`}
          title={review.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
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
  return (
    <div className="review-carousel-container" aria-label="Client video reviews">
      <div className="review-carousel-track" tabIndex={0}>
        {reviews.map(review => (
          <article className="review-carousel-item" key={review.id}>
            <ReviewCard review={review} />
          </article>
        ))}
      </div>
    </div>
  )
}

export default ReviewCarousel
