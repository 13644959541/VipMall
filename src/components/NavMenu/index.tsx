import { NavLink, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

// 修改类型定义，支持亮色图标配置
interface NavItem {
  to: string;
  icon: string | { normal: string; active: string }; // 支持单图标或亮暗双图标
  text: string;
}

interface NavMenuProps {
  items: NavItem[];
  className?: string;
}

const NavMenu: React.FC<NavMenuProps> = ({ items, className = '' }) => {
  const location = useLocation();
  
  return (
    <div className={`w-full mt-2 ${className}`}>
      <div className="flex flex-col items-stretch gap-2 px-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              const shouldHighlight = isActive || 
                (item.to === '/' && location.pathname.startsWith('/product/'));
              
              return `rounded-[8px] pt-[8px] pb-[8px] pl-[8px] pr-[8px] gap-1 flex items-center transition-colors  w-[170px]
                 ${shouldHighlight ? 'bg-[#E60012] text-white' : 'text-[#6F6F72]'}`;
            }}
          >
            {({ isActive }) => {
              const shouldHighlight = isActive || 
                (item.to === '/' && location.pathname.startsWith('/product/'));
              
              let iconSrc: string;
              if (typeof item.icon === 'string') {
                iconSrc = item.icon;
              } else {
                iconSrc = shouldHighlight ? item.icon.active : item.icon.normal;
              }
              
              return (
                <>
                  <img 
                    src={iconSrc} 
                    alt="icon" 
                    className="h-[24px] w-[24px] flex-shrink-0"
                  />
                  <span className="flex-grow text-left text-[16px] no-underline">{item.text}</span>
                </>
              );
            }}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default NavMenu;
