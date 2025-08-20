import { ShoppingCart, Clock, Gift, LogOut } from 'lucide-react';
import UserProfile from '@/components/UserProfile';
import NavMenu from '@/components/NavMenu';
import './index.less';
interface SidebarProps {
  className?: string;
}

import { useState, useEffect } from 'react';
import { NativeBridge } from '@/utils/bridge';

const Sidebar: React.FC<SidebarProps> = ({
   className }) => {
  const [userInfo, setUserInfo] = useState({
    avatar: '/user.svg',
    name: '未知用户',
    localLevel: '4',
    points: 999999
  });

  useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      NativeBridge.getUserInfo((data) => {
        if (!data) throw new Error('获取用户信息失败')
        setUserInfo({
          avatar: data.avatar === ''? '/user.svg' : data.avatar,
          name: data.nickname === '' ? '未知用户' : data.nickname,
          localLevel: data.level === '' ?  1 : data.nickname,
          points: data.points === '' ?  0 :data.points
        })
      })
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  fetchUserInfo()
}, [])
  return (
    <div className={className}>
      {/* 用户信息 */}
      <UserProfile 
        avatar={userInfo.avatar}
        name={userInfo.name}
        localLevel={userInfo.localLevel}
        points={userInfo.points}
      />

      {/* 功能菜单 */}
      <NavMenu items={[
        { to: '/', icon: Gift, text: '商城兑换' },
        { to: '/record', icon: Clock, text: '兑换记录' },
        { to: '/cart', icon: ShoppingCart, text: '购物车' }
      ]} />


      {/*退出功能 */}
       <div className="flex flex-row justify-center text-[#6F6F72] items-center mt-10" onClick={() => NativeBridge.closePage()}>
        <LogOut className="icon-logout text-[#6F6F72]" size={16} />
        退出积分商城
      </div>
    </div>
  );
};

export default Sidebar;
