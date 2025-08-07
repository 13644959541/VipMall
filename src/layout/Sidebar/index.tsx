import { Image as AntdImage, Badge } from 'antd-mobile';
import { Star, ShoppingCart, Clock, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import './index.less';
interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={className}>
      {/* 用户信息 */}
      <div className="text-center ">
        <div className="relative inline-block mb-1">
          <div className="rounded-full overflow-hidden mx-auto bg-orange-100">
            <AntdImage
              src="/placeholder-user.jpg"
              alt="用户头像"
              width="100%"
              height="100%"
              fit="cover"
              fallback={
                <div className="w-full h-full bg-orange-200 flex items-center justify-center ">
                  🐼
                </div>
              }
            />
          </div>
          <Badge content="黄金会员" />
        </div>
        <div className="text-gray-600 mb-1">拐拐儿1234567890...</div>
        <div className="flex items-center justify-center text-orange-500 font-bold ">
          <Star className="h-2 w-2 fill-orange-500 text-orange-500 mr-1" />
          16,600
        </div>
      </div>

      {/* 功能菜单 */}
      <div className="space-y-2">
        <div className="flex flex-col items-center gap-2">
          <Link 
            to="/" 
            className="bg-red-500 text-white rounded-sm py-1 px-1 flex items-center justify-center gap-2 font-medium "
          >
            <Gift className="h-2 w-2" />
            商城兑换
          </Link>
          <Link 
            to="/detail" 
            className="bg-gray-100 text-gray-700 rounded-sm py-1 px-1 flex items-center justify-center gap-2 "
          >
            <Clock className="h-2 w-2" />
            兑换记录
          </Link>
          <Link 
            to="/list" 
            className="bg-gray-100 text-gray-700 rounded-sm py-1 px-1 flex items-center justify-center gap-2 "
          >
            <ShoppingCart className="h-2 w-2" />
            购物车
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
