import { Swiper } from 'antd-mobile'
import { Image as AntdImage } from 'antd-mobile'
import styles from './index.module.less'

interface CarouselItem {
  image: string
  alt: string
  fallback?: React.ReactNode
  style?: React.CSSProperties
}

interface CarouselProps {
  items: CarouselItem[]
  height?: number
  className?: string
}

const Carousel = ({ items, height, className = '' }: CarouselProps) => {
  return (
    <Swiper
     
      className={`${className}`}
      style={{ overflow: 'visible', width: '100%' }}
    >
      {items.map((item, index) => (
        <Swiper.Item key={index}>
          <AntdImage
            src={item.image}
            alt={item.alt}
            width="100%"
            style={{ borderRadius: '10px'}}
            height={`${height}px`}
            fit="cover"
            fallback={item.fallback}
          />
        </Swiper.Item>
      ))}
    </Swiper>
  )
}

export default Carousel
