import React from 'react';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import styles from './index.module.less';

interface VouchersContentProps {
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

const VouchersContent: React.FC<VouchersContentProps> = ({products, productName, checkboxName }) => {
  return (
    <div className={styles.contentWrapper}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}>

      <div className="flex items-center justify-between mr-1">
        {/* 用ant-mobile生成一个dropdown下拉菜单 */}

        <div className="flex items-center gap-4">
          <Checkbox className="text-gray-500">{checkboxName}</Checkbox>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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

export default React.memo(VouchersContent);
