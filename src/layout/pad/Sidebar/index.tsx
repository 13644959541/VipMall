import React, { useEffect } from 'react';
import { ShoppingCart, Clock, Gift, LogOut } from 'lucide-react';
import UserProfile from '@/components/UserProfile';
import NavMenu from '@/components/NavMenu';
import { useAuthModel } from '@/model/useAuthModel';
import { NativeBridge } from '@/utils/bridge';
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
   className }) => {
  const { user, loading } = useAuthModel();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

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
    name: user.nickname === '' ? t('home.unknownUser') : user.nickname || t('home.unknownUser'),
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
        { to: '/', icon: Gift, text: t('home.redeemInMall') },
        { to: '/record', icon: Clock, text: t('home.redemptionHistory') },
        { to: '/cart', icon: ShoppingCart, text: t('home.shoppingCart') }
      ]} />


      {/*退出功能 */}
       <div className="flex flex-row justify-center text-[#6F6F72] items-center mt-10" onClick={() => NativeBridge.closePage()}>
        <LogOut className="icon-logout text-[#6F6F72]" size={16} />
        {t('home.exitPointsMall')}
      </div>
    </div>
  );
};

export default Sidebar;
