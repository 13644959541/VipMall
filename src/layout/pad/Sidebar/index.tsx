import React, { useEffect } from 'react';
import { ShoppingCart, Clock, Gift, LogOut } from 'lucide-react';
import UserProfile from '@/components/UserProfile';
import NavMenu from '@/components/NavMenu';
import { useAuthModel } from '@/model/useAuthModel';
import { NativeBridge } from '@/utils/bridge';
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

// 创建使用 store.svg 图片的组件
const StoreIcon = React.forwardRef<HTMLImageElement, { size?: number; className?: string }>(
  ({ size = 24, className = '' }, ref) => (
    <img 
      ref={ref}
      src="/store.svg" 
      alt="store" 
      style={{ width: size, height: size }}
      className={className}
    />
  )
);
StoreIcon.displayName = 'StoreIcon';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user, loading } = useAuthModel();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  // 用户信息为空时显示未知用户
  const displayUserInfo = user ? {
    avatar: user.avatar === '' ? '/user.svg' : user.avatar || '/user.svg',
    name: user.nickname === '' ? t('home.unknownUser') : user.nickname || t('home.unknownUser'),
    localLevel: user.localLevel === '' ? '1' : user.localLevel || '1',
    points: user.Points || 0
  } : {
    avatar: '/user.svg',
    name: t('home.unknownUser'),
    localLevel: '1',
    points: 0
  };

  return (
    <div className={className + " relative"}>
      {/* 用户信息 */}
      <UserProfile 
        avatar={displayUserInfo.avatar}
        name={displayUserInfo.name}
        localLevel={displayUserInfo.localLevel}
        points={displayUserInfo.points}
      />

      {/* 功能菜单 */}
      <NavMenu items={[
        { 
          to: '/', 
          icon: { normal: '/store.svg', active: '/store-l.svg' }, 
          text: t('home.redeemInMall') 
        },
        { 
          to: '/record', 
          icon: { normal: '/record.svg', active: '/record-l.svg' }, 
          text: t('home.redemptionHistory') 
        },
        { 
          to: '/cart', 
          icon: { normal: '/cart.svg', active: '/cart-l.svg' }, 
          text: t('home.shoppingCart') 
        }
      ]} />

      {/* 退出功能 */}
      <div className="absolute bottom-9 left-0 right-0 flex flex-row justify-center text-[#6F6F72] items-center" onClick={() => NativeBridge.closePage()}>
        <LogOut className="icon-logout text-[#6F6F72]" size={24} />
        <span className="text-[14px] ml-[4px]">{t('home.exitPointsMall')}</span>
      </div>
    </div>
  );
};

export default Sidebar;
