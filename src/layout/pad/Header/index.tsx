import React from 'react';
import './index.less';
import { NavBar, Space, Toast } from 'antd-mobile'
import { CloseOutline, MoreOutline, SearchOutline } from 'antd-mobile-icons'

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const pad = (
    <div className="flex items-center justify-between mb-6">
      {/* 返回按钮和店铺信息 */}
      {/* <button className="p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button> */}
      <div className="text-center">
        <div className="flex items-center gap-1">
          <span className="">新加坡三店</span>
        </div>
        <div className=" text-gray-500">桌号：A23</div>
      </div>
      <div className="text-right">
        <div className="">简体中文</div>
        {/* <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg> */}
      </div>
    </div>
  )

  // const back = () =>
  //   Toast.show({
  //     content: '点击了返回区域',
  //     duration: 1000,
  //   })

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={className}>
      {isDesktop ? pad : null}
    </div>
  );
};

export default Header;
