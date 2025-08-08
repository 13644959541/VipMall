import { Image as AntdImage, Badge } from 'antd-mobile';
import { Star, ShoppingCart, Clock, Gift } from 'lucide-react';
import { NavLink } from 'react-router-dom';
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
          <div className="rounded-md overflow-hidden mx-auto bg-orange-100">
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
          <Star className="h-1 w-1 fill-orange-500 text-orange-500 " />
          16,600
        </div>
      </div>

      {/* 功能菜单 */}
      <div className="w-full mt-2">
        <div className="flex flex-col items-stretch gap-2 px-2">
          <NavLink 
            to="/"
            className={({isActive}) => 
              `rounded-sm py-1 px-1 gap-2 flex items-center transition-colors
              ${isActive ? 'bg-red-500 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`
            }
          >
            <Gift className="h-1 w-1 flex-shrink-0" />
            <span className="flex-grow text-left">商城兑换</span>
          </NavLink>
          <NavLink 
            to="/detail"
            className={({isActive}) => 
              `rounded-sm py-1 px-1 gap-2 flex items-center  transition-colors
              ${isActive ? 'bg-red-500 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`
            }
          >
            <Clock className="h-1 w-1 flex-shrink-0" />
            <span className="flex-grow text-left">兑换记录</span>
          </NavLink>
          <NavLink 
            to="/list"
            className={({isActive}) => 
              `rounded-sm py-1 px-1 gap-2 flex items-center  transition-colors
              ${isActive ? 'bg-red-500 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`
            }
          >
            <ShoppingCart className="h-1 w-1 flex-shrink-0" />
            <span className="flex-grow text-left">购物车</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
