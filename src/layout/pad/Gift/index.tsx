import React, { useState, useMemo } from 'react';
import DropdownSort from '@/components/Select';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import styles from './index.module.less';
import { useAuthModel } from '@/model/useAuthModel';
import Sort from '@/components/Sort';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../services/productService';
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
}

const GiftContent: React.FC<GiftContentProps> = ({ products, sortOptions, checkboxName }) => {
  const [level, setLevel] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');
  const [showRedeemableOnly, setShowRedeemableOnly] = useState(false);
  const { user } = useAuthModel()
  const currentUserLevel = user?.localLevel || "1"
  const { t } = useTranslation('common');

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    // 先筛选
    let result = [...products];

    // 先按会员等级筛选
    if (level && level !== 'all') {
      result = result.filter(product => {
        if (product.membershipLevel === undefined) return false;
        return parseInt(product.membershipLevel) <= parseInt(level);
      });
    }
    const userPoints = user?.points || 0;
    // 如果"我可兑"复选框选中，再进行积分和会员等级筛选
    if (showRedeemableOnly) {
      result = result.filter(product => {
        return userPoints >= parseInt(product.pointsRequired || "0") &&
          product.membershipLevel?.includes(currentUserLevel) &&
          product.isExpired !== 1 &&
          (product.stockQuantity === undefined || product.stockQuantity > 0);
      });
    }
    // 计算每个商品的禁用状态
    const productsWithDisabled = result.map(product => {
      // Gift类型：看isAvailable和库存
      const disabled = !!product.isExpired ||
        (product.stockQuantity !== undefined && product.stockQuantity === 0) ||
        (level && level !== 'all'
          && product.membershipLevel?.includes(currentUserLevel)
          || userPoints < Number(product.pointsRequired));
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
          defaultLabel={t("filter.default")}
          pointsLabel={t("product.requiredPoints")}
          salesLabel={t("product.sales")}
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
            key={product.productId}
            {...product}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(GiftContent);
