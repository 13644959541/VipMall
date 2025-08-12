import React from 'react';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import DropdownSort from '@/components/Select';
import styles from './index.module.less';

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
    originalPrice: number;
  }>;
  productName: string;
  checkboxName: string;
}
const sortOptions = [
  { label: "积分从低到高", value: "score-asc" },
  { label: "积分从高到低", value: "score-desc" },
  { label: "销量从低到高", value: "sales-asc" }, 
  { label: "销量从高到低", value: "sales-desc" }
];
const CouponContent: React.FC<CouponContentProps> = ({ products, checkboxName }) => {
  return (
    <div className={styles.contentWrapper}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}>
      <div className="flex items-center justify-between ml-1 mr-1">
        <DropdownSort options={sortOptions} title="推荐" defaultLabel="默认排序"/>
        <div className="flex items-center gap-4">
          <Checkbox className="text-gray-500">{checkboxName}</Checkbox>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {products.map(product => (
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
