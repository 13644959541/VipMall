import { Swiper } from 'antd-mobile'
import homeImage1 from '../../../public/pad/01.首页-2活动位.jpg'
import homeImage2 from '../../../public/pad/02.首页-3活动位.jpg'
import styles from './index.module.less'

const Carousel = () => {
  return (
    <Swiper
      autoplay
      loop
      className={styles.carousel}
    >
      <Swiper.Item>
        <img src={homeImage1} className={styles.image} />
      </Swiper.Item>
      <Swiper.Item>
        <img src={homeImage2} className={styles.image} />
      </Swiper.Item>
    </Swiper>
  )
}

export default Carousel
