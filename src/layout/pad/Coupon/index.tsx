import React, { useState, useMemo, useRef, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import DropdownSort from '@/components/Select';
import styles from './index.module.less';
import Sort from '@/components/Sort';
import { useAuthModel } from '@/model/useAuthModel';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../services/productService';
import { getScrollPosition } from '@/utils/scrollStorage';
interface CouponContentProps {
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
const CouponContent: React.FC<CouponContentProps> = ({ products, checkboxName, sortOptions, activeIndex, tabIndex,onScroll }) => {
  const [level, setLevel] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');
  const [showRedeemableOnly, setShowRedeemableOnly] = useState(false);
  // 判断用户等级是否满足兑换条件
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
        const isOutOfStock = product.productType === 0 && 
                            product.stockQuantity !== undefined && 
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
        (product.productType === 0 && product.stockQuantity !== undefined && product.stockQuantity <= 0);
      return {
        ...product,
        disabled: !!disabled 
      };
    });

    const [field, order] = sortOption.split('-');
    let sortedProducts = [...productsWithDisabled];
    sortedProducts.sort((a, b) => {
      if (a.disabled && !b.disabled) return 1; 
      if (!a.disabled && b.disabled) return -1;
      return 0; // 禁用状态相同，保持原顺序
    });

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
      if (activeIndex === tabIndex && scrollContainer && document.contains(scrollContainer)) {
        onScroll(scrollContainer.scrollTop);
      }
    }, 200);
    scrollContainer.addEventListener('scroll', handleScrollSave);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScrollSave);
    };

  }, [activeIndex, onScroll]);

  useEffect(() => {
    const scrollContainer = contentRef.current;
    if (!scrollContainer || !products || products.length === 0) return;

    const savedScrollTop = getScrollPosition();
    if (savedScrollTop && savedScrollTop > 0) {
      setTimeout(() => {
        if (scrollContainer.scrollHeight > savedScrollTop) {
          scrollContainer.scrollTop = savedScrollTop;
        }
      }, 200);
    }
  }, [products]); // 依赖products数据

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

export default React.memo(CouponContent);
