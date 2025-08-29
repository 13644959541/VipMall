import React, { useState, useMemo } from 'react';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import styles from './index.module.less';
import { useAuthModel } from '@/model/useAuthModel';

interface HomeContentProps {
  carouselItems: Array<{
    image: string;
    alt: string;
    fallback: React.ReactNode;
  }>;
  products: Array<{
    id: number;
    type: string;
    image: string;
    name: string;
    sales: number;
    description: string;
    points: number;
    originalPrice: number;
    memberLevel: string;
    isAvailable: boolean;
    remainingStock?: number;
  }>;
  productName: string;
  checkboxName: string;
}

const HomeContent: React.FC<HomeContentProps> = ({ carouselItems, products, productName, checkboxName }) => {
  const [showRedeemableOnly, setShowRedeemableOnly] = useState(false);
  const { user } = useAuthModel()
  const currentUserLevel = parseInt(user?.localLevel || "1")

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    // 如果"我可兑"复选框选中，进行积分和会员等级筛选
    if (showRedeemableOnly) {
      return products.filter(product => {
        const userPoints = user?.points || 0;
        const memberLevel = parseInt(product.memberLevel || "1");
        return userPoints >= product.points && 
              currentUserLevel >= memberLevel &&
              product.isAvailable !== false &&
              // 只有礼品类型才检查库存
              (product.type !== "gift" || (product.remainingStock !== undefined && product.remainingStock > 0))

      });
    }

    return products;
  }, [products, showRedeemableOnly, currentUserLevel, user?.points]);

  return (
    <div className={styles.contentWrapper}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}>
      <Carousel
        items={carouselItems}
        height={300}
      />

      <div className="flex items-center justify-between mr-1">
        <h2 className="font-bold ml-1.5 mr-1.5">{productName}</h2>
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
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(HomeContent);
