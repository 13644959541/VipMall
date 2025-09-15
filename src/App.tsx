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
  // 在应用启动时初始化用户信息
  initializeAuth();
  
  // 页面初始化时获取购物车数据并更新本地缓存（等待认证完成）
  useEffect(() => {
    const initializeCart = async () => {
      try {
        console.log('开始初始化购物车...');
        
        // 检查是否已经初始化过
        const hasInitialized = sessionStorage.getItem('cart-storage');
        if (hasInitialized) {
          console.log('购物车已初始化过，跳过');
          return;
        }
        
        // 等待认证初始化完成
        console.log('等待认证初始化完成...');
        await new Promise<void>((resolve) => {
          onAuthInitialized(resolve);
        });
        console.log('认证初始化完成');
        
        // 获取用户信息 - 使用认证模型中的用户信息
        const { user } = useAuthModel.getState();
        if (!user) {
          console.error('用户信息未获取到，无法获取购物车数据');
          return;
        }
        
        console.log('获取到的用户信息:', user);
        
        // 获取当前语言
        const currentLanguage = localStorage.getItem('i18nextLng') || 'zh-CN';
        
        // 调用获取购物车详情API
        console.log('调用获取购物车详情API...');
        const cartData = await getCartDetails({
          memberId: user.customerKey,
          countryCode: user.remoteCountry,
          language: currentLanguage,
          storeId: user.shopNo,
          localLevel: user.localLevel
        });
        
        console.log('获取到的购物车数据:', cartData);
        console.log('购物车数据长度:', cartData?.length);
        
        // 将服务器数据更新到本地购物车缓存
        if (cartData && cartData.length > 0) {
          console.log('开始更新本地购物车缓存...');
          const cartStore = useCartStore.getState();
          
          // 只在购物车为空时初始化
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
                useBaseLanguage:item.useBaseLanguage,
                templateId:item.templateId,
                productCode:item.productCode,
                applicableStores:item.applicableStores,
                couponType:item.couponType
              }, true); // 强制添加，跳过冲突检查
            });
            
            console.log('购物车数据更新完成，共添加', cartData.length, '个商品');
            // 标记已初始化
            //sessionStorage.setItem('cart-storage', 'initialized');
          } else {
            console.log('本地购物车已有数据，跳过初始化');
          }
        } else {
          console.log('购物车数据为空或未获取到商品');
        }
        
      } catch (error) {
        console.error('获取购物车数据失败:', error);
        // 更详细的错误信息
        if (error instanceof Error) {
          console.error('错误详情:', error.message);
          console.error('错误堆栈:', error.stack);
        }
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
