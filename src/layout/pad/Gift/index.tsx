import React, { useState, useMemo } from 'react';
import DropdownSort from '@/components/Select';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import styles from './index.module.less';
import { useAuthModel } from '@/model/useAuthModel';
import Sort from '@/components/Sort';
import { useTranslation } from 'react-i18next';

interface GiftContentProps {
  carouselItems: Array<{
    image: string;
    alt: string;
    fallback: React.ReactNode;
  }>;
  products: Array<{
    id: number;
    image: string;
    name: string;
    description: string;
    points: number;
    sales: number;
    originalPrice: number;
    isAvailable: boolean;
    memberLevel: string;
    remainingStock?: number;
  }>;
  productName: string;
  checkboxName: string;
  sortOptions: Array<{
    label: string;
    value: string;
  }>;
}

const GiftContent: React.FC<GiftContentProps> = ({ products, sortOptions, checkboxName }) => {
  const [level, setLevel] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');
  const [showRedeemableOnly, setShowRedeemableOnly] = useState(false);
  const { user } = useAuthModel()
  const currentUserLevel = parseInt(user?.localLevel || "1")
  const { t } = useTranslation('common');
  
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    
    // 先筛选
    let result = [...products];
    
    // 先按会员等级筛选
    if (level && level !== 'all') {
      result = result.filter(product => {
        if (product.memberLevel === undefined) return false;
        return parseInt(product.memberLevel) <= parseInt(level);
      });
    }

    // 如果"我可兑"复选框选中，再进行积分和会员等级筛选
    if (showRedeemableOnly) {
      result = result.filter(product => {
        const userPoints = user?.points || 0;
        const memberLevel = parseInt(product.memberLevel || "1");
        return userPoints >= product.points && 
               currentUserLevel >= memberLevel &&
               product.isAvailable !== false &&
               (product.remainingStock === undefined || product.remainingStock > 0);
      });
    }

    // 计算每个商品的禁用状态
    const productsWithDisabled = result.map(product => {
      // Gift类型：看isAvailable和库存
      const disabled = !product.isAvailable || 
        (product.remainingStock !== undefined && product.remainingStock === 0) ||
        (level && level !== 'all' && currentUserLevel < parseInt(product.memberLevel));
      
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
          return order === 'asc' ? a.points - b.points : b.points - a.points;
        } else if (field === 'sales') {
          return order === 'asc' 
            ? (a.sales || 0) - (b.sales || 0) 
            : (b.sales || 0) - (a.sales || 0);
        }
        return 0;
      });
    }

    return sortedProducts;
  }, [products, level, sortOption, currentUserLevel, showRedeemableOnly, user?.points]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const handleLevelChange = (value: string) => {
    setLevel(value);
  };

  return (
    <div className={styles.contentWrapper}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}>

      <div className="flex items-center justify-between ml-1 mr-1">
        <DropdownSort
          options={sortOptions}
          onChange={handleLevelChange}
        />
         <Sort 
                  defaultLabel= {t("filter.default")}
                  pointsLabel= {t("product.requiredPoints")} 
                  salesLabel= {t("product.sales")} 
                  onChange={handleSortChange}
                />
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

      <div className="grid grid-cols-2">
        {filteredAndSortedProducts.map(product => (
          <ProductCard
            key={product.id}
            type='gift'
            {...product}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(GiftContent);
