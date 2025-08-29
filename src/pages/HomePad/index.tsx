import React, { memo, useState } from 'react'
import styles from './index.module.less'
import SwipeTabs from '../../components/SwipeTabs'
import HomeContent from '@/layout/pad/HomeContent'
import GiftContent from '@/layout/pad/Gift'
import MealContent from '@/layout/pad/Meal'
import CouponContent from '@/layout/pad/Coupon'
import { useTranslation } from 'react-i18next';
const HomePad = () => {
  const { t } = useTranslation('common'); // 这里指定命名空间
  const [activeIndex, setActiveIndex] = useState(0)
  // 模拟标签数据
  const tabItems = [
    { key: 'first', title: t('header.home') },
    { key: 'second', title: t('home.voucherZone') },
    { key: 'third', title: t('home.dishCouponZone') },
    { key: 'fourth', title: t('home.merchandise') },
  ]
    // 多语言变量
  const i18n = {
    productName: t('home.recommended'),
    checkboxName: t('filter.redeemableOnly')
  };

  //排序
  const sortOptions = [
    { label: t('product.all'), value: "all" },
    { label: t('product.redeemableForRedMembers'), value: "1" },
    { label: t('product.redeemableForSilverMembers'), value: "2" },
    { label: t('product.redeemableForGoldMembers'), value: "3" },
    { label: t('product.redeemableForPremiumMembers'), value: "4" }
  ]
  // 模拟商品数据
  const products = [
    {
      id: 1,
      type: 'meal',
      image: '/taro-paste.png',
      name: '特色芋泥甜品特色芋泥甜品特色芋泥甜品特色芋泥甜品特色芋泥甜品特色芋泥甜品特色芋泥甜品',
      description: '累计兑换 89 份',
      points: 2500,
      sales: 89,
      originalPrice: 58,
      isAvailable: true,
      memberLevel: '1'
    },
    {
      id: 2,
      type: 'coupon',
      image: '/taro-paste.png',
      name: '特色毛肚',
      description: '累计兑换 11189 份',
      sales: 11189,
      points: 2500,
      originalPrice: 58,
      isAvailable: true,
      memberLevel: '2'
    }
  ]
  const coupon = [{
    id: 1,
    type: 'coupon',
    image: '/taro-paste.png',
    name: '1元代金券',
    description: '累计兑换 156 份',
    sales: 156,
    points: 1,
    originalPrice: 100,
    availableTime: '8/12-8/31 可兑换',
    conflictRule: '不可与其他优惠券同时使用，一桌只可使用一次，具体规则请咨询门店服务员。',
    isAvailable: true,
    memberLevel: '1'
  }, {
    id: 2,
    type: 'coupon',
    image: '/taro-paste.png',
    name: '50元代金券',
    description: '累计兑换 342 份',
    points: 50,
    sales: 342,
    originalPrice: 50,
    conflictRule: '一桌只可使用一次',
    isAvailable: true,
    memberLevel: '2'
  },
{
    id: 3,
    type: 'coupon',
    image: '/taro-paste.png',
    name: '100元代金券',
    description: '累计兑换 156 份',
    sales: 156,
    points: 100,
    originalPrice: 100,
    availableTime: '9/12-9/31 可兑换',
    conflictRule: '不可与其他优惠券同时使用，一桌只可使用一次，具体规则请咨询门店服务员。',
    isAvailable: false,
    memberLevel: '3'
  }, {
    id: 4,
    type: 'coupon',
    image: '/taro-paste.png',
    name: '500元代金券',
    description: '累计兑换 342 份',
    points: 500,
    sales: 342,
    originalPrice: 50,
    conflictRule: '一桌只可使用一次',
    isAvailable: true,
    memberLevel: '4'
  }]
  const meal = [{
    id: 1,
    type: 'meal',
    image: '/taro-paste.png',
    name: '双人火锅套餐',
    description: '累计兑换 203 份',
    sales: 203,
    points: 8000,
    originalPrice: 198,
    availableTime: '10:00-22:00',
    isAvailable: true,
    memberLevel: '1'
  },]
  const gift = [{
    id: 1,
    type: 'gift',
    image: '/taro-paste.png',
    name: '限量版熊猫玩偶',
    description: '累计兑换 56 份',
    sales: 56,
    points: 12000,
    originalPrice: 299,
    remainingStock: 5,
    isAvailable: true,
    memberLevel: '1'
  },
  {
    id: 2,
    type: 'gift',
    image: '/taro-paste.png',
    name: '火锅底料礼盒',
    description: '累计兑换 78 份',
    sales: 78,
    points: 6000,
    originalPrice: 168,
    remainingStock: 12,
    isAvailable: true,
    memberLevel: '2'
  }]
  // 模拟轮播图数据
  const carouselItems = [
    {
      image: "/hot-pot-banner.png",
      alt: "纯纯纯牛油锅 NEW",
      fallback: (
        <div className="w-full h-48 bg-[#E60012] flex items-center justify-center text-white text-xl font-bold">
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
  ]

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
                      sortOptions={sortOptions}
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
                      sortOptions={sortOptions}
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
                      sortOptions={sortOptions}
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
