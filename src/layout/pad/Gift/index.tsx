import React from 'react';
import DropdownSort from '@/components/Select';
import ProductCard from '@/components/ProductCard';
import { Checkbox } from 'antd-mobile';
import styles from './index.module.less';

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
  }>;
  productName: string;
  checkboxName: string;
  sortOptions: Array<{
    label: string;
    value: string;
  }>;
}

const GiftContent: React.FC<GiftContentProps> = ({ products, sortOptions, checkboxName }) => {
  const [sortOption, setSortOption] = useState<string>('default');

  const sortedProducts = useMemo(() => {
    if (!products) return [];

    const [field, order] = sortOption.split('-');
    if (field === 'default') return products;

    return [...products].sort((a, b) => {
      if (field === 'score') {
        return order === 'asc'
          ? a.points - b.points
          : b.points - a.points;
      } else if (field === 'sales') {
        return order === 'asc'
          ? (a.sales || 0) - (b.sales || 0)
          : (b.sales || 0) - (a.sales || 0);
      }
      return 0;
    });
  }, [products, sortOption]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
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
          title="推荐"
          defaultLabel="默认排序"
          onChange={handleSortChange}
        />
        <div className="flex items-center gap-4">
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

export default React.memo(GiftContent);
