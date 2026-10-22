import Carousel from './Carousel.jsx'

const items = [
  { id: 'review-1', title: 'Client Review 1', description: 'Real customer experience', videoId: 'i08qgWcPCJw', image: 'https://img.youtube.com/vi/i08qgWcPCJw/hqdefault.jpg' },
  { id: 'review-2', title: 'Client Review 2', description: 'Real customer experience', videoId: '5Tk90bbBbIc', image: 'https://img.youtube.com/vi/5Tk90bbBbIc/hqdefault.jpg' },
  { id: 'review-3', title: 'Client Review 3', description: 'Real customer experience', videoId: 'Wi1phdTNJy4', image: 'https://img.youtube.com/vi/Wi1phdTNJy4/hqdefault.jpg' },
  { id: 'review-4', title: 'Client Review 4', description: 'Real customer experience', videoId: 'yGAOkXIUoBE', image: 'https://img.youtube.com/vi/yGAOkXIUoBE/hqdefault.jpg' },
]

function ReviewCarousel() {
  return (
    <div className="review-carousel-container">
      <Carousel
        items={items}
        baseWidth={640}
        aspectRatio={1.5}
        effect="scale"
        indicator="bars"
        frame={false}
        arrows
        loop
        autoplay
        autoplayDelay={4000}
        pauseOnHover={false}
        theme="dark"
        peek={104}
        gap={16}
        radius={20}
        draggable
        round={false}
      />
    </div>
  )
}

export default ReviewCarousel
