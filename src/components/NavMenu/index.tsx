import { NavLink, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
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
            className={({isActive}) => {
              const shouldHighlight = isActive || 
                (item.to === '/' && location.pathname.startsWith('/product/'));
              return `rounded-sm py-1 px-1 gap-1 flex items-center transition-colors
                ${shouldHighlight ? 'bg-[#E60012] text-white' : 'text-[#6F6F72]'}`;
            }}
          >
            <item.icon className="h-1 w-1 flex-shrink-0" />
            <span className="flex-grow text-left text-[16px]">{item.text}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default NavMenu;
