import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import { SideBar } from 'antd-mobile';
import routers from '@/routers';
import './index.less';

interface SidebarProps {
  className?: string;
}

interface RouteTabBar {
  path: string;
  title: string;
  key: string;
  icon?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 安全获取并转换tabBars
  const tabBars: RouteTabBar[] = (routers.find((v) => v.tabBars)?.tabBars || [])
    .filter(tab => !!tab?.path && !!tab?.title)
    .map(tab => ({
      path: tab.path as string,
      title: tab.title as string,
      key: tab.path, // 使用path作为key
      icon: tab.icon
    }));
  
  const activeKey = tabBars.find((v) => 
    matchPath(v.path, location.pathname)
  )?.key || '';

  const handleChange = async (key: string) => {
    try {
      const item = tabBars.find(v => v.key === key);
      if (item) {
        await navigate(item.path);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <SideBar activeKey={activeKey} onChange={handleChange}>
          {tabBars.map(item => (
            <SideBar.Item key={item.key} title={item.title} />
          ))}
        </SideBar>
      </div>
    </div>
  );
};

export default Sidebar;
