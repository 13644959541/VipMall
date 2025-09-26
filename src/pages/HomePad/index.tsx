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
import { useAuthModel } from '@/model/useAuthModel';
import { saveActiveIndex, getActiveIndex, saveScrollPosition } from '@/utils/scrollStorage';

const HomePad = () => {
  const { t, i18n } = useTranslation('common'); 
  const { user } = useAuthModel();
  const [activeIndex, setActiveIndex] = useState(() => {
    return getActiveIndex();
  });
  const [hot, setHotProducts] = useState<Product[]>([]);
  const [tabProducts, setTabProducts] = useState<Record<number, Product[]>>({});
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [carouselItems, setCarouselItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [categoryIdStrings, setCategoryIdStrings] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [tabItems, setTabItems] = useState<{ key: string; title: string; categoryId: number; categoryType: number }[]>([]);

  const DEFAULT_BANNER = {
    image: "/hot-pot-banner.jpg",
    alt: "banner"
  };

  const setDefaultBanner = () => setCarouselItems([DEFAULT_BANNER]);

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

        const categoryIds = categoryData.map(category =>
          category.children?.map(child => child.categoryId).join(',') || ''
        );
        setCategoryIdStrings(categoryIds);

        const newTabItems = [
          {
            key: "1",
            title: t('home.home'),
            categoryId: -1,
            categoryType: -1
          },
          ...categoryData.map(category => ({
            key: `category-${category.categoryId}`,
            title: category.categoryName || '',
            categoryId: category.categoryId || 0,
            categoryType: category.categoryType || 0
          }))
        ];

        setTabItems(newTabItems);

      } catch (error) {
          Toast.show({
            content: t('modal.requestFailed'),
            position: 'center',
            duration: 3000
          })
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

  const sortOptions = [
    { label: t('product.all'), value: "0" },
    { label: t('product.redeemableForRedMembers'), value: "1" },
    { label: t('product.redeemableForSilverMembers'), value: "2" },
    { label: t('product.redeemableForGoldMembers'), value: "3" },
    { label: t('product.redeemableForPremiumMembers'), value: "4" }
  ]

  const fetchTabData = async (tabIndex: number) => {
    setLoadingStates(prev => ({ ...prev, [tabIndex]: true }));
    try {
      if (tabIndex === 0) {
        await fetchBanners();
        const hotProducts = await getHotList({
          terminalType: "PAD",
          language: i18n.language,
          storeId: user?.shopNo,
          localLevel: user?.localLevel,
          countryCode: user?.country
        });
        setHotProducts(hotProducts);
      } else {
        const categoryIds = categoryIdStrings[tabIndex - 1] || "";
        const productsData = await getProductList({
          categoryIds: categoryIds,
          language: i18n.language,
          storeId: user?.shopNo,
          localLevel: user?.localLevel,
          countryCode: user?.country
        });

        setTabProducts(prev => ({
          ...prev,
          [tabIndex]: productsData
        }));
      }
    } catch (err) {
      console.error(`获取tab ${tabIndex} 数据失败:`, err);
    } finally {
      setLoadingStates(prev => ({ ...prev, [tabIndex]: false }));
    }
  };

  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      fetchTabData(activeIndex);
    }
  }, [activeIndex, i18n.language, categoriesLoading, categories.length]);

  // 处理tab切换
  const handleTabChange = (index: number) => {
    saveActiveIndex(index);
    saveScrollPosition(0);
    setActiveIndex(index);
  };

  const handleScroll = (scrollTop: number) => {
    saveScrollPosition(scrollTop);
  };

  return (
    <div className={styles['pad-home']}>
      <div className={styles['main-content']}>
        {tabItems.length > 0 ? (
          <SwipeTabs
            activeIndex={activeIndex}
            setActiveIndex={handleTabChange}
            tabItems={tabItems}
          >
            {tabItems.map((item, index) => {
              return (
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
                          loading={loadingStates[index] || false}
                          activeIndex={activeIndex}
                          onScroll={handleScroll}
                          tabIndex={index}
                        />
                      </div>
                    )}
                    {index >= 1 && (
                      // 根据categoryType动态渲染对应组件
                      <div className={styles.contentWrapper}>
                        {item.categoryType === 0 && (
                          <GiftContent
                            carouselItems={carouselItems}
                            products={tabProducts[index] || []}
                            productName={i18nVars.productName}
                            checkboxName={i18nVars.checkboxName}
                            sortOptions={sortOptions}
                            loading={loadingStates[index] || false}
                            activeIndex={activeIndex}
                            onScroll={handleScroll}
                            tabIndex={index}
                          />
                        )}
                        {item.categoryType === 1 && (
                          <CouponContent
                            carouselItems={carouselItems}
                            products={tabProducts[index] || []}
                            productName={i18nVars.productName}
                            checkboxName={i18nVars.checkboxName}
                            sortOptions={sortOptions}
                            loading={loadingStates[index] || false}
                            activeIndex={activeIndex}
                            onScroll={handleScroll}
                            tabIndex={index}
                          />
                        )}
                        {item.categoryType === 2 && (
                          <MealContent
                            carouselItems={carouselItems}
                            products={tabProducts[index] || []}
                            productName={i18nVars.productName}
                            checkboxName={i18nVars.checkboxName}
                            sortOptions={sortOptions}
                            loading={loadingStates[index] || false}
                            activeIndex={activeIndex}
                            onScroll={handleScroll}
                            tabIndex={index}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </Swiper.Item>
              )
            })}
          </SwipeTabs>
        ) : (
          null
        )}
      </div>
    </div>
  )
}

export default memo(HomePad)
