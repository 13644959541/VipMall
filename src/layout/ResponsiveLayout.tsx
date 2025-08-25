import { ReactNode, useState, useEffect } from 'react';
import './ResponsiveLayout.less';
import Sidebar from './pad/Sidebar/index';
import TabBarView from './app/TabBarView/index';
import Header from './pad/Header/index';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [isPad, setIsPad] = useState(window.innerWidth >= 768 );

  useEffect(() => {
    const handleResize = () => {
      const newIsPad = window.innerWidth >= 768 
      console.log('Window resized - isPad:', newIsPad, 'Width:', window.innerWidth);
      setIsPad(newIsPad);
    };

    // 初始执行一次
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="responsive-layout">
      {isPad ? (
        <>
          <div className="header-container">
            <Header />
          </div>
          <div className="desktop-layout">
            <Sidebar key="desktop-sidebar" className="sidebar bg-white" />
            <div className="main-content rounded-lg">{children}</div>
          </div>
        </>
      ) : (
        <div className="mobile-layout">
          <div className="mobile-content">{children}</div>
          <TabBarView key="mobile-tabbar" />
        </div>
      )}
    </div>
  );
}
