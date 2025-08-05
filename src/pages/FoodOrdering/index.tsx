import { Card, Tabs, Checkbox, Image as AntdImage } from "antd-mobile"
import { Star } from "lucide-react"

// Reusable ProductCard component adapted for antd-mobile/Tailwind
function ProductCard({
  image,
  name,
  exchangeInfo,
  points,
  originalPrice,
}: {
  image: string
  name: string
  exchangeInfo: string
  points: number
  originalPrice: number
}) {
  return (
    <Card className="rounded-xl overflow-hidden shadow-sm">
      <div className="p-2">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
          <AntdImage
            src={image || "/placeholder.svg"}
            alt={name}
            width="100%"
            height="100%"
            fit="cover"
            className="rounded-lg"
          />
        </div>
        <h3 className="text-sm font-medium line-clamp-2 mb-1">{name}</h3>
        <p className="text-xs text-gray-500 mb-2">{exchangeInfo}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-orange-500 font-bold text-base">
            <Star className="h-4 w-4 fill-orange-500 text-orange-500 mr-1" />
            {points.toLocaleString()}
          </div>
          <span className="text-xs text-gray-400 line-through">¥{originalPrice.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  )
}

export default function FoodOrdering() {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
      <Tabs defaultActiveKey="homepage" className="w-full">
        <Tabs.Tab
          title="首页"
          key="homepage"
          className="data-[active=true]:bg-red-500 data-[active=true]:text-white rounded-lg py-2"
        />
        <Tabs.Tab
          title="代金券专区"
          key="vouchers"
          className="data-[active=true]:bg-red-500 data-[active=true]:text-white rounded-lg py-2"
        />
        <Tabs.Tab
          title="菜品券专区"
          key="dish-vouchers"
          className="data-[active=true]:bg-red-500 data-[active=true]:text-white rounded-lg py-2"
        />
        <Tabs.Tab
          title="周边礼品"
          key="gifts"
          className="data-[active=true]:bg-red-500 data-[active=true]:text-white rounded-lg py-2"
        />

        <div className="mt-4">
          {/* Banner Section */}
          <Card className="mb-6 rounded-xl overflow-hidden">
            <AntdImage
              src="/hot-pot-banner.png"
              alt="Hot Pot Soup Base Banner"
              width="100%"
              height="auto"
              fit="cover"
            />
          </Card>

          {/* Area Activities */}
          <h2 className="text-xl font-bold mb-4">地区活动</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="rounded-xl overflow-hidden">
              <AntdImage
                src="/hot-pot-promotion.png"
                alt="Hot Pot Ingredients Promotion"
                width="100%"
                height="auto"
                fit="cover"
              />
            </Card>
            <Card className="rounded-xl overflow-hidden">
              <AntdImage
                src="/panda-promotion.png"
                alt="Panda Character Promotion"
                width="100%"
                height="auto"
                fit="cover"
              />
            </Card>
          </div>

          {/* Hot Selling Items */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">门店热卖</h2>
            <div className="flex items-center space-x-2">
              <Checkbox id="can-exchange" />
              <label
                htmlFor="can-exchange"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                看我可兑
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ProductCard
              image="/taro-paste.png"
              name="商品名称"
              exchangeInfo="兑换信息"
              points={1000}
              originalPrice={200}
            />
            {/* Additional ProductCards can be added here */}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
