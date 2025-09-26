import { BrowserRouter as Router } from 'react-router-dom';
import RouteRender from '@/routers/RouteRender';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { initializeAuth, onAuthInitialized, useAuthModel } from '@/model/useAuthModel';
import { getCartDetails } from './services/cartSerivce';
import { useCartStore } from './store/cart';
import { useEffect } from 'react';

// 初始化FontAwesome
library.add(fas, far);


const App = () => {
  initializeAuth();
  useEffect(() => {
    const initializeCart = async () => {
      try {
        const hasInitialized = sessionStorage.getItem('cart-storage');
        if (hasInitialized) {
          return;
        }
        await new Promise<void>((resolve) => {
          onAuthInitialized(resolve);
        });

        const { user } = useAuthModel.getState();
        if (!user) {
          console.error('用户信息未获取到，无法获取购物车数据');
          return;
        }

        const currentLanguage = localStorage.getItem('i18nextLng') || 'zh-CN';
        const cartData = await getCartDetails({
          memberId: user.customerKey,
          countryCode: user.country,
          language: currentLanguage,
          storeId: user.shopNo,
          localLevel: user.localLevel
        });

        if (cartData && cartData.length > 0) {
          const cartStore = useCartStore.getState();
          if (cartStore.items.length === 0) {
            cartStore.clearCart();
            cartData.forEach(item => {
              cartStore.addItem({
                productId: item.productId,
                productName: item.productName,
                productType: item.productType,
                unitPoints: item.unitPoints,
                productPrice: item.productPrice,
                productImage: item.productImage,
                categoryId: item.categoryId,
                categoryType: item.categoryType,
                exclusionText: item.exclusionText,
                quantity: item.quantity,
                isSelected: item.isSelected,
                useBaseLanguage: item.useBaseLanguage,
                templateId: item.templateId,
                productCode: item.productCode,
                applicableStores: item.applicableStores,
                couponType: item.couponType,
                totalExchangeCount: item.totalExchangeCount,
                productStatus: item.productStatus,
                isInExchangeTime: item.isInExchangeTime,
                remainingStock: item.remainingStock
              }, true);
            });
          } else {
            console.log('本地购物车已有数据，跳过初始化');
          }
        } else {
          console.log('购物车数据为空或未获取到商品');
        }
      } catch (error) {
        console.error('获取购物车数据失败:', error);
      }
    };

    initializeCart();
  }, []);
  return (
    <>
      <Router>
        <RouteRender />
      </Router>
    </>
  );
};
export default App;
