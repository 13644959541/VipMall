import type React from "react"
import { Card, Image as AntdImage } from "antd-mobile"
import { Link, useNavigate } from "react-router-dom"
import { useAuthModel } from "@/model/useAuthModel"
import styles from './index.module.less'
import { useTranslation } from "react-i18next"

type ProductType = "coupon" | "meal" | "gift" 

interface ProductCardProps {
  id: number 
  type: string;
  image: string
  name: string
  description: string
  points: number
  sales?: number
  originalPrice: number
  availableTime?: string
  conflictRule?: string
  remainingStock?: number
  isAvailable?: boolean
  disabled?: boolean
  memberLevel?: string
  onClick?: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  type,
  image,
  name,
  description,
  points,
  originalPrice,
  availableTime,
  conflictRule,
  remainingStock,
  isAvailable,
  sales,
  memberLevel,
  disabled,
  onClick,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');


  const handleClick = (e: React.MouseEvent) => {
    console.log("ProductCard clicked, productId:", id)

    if (onClick) {
      e.preventDefault()
      onClick()
    } else {
      // 直接通过URL参数控制导航栏状态
      e.preventDefault()
      navigate(`/product/${id}`, {
        state: {
          product: {
            id,
            name,
            description,
            points,
            originalPrice,
            image,
            sales,
            availableTime,
            conflictRule,
            remainingStock,
            isAvailable,
            memberLevel,
            type,
            disabled
          }
        }
      })
    }
  }

  // 判断是否显示库存信息，仅在类型为"gift"且剩余库存不为undefined时显示
  const showStock = type === "gift" && remainingStock !== undefined && !availableTime && !conflictRule

  return (
    <Link to={`/product/${id}`} onClick={handleClick}>
      <Card
        className={`rounded-md shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow ${disabled ? "opacity-50" : ""}`}
      >
        <div className="flex">
          <div className="w-12 h-12">
            <AntdImage src={image} alt={name} width="100%" height="100%" fit="cover" className="rounded-sm" />
          </div>
          <div className="flex-1 min-w-0 ml-1">
            <span className="text-[14px] font-black line-clamp-2 h-[60px] text-gray-900" title={name}>
              {name}
            </span>
            <span className="text-[14px] text-gray-500 truncate mt-1" title={description}>
              {description}
            </span>
            <div className="text-[14px] h-[80px] space-y-1 mt-1">
              {showStock && <span className="text-gray-400 block truncate">{t('productDetail.itemsRemaining')}: {remainingStock}件</span>}
              {availableTime ? (
                <span className="text-[#E60012] block truncate" title={availableTime}>
                  {availableTime}
                </span>
              ) : (
                <span className="text-transparent">*</span>
              )}
              {conflictRule ? (
                <span className="text-[#E60012] block truncate" title={conflictRule}>
                  * {conflictRule}
                </span>
              ) : (
                <span className="text-transparent">*</span>
              )}
            </div>
            <div className="flex items-center mt-0.5">
              <div className="flex items-center text-orange-500 mr-1">
                <img src="/star.svg" className="h-2 w-2 mr-0.5" alt="star" />
                <div className={`${styles['point']} mr-2`}>{points}</div>
                <div className={`${styles['originalPrice']} mr-2`}>¥{originalPrice}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ProductCard
