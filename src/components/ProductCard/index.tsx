import type React from "react"
import { Card, Image as AntdImage } from "antd-mobile"
import { Star } from "lucide-react"
import { Link } from "react-router-dom"

type ProductType = "coupon" | "product" | "meal" | "gift"

interface ProductCardProps {
  type?: ProductType
  image: string
  name: string
  description: string
  points: number
  sales?: number
  originalPrice: number
  redeemPeriod?: string
  conflictRule?: string
  remainingStock?: number
  isAvailable?: boolean
  isRedeemable?: boolean
  level?: number
  onClick?: () => void
  onRedeem?: () => void
  productId?: number | string
}

const ProductCard: React.FC<ProductCardProps> = ({
  type,
  image,
  name,
  description,
  points,
  originalPrice,
  redeemPeriod,
  conflictRule,
  remainingStock,
  isAvailable = true,
  isRedeemable = true,
  sales,
  level,
  onClick,
  onRedeem,
  productId = 1,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    console.log("ProductCard clicked, productId:", productId)
    
    if (onClick) {
      e.preventDefault()
      onClick()
    }
    // 导航由Link组件自动处理
    console.log("Navigating to:", `/product/${productId}`)
  }

  const disabled = !isAvailable || (redeemPeriod && !isRedeemable)
  const showStock = type === "gift" && remainingStock !== undefined && !redeemPeriod && !conflictRule

  return (
    <Link to={`/product/${productId}`} onClick={handleClick}>
      <Card
        className={`rounded-md shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow ${disabled ? "opacity-50" : ""}`}
      >
      <div className="flex">
        <div className="w-12 h-12">
          <AntdImage src={image} alt={name} width="100%" height="100%" fit="cover" className="rounded-sm" />
        </div>
        <div className="flex-1 min-w-0 ml-1">
          <span className="text-xxs font-black line-clamp-2 h-[50px] text-gray-900" title={name}>
            {name}
          </span>
          <span className="text-xxxs text-gray-500 truncate mt-1" title={description}>
            {description}
          </span>
          <div className="text-xxxs h-[80px] space-y-1 mt-1">
            {showStock && <span className="text-gray-400 block truncate">剩余: {remainingStock}件</span>}
            {redeemPeriod ? (
              <span className="text-red-500 block truncate" title={redeemPeriod}>
                * {redeemPeriod}
              </span>
            ) : (
              <span className="text-transparent">*</span>
            )}
            {type !== "product" && conflictRule ? (
              <span className="text-red-500 block truncate" title={conflictRule}>
                * {conflictRule}
              </span>
            ) : (
              <span className="text-transparent">*</span>
            )}
          </div>
          <div className="flex items-center mt-0.5">
            <div className="flex items-center text-orange-500 mr-1">
              <Star className="h-1 w-1 fill-orange-500 text-orange-500 mr-0.5" />
              <span className="text-xxxs">{points.toLocaleString()}</span>
            </div>
            <span className="text-xxxs text-gray-400 line-through">¥{originalPrice}</span>
          </div>
        </div>
      </div>
      </Card>
    </Link>
  )
}

export default ProductCard
