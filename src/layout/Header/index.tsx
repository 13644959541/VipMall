import React from 'react';
import './index.less';
import { NavBar, Space, Toast } from 'antd-mobile'
import { CloseOutline, MoreOutline, SearchOutline } from 'antd-mobile-icons'

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const right = (
    <div style={{ fontSize: 24 }}>
      <Space style={{ '--gap': '16px' }}>
        <SearchOutline />
        <MoreOutline />
      </Space>
    </div>
  )

  const back = () =>
    Toast.show({
      content: '点击了返回区域',
      duration: 1000,
    })

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop ? (
    <NavBar onBack={back}>标题</NavBar>
  ) : null;
};

export default Header;
