import React, { useEffect } from 'react';
import { ShoppingCart, Clock, Gift, LogOut } from 'lucide-react';
import UserProfile from '@/components/UserProfile';
import NavMenu from '@/components/NavMenu';
import './index.less';
import { useAuthModel } from '@/model/useAuthModel';
import { NativeBridge } from '@/utils/bridge';
import { useNavigate } from 'react-router-dom'
interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
   className }) => {
  const { user, loading } = useAuthModel();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Sidebar useEffect - user:', user, 'loading:', loading);
    if (!loading && !user) {
      console.log('用户信息获取失败，跳转到 /notfound 页面');
      navigate('/notfound');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  // 获取用户信息用于显示
  const displayUserInfo = {
    avatar: user.avatar === '' ? '/user.svg' : user.avatar || '/user.svg',
    name: user.nickname === '' ? '未知用户' : user.nickname || '未知用户',
    localLevel: user.localLevel === '' ? '1' : user.localLevel || '1',
    points: user.points || 0
  };
  return (
    <div className={className}>
      {/* 用户信息 */}
      <UserProfile 
        avatar={displayUserInfo.avatar}
        name={displayUserInfo.name}
        localLevel={displayUserInfo.localLevel}
        points={displayUserInfo.points}
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
