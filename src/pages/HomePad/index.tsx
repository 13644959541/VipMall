import React, { memo, useState, useEffect } from 'react'
import { Swiper } from 'antd-mobile'
import styles from './index.module.less'
import SwipeTabs from '../../components/SwipeTabs'
import HomeContent from '@/layout/pad/HomeContent'
import GiftContent from '@/layout/pad/Gift'
import MealContent from '@/layout/pad/Meal'
import CouponContent from '@/layout/pad/Coupon'
import { useTranslation } from 'react-i18next';
import useAxios from '../../hooks/useAxios';
import { getHotProductList, getProductList, Product } from '../../services/productService';
import { getCountryBanners } from '../../services/HeaderService';
import LoadingView from '../../components/LoadingView';
import { useAuthModel } from '@/model/useAuthModel';

 // 根据类型筛选商品
  // {
  // 		  id:0,
  // 		  name:'周边礼品'
  // },{
  // 		  id:1,
  // 		  name:'代金券'
  // },{
  // 		  id:2,
  // 		  name:'菜品券'
  // }
const HomePad = () => {
  const { t, i18n } = useTranslation('common'); // 这里指定命名空间
  const { user } = useAuthModel();
  const [activeIndex, setActiveIndex] = useState(0)
  const [hot, setHotProducts] = useState<Product[]>([]);
  const [coupon, couponProducts] = useState<Product[]>([]);
  const [meal, mealProducts] = useState<Product[]>([]);
  const [gift, giftProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carouselItems, setCarouselItems] = useState<any[]>([]);

  // 默认横幅配置
  const DEFAULT_BANNER = {
    image: "/hot-pot-banner.jpg",
    alt: "banner"
  };

  // 设置默认横幅的辅助函数
  const setDefaultBanner = () => setCarouselItems([DEFAULT_BANNER]);

  // 获取横幅数据
  useEffect(() => {
    const fetchBanners = async () => {
      if (!user?.country) {
        setDefaultBanner();
        return;
      }
      
      try {
        const banners = await getCountryBanners({ 
          countryCode: user.country
        });
        
        if (!banners?.length) {
          setDefaultBanner();
          return;
        }
        
        setCarouselItems(banners.map((banner) => ({
          image: banner.appImageUrl,
          alt: banner.title || "banner",
        })));
      } catch (error) {
        console.error('获取横幅数据失败:', error);
        setDefaultBanner();
      }
    };

    fetchBanners();
  }, [user?.country]);

  // 模拟标签数据
  const tabItems = [
    { key: 'first', title: t('home.home') },
    { key: 'second', title: t('home.voucherZone') },
    { key: 'third', title: t('home.dishCouponZone') },
    { key: 'fourth', title: t('home.merchandise') },
  ]
    // 多语言变量
  const i18nVars = {
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

  // 获取商品数据
  useEffect(() => {
   const fetchProducts = async () => {
  setLoading(true);
  try {
    const hotProducts = await getHotProductList({
      productType: 0,
      language: i18n.language,
      storeId: user?.shopNo,
      localLevel: user?.localLevel
    });
    setHotProducts(hotProducts);
  } catch (err) {
    console.error('获取热销商品失败:', err);
    // 可以在这里设置错误状态或显示提示
  }
  
  try {
    const couponProductsData = await getProductList({
      productType: 1,
      language: i18n.language,
      storeId: user?.shopNo,
      localLevel: user?.localLevel,
    });
    couponProducts(couponProductsData);
  } catch (err) {
    console.error('获取代金券失败:', err);
  }
  
  try {
    const mealProductsData = await getProductList({
      productType: 2,
      language: i18n.language,
      storeId: user?.shopNo,
      localLevel: user?.localLevel
    });
    mealProducts(mealProductsData);
  } catch (err) {
    console.error('获取菜品券失败:', err);
  }
  
  try {
    const giftProductsData = await getProductList({
      productType: 0,
      language: i18n.language,
      storeId: user?.shopNo,
      localLevel: user?.localLevel
    });
    giftProducts(giftProductsData);
  } catch (err) {
    console.error('获取周边礼品失败:', err);
  }
  
  setLoading(false);
};

    fetchProducts();
  }, []);

  //useTitle('主页');
  
  // 显示加载状态
  // if (loading) {
  //   return <LoadingView />;
  // }

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
                    products={hot}
                    productName={i18nVars.productName}
                    checkboxName={i18nVars.checkboxName}
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
                      productName={i18nVars.productName}
                      checkboxName={i18nVars.checkboxName}
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
                      productName={i18nVars.productName}
                      checkboxName={i18nVars.checkboxName}
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
                      productName={i18nVars.productName}
                      checkboxName={i18nVars.checkboxName}
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
