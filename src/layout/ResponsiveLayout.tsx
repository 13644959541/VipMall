import { ReactNode, useState, useEffect } from 'react';
import './ResponsiveLayout.less';
import Sidebar from './Sidebar';
import TabBarView from './TabBarView';
import Header from './Header';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 768;
      setIsDesktop(newIsDesktop);
    };

    // 初始执行一次
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="responsive-layout">
      {isDesktop ? (
        <>
          <div className="header-container">
            <Header />
          </div>
          <div className="desktop-layout">
            <Sidebar key="desktop-sidebar" />
            <div className="content-wrapper">
              <main className="main-content">{children}</main>
            </div>
          </div>
        </>
      ) : (
        <div className="mobile-layout">
          <main className="mobile-content">{children}</main>
          <TabBarView key="mobile-tabbar" />
        </div>
      )}
    </div>
  );
}
