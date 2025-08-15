import { ShoppingCart, Clock, Gift } from 'lucide-react';
import UserProfile from '@/components/UserProfile';
import NavMenu from '@/components/NavMenu';
import './index.less';
interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={className}>
      {/* 用户信息 */}
      <UserProfile 
        avatar="/placeholder-user.jpg"
        name="拐拐儿1234567890..."
        badge="黄金会员"
        points={16600}
      />

      {/* 功能菜单 */}
      <NavMenu items={[
        { to: '/', icon: Gift, text: '商城兑换' },
        { to: '/details', icon: Clock, text: '兑换记录' },
        { to: '/cart', icon: ShoppingCart, text: '购物车' }
      ]} />
    </div>
  );
};

export default Sidebar;
