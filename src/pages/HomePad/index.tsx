import React, { memo, useState, useEffect } from 'react'
import { Swiper } from 'antd-mobile'
import styles from './index.module.less'
import SwipeTabs from '../../components/SwipeTabs'
import HomeContent from '@/layout/pad/HomeContent'
import GiftContent from '@/layout/pad/Gift'
import MealContent from '@/layout/pad/Meal'
import CouponContent from '@/layout/pad/Coupon'
import { useTranslation } from 'react-i18next';
import { getHotList, getProductList, Product } from '../../services/productService';
import { getCountryBanners, getCategoryTree, CategoryResponse } from '../../services/headerService';
import LoadingView from '../../components/LoadingView';
import { useAuthModel } from '@/model/useAuthModel';

const HomePad = () => {
  const { t, i18n } = useTranslation('common'); 
  const { user } = useAuthModel();
  const [activeIndex, setActiveIndex] = useState(0)
  const [hot, setHotProducts] = useState<Product[]>([]);
  const [coupon, couponProducts] = useState<Product[]>([]);
  const [meal, mealProducts] = useState<Product[]>([]);
  const [gift, giftProducts] = useState<Product[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    0: true, // 首页加载状态
    1: false, // 代金券加载状态
    2: false, // 菜品券加载状态
    3: false  // 周边礼品加载状态
  });
  const [carouselItems, setCarouselItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoryIdStrings, setCategoryIdStrings] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [tabItems, setTabItems] = useState<{ key: string; title: string; categoryId: number }[]>([]);

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
          image: banner.padImageUrl,
          alt: banner.title || "banner",
        })));
      } catch (error) {
        console.error('获取横幅数据失败:', error);
        setDefaultBanner();
      }
    };

    fetchBanners();
  }, [user?.country]);

  // 获取分类树数据
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.country) {
        setCategoriesLoading(false);
        return;
      }

      try {
        setCategoriesLoading(true);
        const categoryData = await getCategoryTree({
          countryCode: user.country,
          terminalType: 'PAD',
          language: i18n.language
        });

        setCategories(categoryData);

        // 处理分类数据，为每个一级分类提取子分类ID
        const categoryIds = categoryData.map(category => 
          category.children?.map(child => child.categoryId).join(',') || ''
        );
        setCategoryIdStrings(categoryIds);

        // 更新tabItems
        const newTabItems = [
          // 在最前面添加首页对象
          {
            key: "1",
            title: t('home.home'),
            categoryId: 0
          },
          // 原有的分类数据
          ...categoryData.map(category => ({
            key: `category-${category.categoryId}`,
            title: category.categoryName || '',
            categoryId: category.categoryId || 0
          }))
        ];

        setTabItems(newTabItems);

      } catch (error) {
        console.error('获取分类树失败:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [user?.country, i18n.language]);

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

  // 获取指定tab的数据
  const fetchTabData = async (tabIndex: number) => {
    // 设置当前tab的加载状态为true
    setLoadingStates(prev => ({ ...prev, [tabIndex]: true }));
    try {
      // 获取当前tab对应的分类ID字符串

      if (tabIndex === 0) { // 首页 - 热销商品
        const hotProducts = await getHotList({
          terminalType: "PAD",
          language: i18n.language,
          storeId: user?.shopNo,
          localLevel: user?.localLevel
        });
        setHotProducts(hotProducts);
      } else { // 其他tab - 普通商品
        const categoryIds = categoryIdStrings[tabIndex - 1] || "";
        const productsData = await getProductList({
          categoryIds: categoryIds,
          language: i18n.language,
          storeId: user?.shopNo,
          localLevel: user?.localLevel
        });

        // 根据tabIndex设置对应的产品数据
        switch (tabIndex) {
          case 1: // 代金券
            couponProducts(productsData);
            break;
          case 2: // 菜品券
            mealProducts(productsData);
            break;
          case 3: // 周边礼品
            giftProducts(productsData);
            break;
          default:
            console.warn('未知的tab索引:', tabIndex);
        }
      }
    } catch (err) {
      console.error(`获取tab ${tabIndex} 数据失败:`, err);
    } finally {
      // 设置当前tab的加载状态为false
      setLoadingStates(prev => ({ ...prev, [tabIndex]: false }));
    }
  };

  // 监听tab切换、语言变化和分类数据变化，按需获取数据
  useEffect(() => {
    // 只有在分类数据加载完成后再获取商品数据
    if (!categoriesLoading && categories.length > 0) {
      fetchTabData(activeIndex);
    }
  }, [activeIndex, i18n.language, categoriesLoading, categories.length]);

  //useTitle('主页');
  
  // 显示分类加载状态
  // if (categoriesLoading) {
  //   return <LoadingView />;
  // }

  return (
    <div className={styles['pad-home']}>
      <div className={styles['main-content']}>
        {tabItems.length > 0 ? (
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
                      loading={loadingStates[0]}
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
                        loading={loadingStates[1]}
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
                        loading={loadingStates[2]}
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
                        loading={loadingStates[3]}
                      />
                    </div>
                  )}
                  {index >= 4 && (
                    <div
                      className={styles.contentWrapper}
                      style={{
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehavior: 'contain'
                      }}
                    >
                      <CouponContent
                        carouselItems={carouselItems}
                        products={[]}
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
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(HomePad)
