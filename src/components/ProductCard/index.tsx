import type React from "react"
import { Card, Image as AntdImage } from "antd-mobile"
import { Link, useNavigate } from "react-router-dom"
import { useAuthModel } from "@/model/useAuthModel"
import styles from './index.module.less'
import { useTranslation } from "react-i18next"
import { Product } from '../../services/productService';



interface  ProductCardProps extends Product {
  disabled?: boolean
  onClick?: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({
  disabled,
  onClick,
  ...product
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');


  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    } else {
      // 直接通过URL参数控制导航栏状态
      e.preventDefault()
      navigate(`/product/${product.productId}`, {
        state: {
          disabled,
          product: {...product}
        }
      })
    }
  }
  // 判断是否显示库存信息，仅在类型为"gift"且剩余库存不为undefined时显示
  const showStock = product.productType === 0 && product.stockQuantity !== undefined && !product.exchangeTimeRange && !product.exclusionText
  return (
    <Link to={`/product/${product.productId}`} onClick={handleClick}>
      <Card
        className={`rounded-md shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow ${disabled ? "opacity-50" : ""}`}
      >
        <div className="flex">
          <div className="w-12 h-11">
            <AntdImage src={product.mainImage || '/default.jpg'} alt={product.productName} width="100%" height="100%" fit="cover" className="rounded-sm" />
          </div>
          <div className="flex-1 min-w-0 ml-1">
            <span className="text-[14px] font-black line-clamp-2 h-[60px] text-gray-900" title={product.productName}>
              {product.productName}
            </span>
            <span className="text-[14px] text-gray-500 truncate mt-1">
              {t('productDetail.itemsRedeemed')}{product.salesCount}
              {product.salesCount || 0 <= 1 
                ? t('productDetail.countType') 
                : t('productDetail.countsType')
              }
            </span>
            <div className="text-[14px] space-y-1 mt-1">
              {showStock && <span className="text-[#6F6F72] block truncate">
                {t('productDetail.itemsRemaining')}: {product.stockQuantity}
                  {product.stockQuantity || 0 <= 1 
                ? t('productDetail.countType') 
                : t('productDetail.countsType')
              }
                </span>}
                {product.exchangeTimeRange && (
                  product.isExpired === 1 ? (
                    <span className="text-[#E60012] block truncate" title={product.exchangeTimeRange}>
                      [{t('productDetail.notYetAvailable')}] {product.exchangeTimeRange}
                    </span>
                  ) : (
                    <span className="block text-[#6F6F72] truncate" title={product.exchangeTimeRange}>
                      [{t('productDetail.redeemableTime')}] {product.exchangeTimeRange}
                    </span>
                  )
                )}
              {product.exclusionText ? (
                <span className="text-[#E60012] block truncate" title={product.exclusionText}>
                  * {product.exclusionText}
                </span>
              ) : (
                <span className="text-transparent">*</span>
              )}
            </div>
            <div className="flex items-center mt-0.5">
              <div className="flex items-center text-orange-500 mr-1">
                <img src="/star.svg" className="h-2 w-2 mr-0.5" alt="star" />
                <div className={`${styles['point']} mr-2`}>{product.pointsRequired}</div>
                <div className={`${styles['originalPrice']} mr-2`}>¥{product.originalPrice}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ProductCard
