import React, { useRef } from 'react'
import { Tabs, Swiper } from 'antd-mobile'
import { SwiperRef } from 'antd-mobile/es/components/swiper'
import styles from './index.module.less'

interface SwipeTabsProps {
  activeIndex: number
  setActiveIndex: (index: number) => void
  tabItems: Array<{ key: string; title: string }>
  children: React.ReactElement | React.ReactElement[]
}

const SwipeTabs: React.FC<SwipeTabsProps> = ({
  activeIndex,
  setActiveIndex,
  tabItems,
  children
}) => {
  const swiperRef = useRef<SwiperRef>(null)


  return (
    <>
      {tabItems.length > 0 && (
        <Tabs
          activeKey={tabItems[activeIndex]?.key || ''}
          onChange={key => {
            const index = tabItems.findIndex(item => item.key === key)
            if (index !== -1) {
              setActiveIndex(index)
              swiperRef.current?.swipeTo(index)
            }
          }}
          className={styles.tabs}
        >
          {tabItems.map(item => (
            <Tabs.Tab title={item.title} key={item.key} />
          ))}
        </Tabs>
      )}
      
      {tabItems.length > 0 && (
        <Swiper
          direction="horizontal"
          loop={false}
          indicator={() => null}
          ref={swiperRef}
          defaultIndex={activeIndex}
          onIndexChange={index => {
            setActiveIndex(index)
          }}
          style={{ flex: 1 }}
        >
          {React.Children.map(children as React.ReactElement[], (child, index) => (
            <Swiper.Item key={index}>
              <div style={{ 
                display: index === activeIndex ? 'block' : 'none',
                height: '100%'
              }}>
                {child}
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      ) }
    </>
  )
}

export default SwipeTabs
