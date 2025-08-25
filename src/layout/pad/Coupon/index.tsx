import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import DropdownSort from '@/components/Select';
import styles from './index.module.less';
import Sort from '@/components/Sort';

interface CouponContentProps {
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
    memberLevel?: string;
  }>;
  productName: string;
  checkboxName: string;
  sortOptions: Array<{
    label: string;
    value: string;
  }>;
}
const CouponContent: React.FC<CouponContentProps> = ({ products, checkboxName, sortOptions }) => {
  const [memberLevel, setMemberLevel] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    
    // 先筛选
    let result = [...products];
    if (memberLevel && memberLevel !== 'all') {
      result = result.filter(product => product.memberLevel === memberLevel);
    }

    // 再排序
    const [field, order] = sortOption.split('-');
    if (field !== 'default') {
      result.sort((a, b) => {
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

    return result;
  }, [products, memberLevel, sortOption]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };
  const handleLevelChange = (value: string) => {
    setMemberLevel(value);
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
          defaultLabel="综合排序"
          pointsLabel="积分高低"
          salesLabel="销量优先"
          onChange={handleSortChange}
        />
        <Checkbox className={styles.check}>{checkboxName}</Checkbox>
      </div>

      <div className="grid grid-cols-2">
        {filteredAndSortedProducts.map(product => (
          <ProductCard
            type='coupon'
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(CouponContent);
