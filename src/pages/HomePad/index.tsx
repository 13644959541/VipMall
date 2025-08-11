import React, { memo, useState } from 'react'
import styles from './index.module.less'
import SwipeTabs from '../../components/SwipeTabs'
import HomeContent from '@/layout/pad/HomeContent'
import GiftConent from '@/layout/pad/Gift'
import MealContent from '@/layout/pad/Meal'
import VouchersContent from '@/layout/pad/Vouchers'
import useTitle from '@/hooks/useTitle'
const HomePad = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  // 模拟标签数据
  const tabItems = [
  { key: 'first', title: '首页' },
  { key: 'second', title: '代金券专区' },
  { key: 'third', title: '菜品券专区' },
  { key: 'fourth', title: '周边礼品' },
  ]
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
  // 模拟轮播图数据
  const carouselItems = [
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
  ]
  useTitle('主页');

  return (
    <div className={styles['pad-home']}>
      <div className={styles['main-content']}>
        <SwipeTabs
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          tabItems={tabItems}
        >
          {tabItems.map((item, index) => (
            <Swiper.Item key={item.key}>
              <div className={styles.content}>
                {index === 0 && (
                  <div
                    className={styles.contentWrapper}
                  >
                    <HomeContent 
                      carouselItems={carouselItems}
                      products={products}
                      productName="热门推荐"
                      checkboxName="看我兑换"
                    />
                  </div>
                )}
                {index === 1 && (
                   <div
                    className={styles.contentWrapper}
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      overscrollBehavior: 'contain'
                    }}
                  >
                    <GiftConent 
                      carouselItems={carouselItems}
                      products={products}
                      productName="热门推荐"
                      checkboxName="看我兑换"
                    />
                  </div>
                )}
                {index === 2 && (
                 <div
                    className={styles.contentWrapper}
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      overscrollBehavior: 'contain'
                    }}
                  >
                    <MealContent 
                      carouselItems={carouselItems}
                      products={products}
                      productName="热门推荐"
                      checkboxName="看我兑换"
                    />
                  </div>
                )}
                {index === 3 && (
                   <div
                    className={styles.contentWrapper}
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      overscrollBehavior: 'contain'
                    }}
                  >
                    <VouchersContent 
                      carouselItems={carouselItems}
                      products={products}
                      productName="热门推荐"
                      checkboxName="看我兑换"
                    />
                  </div>
                )}
              </div>
            </Swiper.Item>
          ))}
        </SwipeTabs>
      </div>
    </div>
  )
}

export default memo(HomePad)
