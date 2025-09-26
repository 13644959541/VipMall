import React, { useState, useMemo, useRef, useEffect } from 'react';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import styles from './index.module.less';
import { useAuthModel } from '@/model/useAuthModel';
import { Product } from '@/services/productService';
import { getScrollPosition } from '@/utils/scrollStorage';


interface HomeContentProps {
  carouselItems: Array<{
    image: string;
    alt: string;
    fallback: React.ReactNode;
  }>;
  products: Array<Product>;
  productName: string;
  checkboxName: string;
  loading?: boolean;
  activeIndex: number;
  tabIndex: number;
  onScroll: (scrollTop: number) => void;
}

const HomeContent: React.FC<HomeContentProps> = ({ carouselItems, products, productName, checkboxName, activeIndex,tabIndex, onScroll }) => {
  const [showRedeemableOnly, setShowRedeemableOnly] = useState(false);
  const { user } = useAuthModel()
  const currentUserLevel = user?.localLevel || "1"
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    // 先筛选
    let result = [...products];
    const userPoints = user?.Points || 0;
    // 如果"我可兑"复选框选中，进行积分和会员等级筛选
   if (showRedeemableOnly) {
        result = result.filter(product => {
        // 只有周边礼品（productType=0）才检查库存
        const isOutOfStock = product.productType === 0 && 
                            product.stockQuantity !== undefined && 
                            product.stockQuantity <= 0;
        
        // 排除库存为0的周边礼品，其他商品正常检查
        return userPoints >= parseInt(product.pointsRequired || "0") &&
          product.membershipLevel?.includes(currentUserLevel) &&
          product.isExpired !== true &&
          !isOutOfStock;
      });
    }


    // 计算每个商品的禁用状态
    const productsWithDisabled = result.map(product => {
      const disabled = !!product.isExpired ||
      (!product.membershipLevel?.includes(currentUserLevel) || userPoints < Number(product.pointsRequired))
      || (product.productType == 0 && product.stockQuantity !== undefined && product.stockQuantity <= 0);
      
      return {
        ...product,
        disabled: !!disabled // 确保是boolean类型
      };
    });
    return [...productsWithDisabled];
  }, [products, showRedeemableOnly, currentUserLevel, user?.Points]);

  // 保存滚动位置
  useEffect(() => {
    const scrollContainer = contentRef.current;
    if (!scrollContainer) return;

    // 防抖函数
    const debounce = (func: Function, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    };

    // 保存滚动位置的函数（防抖处理）
    const handleScrollSave = debounce(() => {
      // 只有当当前组件是激活的tab并且scrollContainer仍然在DOM中时才保存位置
      if (activeIndex === tabIndex && scrollContainer && document.contains(scrollContainer)) {
        onScroll(scrollContainer.scrollTop);
      }
    }, 200);
    // 添加滚动事件监听
    scrollContainer.addEventListener('scroll', handleScrollSave);
    // 组件卸载时只移除事件监听，不保存位置
    return () => {
      scrollContainer.removeEventListener('scroll', handleScrollSave);
    };
  }, [activeIndex, onScroll]);

  // 恢复滚动位置 - 在products数据加载完成后执行
  useEffect(() => {
    const scrollContainer = contentRef.current;
    if (!scrollContainer || !products || products.length === 0) return;

    const savedScrollTop = getScrollPosition();
    if (savedScrollTop && savedScrollTop > 0) {
      // 确保内容已经渲染
      setTimeout(() => {
        if (scrollContainer.scrollHeight > savedScrollTop) {
          scrollContainer.scrollTop = savedScrollTop;
        }
      }, 200);
    }
  }, [products]); // 依赖products数据

  return (
    <div ref={contentRef} className={styles.contentWrapper} style={{ overflowX:'hidden', overflowY: 'auto', height: '100%' }}>
      <Carousel
        items={carouselItems}
        height={258}
      />

      <div className="flex items-center justify-between mr-1">
        <h2 className= {`${styles.title}`}>{productName}</h2>
        <div className="flex items-center gap-4">
          <Checkbox
            className={styles.check}
            checked={showRedeemableOnly}
            onChange={(checked) => setShowRedeemableOnly(checked)}
          >
            {checkboxName}
          </Checkbox>
        </div>
      </div>

      <div className={`${styles.grid} grid grid-cols-2`}>
        {filteredProducts.map(product => (
          <ProductCard
            key={product.productId}
            {...product}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(HomeContent);
