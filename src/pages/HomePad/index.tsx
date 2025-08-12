import React, { memo, useState } from 'react'
import styles from './index.module.less'
import SwipeTabs from '../../components/SwipeTabs'
import HomeContent from '@/layout/pad/HomeContent'
import GiftContent from '@/layout/pad/Gift'
import MealContent from '@/layout/pad/Meal'
import CouponContent from '@/layout/pad/Coupon'
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
      type: 'product',
      image: '/taro-paste.png',
      name: '特色芋泥甜品特色芋泥甜品特色芋泥甜品特色芋泥甜品特色芋泥甜品特色芋泥甜品特色芋泥甜品',
      description: '累计兑换 89 份',
      points: 2500,
      originalPrice: 58,
      isAvailable: true
    },
    {
      id: 2,
      type: 'product',
      image: '/taro-paste.png',
      name: '特色毛肚',
      description: '累计兑换 11189 份',
      points: 2500,
      originalPrice: 58,
      isAvailable: true
    }
  ]
  const coupon = [{
    id: 1,
    type: 'coupon',
    image: '/taro-paste.png',
    name: '100元代金券',
    description: '累计兑换 156 份',
    points: 5000,
    originalPrice: 100,
    redeemPeriod: '8/12-8/31 可兑换',
    conflictRule: '不可与其他优惠券同时使用，一桌只可使用一次，具体规则请咨询门店服务员。',
    isAvailable: true,
    isRedeemable: true
  }, {
    id: 2,
    type: 'coupon',
    image: '/taro-paste.png',
    name: '50元代金券',
    description: '累计兑换 342 份',
    points: 2500,
    originalPrice: 50,
    conflictRule: '一桌只可使用一次',
    isAvailable: true
  },]
  const meal = [{
    id: 1,
    type: 'meal',
    image: '/taro-paste.png',
    name: '双人火锅套餐',
    description: '累计兑换 203 份',
    points: 8000,
    originalPrice: 198,
    redeemPeriod: '10:00-22:00',
    isAvailable: true,
    isRedeemable: false
  },]
  const gift = [{
    id: 1,
    type: 'gift',
    image: '/taro-paste.png',
    name: '限量版熊猫玩偶',
    description: '累计兑换 56 份',
    points: 12000,
    originalPrice: 299,
    remainingStock: 5,
    isAvailable: true
  },
  {
    id: 2,
    type: 'gift',
    image: '/taro-paste.png',
    name: '火锅底料礼盒',
    description: '累计兑换 78 份',
    points: 6000,
    originalPrice: 168,
    remainingStock: 12,
    isAvailable: true
  }]
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
   // 多语言变量
  const i18n = {
    productName: "热门推荐",
    checkboxName: "看我兑换"
  };
  //useTitle('主页');
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
                      productName={i18n.productName}
                      checkboxName={i18n.checkboxName}
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
                    <CouponContent
                      carouselItems={carouselItems}
                      products={coupon}
                      productName={i18n.productName}
                      checkboxName={i18n.checkboxName}
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
                      products={meal}
                      productName={i18n.productName}
                      checkboxName={i18n.checkboxName}
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
                    <GiftContent  
                      carouselItems={carouselItems}
                      products={gift}
                      productName={i18n.productName}
                      checkboxName={i18n.checkboxName}
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
