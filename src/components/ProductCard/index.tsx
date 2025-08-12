import React from 'react'
import { Card, Image as AntdImage } from 'antd-mobile'
import { Star } from 'lucide-react'

type ProductType = 'coupon' | 'product' | 'meal' | 'gift'

interface ProductCardProps {
  type?: ProductType
  image: string
  name: string
  description: string
  points: number
  originalPrice: number
  redeemPeriod?: string
  conflictRule?: string
  remainingStock?: number
  isAvailable?: boolean
  isRedeemable?: boolean
  level?: number
  onClick?: () => void
  onRedeem?: () => void
}



const ProductCard: React.FC<ProductCardProps> = ({
  type,
  image,
  name,
  description,
  points,
  originalPrice, // 兑换原价
  redeemPeriod, // 可兑换时间段
  conflictRule, // 兑换冲突规则
  remainingStock, // 剩余库存数量，仅对礼品券(gift)有效
  isAvailable = true,
  isRedeemable = true,
  level = 1,
  onClick = () => { },
}) => {
  const disabled = !isAvailable || (redeemPeriod && !isRedeemable) // 禁用条件，包括不可用和兑换时间段不满足时?

  const showStock = type === 'gift' && remainingStock !== undefined
    && !redeemPeriod && !conflictRule //剩余库存数量显示条件，仅对礼品券(gift)有效且无兑换时间段和冲突规则时显示

  return (
    <Card
      className={`rounded-md shadow-sm bg-white ${disabled ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex">
        <div className="w-12 h-12">
          <AntdImage
            src={image}
            alt={name}
            width="100%"
            height="100%"
            fit="cover"
            className="rounded-sm"
          />
        </div>
        <div className="flex-1 min-w-0 ml-1" > 
            <span className="text-xxs font-black line-clamp-2 h-[50px] text-gray-900" title={name}>{name}</span>
            <span className="text-xxxs text-gray-500 truncate mt-1" title={description}>{description}</span >
          <div className="text-xxxs h-[80px] space-y-1 mt-1"> 
            {showStock && (
              <span className="text-gray-400 block truncate">剩余: {remainingStock}件</span >
            ) }
            {redeemPeriod ? (
              <span className="text-red-500 block truncate" title={redeemPeriod ? `${redeemPeriod}` : undefined}>* {redeemPeriod}</span >
            ) : (
              <span className="text-transparent">*</span >
            )}
            {type !== 'product' && conflictRule ? (
              <span className="text-red-500 block truncate" title={conflictRule ? `${conflictRule}` : undefined} >* {conflictRule}</span >
            ) : (
              <span className="text-transparent">*</span >
            )}
          </div>  
          <div className="flex items-center mt-0.5">
            <div className="flex items-center text-orange-500 mr-2">
              <Star className="h-1 w-1 fill-orange-500 text-orange-500 mr-0.5" />
              <span className="text-xxxs">{points.toLocaleString()}</span>
            </div>
            <span className="text-xxxs text-gray-400 line-through">¥{originalPrice}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProductCard
