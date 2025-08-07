import React from 'react'
import { Card, Image as AntdImage } from 'antd-mobile'
import { Star } from 'lucide-react'

interface ProductCardProps {
  image: string
  name: string
  description: string
  points: number
  originalPrice: number
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  description,
  points,
  originalPrice,
}) => {
  return (
    <Card className="rounded-md shadow-sm bg-white p-1.5">
      <div className="flex gap-1.5">
        <div className="w-6 h-6 rounded-sm overflow-hidden flex-shrink-0">
          <AntdImage
            src={image}
            alt={name}
            width="100%"
            height="100%"
            fit="cover"
            className="rounded-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xxs font-medium line-clamp-2 mb-0.5 text-gray-900">{name}</h3>
          <p className="text-xxxs text-gray-500 mb-0.5 line-clamp-1">{description}</p>
          <div className="flex items-center">
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
