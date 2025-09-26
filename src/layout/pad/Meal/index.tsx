import React, { useState, useMemo, useRef, useEffect } from 'react';
import DropdownSort from '@/components/Select';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import styles from './index.module.less';
import { useAuthModel } from '@/model/useAuthModel';
import { useTranslation } from 'react-i18next';
import Sort from '@/components/Sort';
import { Product } from '../../../services/productService';
import { getScrollPosition } from '@/utils/scrollStorage';
interface MealContentProps {
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

const MealContent: React.FC<MealContentProps> = ({ products, sortOptions, checkboxName, activeIndex,tabIndex, onScroll }) => {
  const [level, setLevel] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');
  const [showRedeemableOnly, setShowRedeemableOnly] = useState(false);
  const { user } = useAuthModel()
  const currentUserLevel = user?.localLevel || "1"
  const { t } = useTranslation('common');
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    
    // 先筛选
    let result = [...products];
    
    // 先按会员等级筛选
    if (level && level !== "0") {
      result = result.filter(product => {
        if (product.membershipLevel === undefined) return false;
         return product.membershipLevel.includes(level);
      });
    }
    const userPoints = user?.Points || 0;
    // 如果"我可兑"复选框选中，再进行积分和会员等级筛选
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
      // Meal类型：只看isExpired
     const disabled = !!product.isExpired ||
        // 检查商品是否支持筛选等级或当前用户等级
        (level && level !== "0" && !product.membershipLevel?.includes(level)) ||
        (!product.membershipLevel?.includes(currentUserLevel) || 
        userPoints < Number(product.pointsRequired))||
         //只有周边礼品（productType=0）才检查库存
        (product.productType === 0 && product.stockQuantity !== undefined && product.stockQuantity <= 0);
      return {
        ...product,
        disabled: !!disabled // 确保是boolean类型
      };
    });

    // 排序 - 先将禁用的商品放在后面
    let sortedProducts = [...productsWithDisabled];
    
    // 按禁用状态排序（不禁用的在前，禁用的在后）
    sortedProducts.sort((a, b) => {
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      return 0;
    });

    // 然后按指定字段排序
    const [field, order] = sortOption.split('-');
    if (field !== 'default') {
      sortedProducts.sort((a, b) => {
        // 保持禁用商品在后面的顺序
        if (a.disabled && !b.disabled) return 1;
        if (!a.disabled && b.disabled) return -1;
        
        // 两个商品都不禁用，按指定字段排序
        if (field === 'points') {
          return order === 'asc' ? parseInt(a.pointsRequired || "0")- parseInt(b.pointsRequired || "0")  : parseInt(b.pointsRequired || "0")- parseInt(a.pointsRequired || "0");
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

export default React.memo(MealContent);
