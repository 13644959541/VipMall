import React, { useState, useMemo } from 'react';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import styles from './index.module.less';
import { useAuthModel } from '@/model/useAuthModel';
import { Product } from '@/services/productService';
import { NativeBridge } from '@/utils/bridge';
import { getCartDetails } from '@/services/cartSerivce';
import { useCartStore } from '@/store/cart';

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
}

const HomeContent: React.FC<HomeContentProps> = ({ carouselItems, products, productName, checkboxName }) => {
  const [showRedeemableOnly, setShowRedeemableOnly] = useState(false);
  const { user } = useAuthModel()
  const currentUserLevel = user?.localLevel || "1"

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    // 先筛选
    let result = [...products];
     const userPoints = user?.points || 0;
    // 如果"我可兑"复选框选中，进行积分和会员等级筛选
    if (showRedeemableOnly) {
      result = result.filter(product => {
          return userPoints >= Number(product.pointsRequired) &&
          product.membershipLevel?.includes(currentUserLevel) &&
          product.isExpired !== 1 &&
          // 只有礼品类型才检查库存
          (product.productType == 0 || (product.stockQuantity !== undefined && product.stockQuantity > 0))
      });
    }

    // 计算每个商品的禁用状态
    const productsWithDisabled = result.map(product => {
      //isExpired 0 true, 1 false
      const disabled = !!product.isExpired ||
      (!product.membershipLevel?.includes(currentUserLevel) || userPoints < Number(product.pointsRequired))
      || (product.productType == 0 && product.stockQuantity !== undefined && product.stockQuantity <= 0);

      return {
        ...product,
        disabled: !!disabled // 确保是boolean类型
      };
    });
    return [...productsWithDisabled];
  }, [products, showRedeemableOnly, currentUserLevel, user?.points]);

  return (
    <div className={styles.contentWrapper}>
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
