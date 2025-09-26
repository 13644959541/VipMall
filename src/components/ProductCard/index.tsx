import type React from "react"
import { Card, Image as AntdImage } from "antd-mobile"
import { Link, useNavigate } from "react-router-dom"
import { useAuthModel } from "@/model/useAuthModel"
import styles from './index.module.less'
import { useTranslation } from "react-i18next"
import { Product } from '../../services/productService';
import { saveScrollPosition } from '@/utils/scrollStorage';
import { getCurrencySymbol } from '@/utils/currencySymbols';
import { formatNumberWithCommas } from "@/utils"
interface ProductCardProps extends Product {
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
  const { user } = useAuthModel();
  const currencySymbol = getCurrencySymbol(user?.country || 'CN');
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    } else {
      // 在跳转到详情页前立即保存当前滚动位置
      const scrollContainer = document.querySelector('[class*="contentWrapper"]');
      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        if (scrollTop > 0) {
          saveScrollPosition(scrollTop);
        }
      }
      e.preventDefault()
      navigate(`/product/${product.productId}`, {
        state: {
          disabled,
          product: { ...product }
        }
      })
    }
  }
  // 判断是否显示库存信息，仅在类型为"gift"且剩余库存不为undefined时显示
  return (
    <Link to={`/product/${product.productId}`} onClick={handleClick}>
      <Card
        className="rounded-[16px] shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex">
          <div className="w-[158px] h-[133px]">
            <AntdImage
              src={product.mainImage || '/default.jpg'}
              alt={product.productName}
              width="100%"
              height="100%"
              fit="cover"
              className={`rounded-[16px] ${disabled ? "!opacity-50" : ""}`}
            />
          </div>
          <div className="flex-1 min-w-0 ml-1 relative" style={{ minHeight: '133px' }}>
            {/* 上面的内容区域 */}
            <div className={disabled ? "!opacity-50" : ""}>
              <span className="text-[14px] font-[590] line-clamp-2 text-[#101820]" title={product.productName}>
                {product.productName}
              </span>

              <span className="text-[12px] whitespace-normal min-h-[18px] text-[#6F6F72] block">
                {product.salesCount !== null && product.salesCount !== undefined && (
                  <>
                    {t('productDetail.itemsRedeemed')}&nbsp;{product.salesCount}&nbsp;
                    {product.salesCount <= 1
                      ? t('productDetail.countType')
                      : t('productDetail.countsType')
                    }
                  </>
                )}
              </span>

              {/* 信息区域 */}
              <div className="text-[12px]">
                {/* 库存信息 - 添加透明度控制 */}
                {product.stockQuantity != null &&
                  !(product.exchangeTimeRange && product.exclusionText) && (
                    <div className="min-h-[18px]">
                      <div className={`text-[#6F6F72] line-clamp-2 whitespace-normal ${disabled ? "!opacity-50" : ""}`}>
                        {t('productDetail.itemsRemaining')}&nbsp;{product.stockQuantity}&nbsp;
                        {product.stockQuantity <= 1
                          ? t('productDetail.countType')
                          : t('productDetail.countsType')
                        }
                      </div>
                    </div>
                )}
              </div>
            </div>
            {/* 兑换时间范围 - 不加透明度 */}
            {product.exchangeTimeRange && (
              <div className="min-h-[18px]">
                {product.isExpired === true ? (
                  <div className="text-[#E60012] whitespace-normal line-clamp-2" title={product.exchangeTimeRange}>
                    [{t('productDetail.redeemableTime')}] {product.exchangeTimeRange}
                  </div>
                ) : (
                 <div className={`text-[#6F6F72] whitespace-normal line-clamp-2 
                     ${disabled ? "!opacity-50" : ""}`} 
                      title={product.exchangeTimeRange}>
                    [{t('productDetail.redeemableTime')}] {product.exchangeTimeRange}
                  </div>
                )}
              </div>
            )}
            {/* 价格和积分信息 */}
            <div className="absolute bottom-0 left-0 right-0">
              {/* 互斥文案 - 添加透明度控制 */}
              {product.exclusionText && (
                <div className={`text-[#E60012] text-[12px] whitespace-normal mb-[2.5px] ${disabled ? "!opacity-50" : ""}`} 
                    title={product.exclusionText}>
                  * {product.exclusionText}
                </div>
              )}
              {/* 积分和价格区域 - 加透明度 */}
              <div className={`flex items-center text-orange-500 ${disabled ? "!opacity-50" : ""}`}>
                <img src="/star.svg" className="h-[20px] w-[20px] mr-0.5" alt="star" />
                <div className={`${styles['point']} mr-1`}>{formatNumberWithCommas(Number(product.pointsRequired))}</div>
                {product.originalPrice !== 0 && product.originalPrice !== null && (
                  <div className={`${styles['originalPrice']}`}>{currencySymbol}{product.originalPrice}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ProductCard
