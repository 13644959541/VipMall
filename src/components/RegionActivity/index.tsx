import React from 'react'
import styles from './index.module.less'
import image1 from '../../../public/pad/03.产品详情页.jpg'
import image2 from '../../../public/pad/04.代金券专区.jpg'

interface Props {
  title?: string
  images?: string[]
}

const RegionActivity: React.FC<Props> = ({
  title = '地区活动',
  images = [image1, image2, image2]
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.images}>
        {images.map((img, index) => (
          <img 
            key={index}
            src={img} 
            className={styles.image}
            alt={`活动图片${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default RegionActivity
