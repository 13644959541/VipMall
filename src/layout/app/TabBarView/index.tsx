import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import routers from '../../../routers';
import styles from './index.module.less';
interface TabBarViewProps {
  className?: string;
}

function TabBarView({ className }: TabBarViewProps) {
  const location = useLocation();
  const tabBars = useRef(routers.find((v) => v.tabBars)?.tabBars);
  const [state, setstate] = useState(
    tabBars.current?.findIndex((v) => v.path === window.location.pathname),
  );
  const navigate = useNavigate();
  const OnTabClick = useCallback(
    (index: number, path: string) => {
      if (state === index) return;
      setstate(index);
      navigate(path);
    },
    [state, navigate],
  );
  useEffect(() => {
    setstate(
      tabBars.current?.findIndex((v) => matchPath(v.path, location.pathname)),
    );
  }, [location]);
  const isTabBar =
    tabBars.current?.findIndex((v) => matchPath(v.path, location.pathname)) !==
    -1;
  return (
    <div
      className={`${styles.tabBar} tab-bar flex justify-center items-center ${
        isTabBar ? styles.in_page : styles.out_page
      } ${className}`}>
      {tabBars.current?.map(({ title, path}, index) => (
        <div
          className={`flex flex-col justify-center items-center ${
            styles.tabBarItem
          } ${state === index ? styles.chooseed : ''}`}
          key={title}
          onClick={() => {
            OnTabClick(index, path);
          }}>
          <span>{title}</span>
        </div>
      ))}
    </div>
  );
};
export default memo(TabBarView);
