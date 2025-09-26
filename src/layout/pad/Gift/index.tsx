import React, { useState, useMemo, useRef, useEffect } from 'react';
import DropdownSort from '@/components/Select';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import styles from './index.module.less';
import { useAuthModel } from '@/model/useAuthModel';
import Sort from '@/components/Sort';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../services/productService';
import { getScrollPosition } from '@/utils/scrollStorage';
interface GiftContentProps {
  carouselItems: Array<{
    image: string;
    alt: string;
    fallback: React.ReactNode;
  }>;
  products: Array<Product>;
  productName: string;
  checkboxName: string;
  sortOptions: Array<{
    label: string;
    value: string;
  }>;
  loading?: boolean;
  activeIndex: number;
  tabIndex: number;
  onScroll: (scrollTop: number) => void;
}

const GiftContent: React.FC<GiftContentProps> = ({ products, sortOptions, checkboxName, activeIndex,tabIndex, onScroll }) => {
  const [level, setLevel] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');
  const [showRedeemableOnly, setShowRedeemableOnly] = useState(false);
  const { user } = useAuthModel()
  const currentUserLevel = user?.localLevel || "1"
  const { t } = useTranslation('common');
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    if (level && level !== "0") {
      result = result.filter(product => {
        if (product.membershipLevel === undefined) return false;
        return product.membershipLevel.includes(level);
      });
    }
    
    const userPoints = user?.Points || 0;
     if (showRedeemableOnly) {
        result = result.filter(product => {
        const isOutOfStock = product.stockQuantity !== undefined && 
                            product.stockQuantity <= 0;
        
        return userPoints >= parseInt(product.pointsRequired || "0") &&
          product.membershipLevel?.includes(currentUserLevel) &&
          product.isExpired !== true &&
          !isOutOfStock;
      });
    }

    const productsWithDisabled = result.map(product => {
     const disabled = !!product.isExpired ||
        (level && level !== "0" && !product.membershipLevel?.includes(level)) ||
        (!product.membershipLevel?.includes(currentUserLevel)) ||
        userPoints < Number(product.pointsRequired) ||
        ( product.stockQuantity !== undefined && product.stockQuantity <= 0);
      return {
        ...product,
        disabled: !!disabled 
      };
    });

    let sortedProducts = [...productsWithDisabled];

    sortedProducts.sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return 0;
    });

    const [field, order] = sortOption.split('-');
    if (field !== 'default') {
      sortedProducts.sort((a, b) => {
        if (a.disabled && !b.disabled) return 1;
        if (!a.disabled && b.disabled) return -1;

        if (field === 'points') {
          return order === 'asc' ? parseInt(a.pointsRequired || "0") - parseInt(b.pointsRequired || "0") : parseInt(b.pointsRequired || "0") - parseInt(a.pointsRequired || "0");
        } else if (field === 'sales') {
          return order === 'asc'
            ? (a.salesCount || 0) - (b.salesCount || 0)
            : (b.salesCount || 0) - (a.salesCount || 0);
        }
        return 0;
      });
    }

    return sortedProducts;
  }, [products, level, sortOption, currentUserLevel, showRedeemableOnly, user?.Points]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const handleLevelChange = (value: string) => {
    setLevel(value);
  };

  useEffect(() => {
    const scrollContainer = contentRef.current;
    if (!scrollContainer) return;

    const debounce = (func: Function, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    };

    const handleScrollSave = debounce(() => {
      if (activeIndex === tabIndex && 
          scrollContainer && 
          document.contains(scrollContainer) &&
          scrollContainer.offsetParent !== null &&
          scrollContainer.scrollTop > 0) {
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

    // 恢复滚动位置 - 使用更智能的恢复逻辑
    useEffect(() => {
      const scrollContainer = contentRef.current;
      if (!scrollContainer) return;

      const savedScrollTop = getScrollPosition();
      if (savedScrollTop && savedScrollTop > 0) {
        // 使用轮询方式等待数据加载完成
        const checkInterval = setInterval(() => {
          if (products && products.length > 0 && scrollContainer.scrollHeight > savedScrollTop) {
            clearInterval(checkInterval);
            scrollContainer.scrollTop = savedScrollTop;
          }
        }, 100);

        // 10秒后超时
        setTimeout(() => clearInterval(checkInterval), 10000);
      }
    }, [products]); // 仍然依赖products，但使用更智能的恢复方式



  return (
    <div ref={contentRef} className={styles.contentWrapper}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        overflowY: 'auto',
        height: '100%'
      }}>
      <div className="flex items-center justify-between ml-1 mr-1">
        <div className="flex items-center gap-1">
          <DropdownSort
            options={sortOptions}
            onChange={handleLevelChange}
            defaultLabel={t("product.memberZone")}
          />
          <Sort
            defaultLabel={t("product.defaultSort")}
            pointsLabel={t("product.requiredPoints")}
            salesLabel={t("product.sales")}
            onChange={handleSortChange}
          />
        </div>
        <Checkbox
          className={styles.check}
          checked={showRedeemableOnly}
          onChange={(checked) => setShowRedeemableOnly(checked)}
        >
          {checkboxName}
        </Checkbox>
      </div>
      <div className="grid grid-cols-2">
        {filteredAndSortedProducts.map(product => (
          <ProductCard
            key={product.productId}
            {...product}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(GiftContent);
