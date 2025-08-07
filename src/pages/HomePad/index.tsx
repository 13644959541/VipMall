import React, { memo, useState, useRef } from 'react'
import { Tabs, Swiper, Card, Image as AntdImage, Badge, Checkbox } from 'antd-mobile'
import { Star, ShoppingCart, Clock, Gift } from 'lucide-react'
import styles from './index.module.less'
import { SwiperRef } from 'antd-mobile/es/components/swiper'
import Carousel from '../../components/Carousel'

const tabItems = [
  { key: 'first', title: '首页' },
  { key: 'second', title: '代金券专区' },
  { key: 'third', title: '菜品券专区' },
  { key: 'fourth', title: '周边礼品' },
]

import ProductCard from '../../components/ProductCard'



const HomePad = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperRef>(null)

  // 模拟商品数据
  const products = [
    {
      id: 1,
      image: '/taro-paste.png',
      name: '商品名称长长长长长长长长长长长长长长长长长长',
      description: '累计兑换 46 份',
      points: 2000,
      originalPrice: 68,
    },
    {
      id: 2,
      image: '/taro-paste.png',
      name: '商品名称超级超级长长长长长长长长长长长长长长长长长长长长长长长...',
      description: '累计兑换 46 份（受国内疫情影响超级长长长长长长...',
      points: 2000,
      originalPrice: 68,
    },
    {
      id: 3,
      image: '/taro-paste.png',
      name: '商品名称长长长长长长长长长长长长长长长长长长',
      description: '累计兑换 46 份',
      points: 2000,
      originalPrice: 68,
    },
    {
      id: 4,
      image: '/taro-paste.png',
      name: '商品名称长长长长长长长长长长长长长长长长长长',
      description: '累计兑换 46 份',
      points: 2000,
      originalPrice: 68,
    },
    {
      id: 5,
      image: '/taro-paste.png',
      name: '商品名称长长长长长长长长长长长长长长长长长长',
      description: '累计兑换 46 份',
      points: 2000,
      originalPrice: 68,
    },
    {
      id: 6,
      image: '/taro-paste.png',
      name: '商品名称超级长长长长',
      description: '累计兑换 46 份',
      points: 2000,
      originalPrice: 68,
    },
     {
      id: 7,
      image: '/taro-paste.png',
      name: '商品名称长长长长长长长长长长长长长长长长长长',
      description: '累计兑换 46 份',
      points: 2000,
      originalPrice: 68,
    },
    {
      id: 8,
      image: '/taro-paste.png',
      name: '商品名称超级超级长长长长长长长长长长长长长长长长长长长长长长长...',
      description: '累计兑换 46 份（受国内疫情影响超级长长长长长长...',
      points: 2000,
      originalPrice: 68,
    },
    {
      id: 9,
      image: '/taro-paste.png',
      name: '商品名称长长长长长长长长长长长长长长长长长长',
      description: '累计兑换 46 份',
      points: 2000,
      originalPrice: 68,
    },
    {
      id: 10,
      image: '/taro-paste.png',
      name: '商品名称长长长长长长长长长长长长长长长长长长',
      description: '累计兑换 46 份',
      points: 2000,
      originalPrice: 68,
    }
    
  ]

  // const [showCarousel, setShowCarousel] = useState(window.innerWidth >= 768 && window.innerWidth <= 1024);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setShowCarousel(window.innerWidth < 1024);
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  return (
    <div className={styles['pad-home']}>
      {/* <Sidebar /> */}

      <div className={styles['main-content']}>
        <Tabs
          activeKey={tabItems[activeIndex].key}
          onChange={key => {
            const index = tabItems.findIndex(item => item.key === key)
            setActiveIndex(index)
            swiperRef.current?.swipeTo(index)
          }}
          className={styles.tabs}
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
                  <div
                    className={styles.contentWrapper}
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      overscrollBehavior: 'contain'
                    }}
                  >
                    {/* 主Banner - 使用自定义Carousel组件 */}
                    { <Carousel 
                      items={[
                        {
                          image: "/hot-pot-banner.png",
                          alt: "纯纯纯牛油锅 NEW",
                          fallback: (
                            <div className="w-full h-48 bg-red-500 flex items-center justify-center text-white text-xl font-bold">
                              纯纯纯牛油锅 NEW<br />BEEF TALLOW<br />HOT POT SOUP BASE
                            </div>
                          )
                        },
                        {
                          image: "/hot-pot-promotion.png",
                          alt: "火锅促销",
                          fallback: (
                            <div className="w-full h-48 bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
                              火锅促销活动
                            </div>
                          )
                        },
                        {
                          image: "/panda-promotion.png",
                          alt: "熊猫促销",
                          fallback: (
                            <div className="w-full h-48 bg-green-500 flex items-center justify-center text-white text-xl font-bold">
                              熊猫主题促销
                            </div>
                          )
                        }
                      ]}
                      height={300}
                      className="mt-2 mb-2"
                    />}

                    {/* 地区活动 */}
                    {/* <h2 className=" font-bold">地区活动</h2>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <Card className="overflow-hidden">
                        <AntdImage
                          src="/hot-pot-promotion.png"
                          alt="一起嗨！海底捞"
                          width="100%"
                          height="120px"
                          fit="cover"
                          fallback={
                            <div className="w-full h-30 bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                              一起嗨！<br />海底捞<br />满99立享优惠3元
                            </div>
                          }
                        />
                      </Card>
                      <Card className=" overflow-hidden">
                        <AntdImage
                          src="/panda-promotion.png"
                          alt="熊猫人生海底捞火锅"
                          width="100%"
                          height="120px"
                          fit="cover"
                          fallback={
                            <div className="w-full h-30 bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                              熊猫人生<br />海底捞火锅
                            </div>
                          }
                        />
                      </Card>
                    </div> */}

                    {/* 门店热卖 */}
                    <div className="flex items-center justify-between ">
                      <h2 className="font-bold">门店热卖</h2>
                      <div className="flex items-center gap-4">
                        <Checkbox className="text-gray-500">看我可兑</Checkbox>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {products.map(product => (
                        <ProductCard
                          key={product.id}
                          image={product.image}
                          name={product.name}
                          description={product.description}
                          points={product.points}
                          originalPrice={product.originalPrice}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {index === 1 && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    代金券专区开发中...
                  </div>
                )}
                {index === 2 && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    菜品券专区开发中...
                  </div>
                )}
                {index === 3 && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    周边礼品开发中...
                  </div>
                )}
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default memo(HomePad)
