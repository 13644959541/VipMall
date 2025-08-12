import React from 'react';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import styles from './index.module.less';

interface MealContentProps {
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

const MealContent: React.FC<MealContentProps> = ({products, productName, checkboxName }) => {
  return (
    <div className={styles.contentWrapper}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}>

      <div className="flex items-center justify-between mr-1">
        <h2 className="font-bold">{productName}</h2>
        <div className="flex items-center">
          <Checkbox className="text-gray-500">{checkboxName}</Checkbox>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {products.map(product => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(MealContent);
