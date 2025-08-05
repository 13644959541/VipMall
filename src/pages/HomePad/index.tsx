import React, { memo } from 'react'
import { Tabs, Swiper } from 'antd-mobile'
import styles from './index.module.less'
import { SwiperRef } from 'antd-mobile/es/components/swiper'
import Carousel from '../../components/Carousel'
import RegionActivity from '../../components/RegionActivity'
const tabItems = [
  { key: 'first', title: '首页' },
  { key: 'second', title: '代金卷专区' },
  { key: 'third', title: '菜品卷专区' },
  { key: 'fourth', title: '周边礼品' },
]

const HomePad = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperRef>(null)
  return (
    <div className={styles['pad-home']}>
      <Tabs
        activeKey={tabItems[activeIndex].key}
        onChange={key => {
          const index = tabItems.findIndex(item => item.key === key)
          setActiveIndex(index)
          swiperRef.current?.swipeTo(index)
        }}
      >
        {tabItems.map(item => (
          <Tabs.Tab title={item.title} key={item.key} />
        ))}
      </Tabs>
      
      <Swiper
        direction='horizontal'
        loop={false}
        indicator={() => null}
        ref={swiperRef}
        defaultIndex={activeIndex}
        onIndexChange={index => {
          setActiveIndex(index)
        }}
        style={{ flex: 1 }}
      >
        {tabItems.map((item, index) => (
          <Swiper.Item key={item.key}>
            <div className={styles.content}>
              {index === 0 && (
                <div className={styles.contentWrapper}>
                  <Carousel />
                  <RegionActivity />
                  
                </div>
              )}
              {/* {index === 1 && 'Pad代金卷专区'}
              {index === 2 && 'Pad菜品卷专区'}
              {index === 3 && 'Pad周边礼品'} */}
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
    </div>
  )
}

export default memo(HomePad)
