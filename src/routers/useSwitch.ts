import { White } from '@/typings';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType, matchPath } from 'react-router-dom';
import routes, { TabBarList } from './index';

const useSwitch = () => {
  const action = useNavigationType();
  const oldMode = useRef<{
    mode: White.SwitchType | undefined;
    path?: string;
    isTab?: boolean;
  }>({
    mode: undefined,
    path: '',
    isTab: false
  });
  const location = useLocation();
  const className = useRef<string>('');
  const routeSceneMode = routes.find((v) =>
    matchPath({path: v.path, end: true}, location.pathname),
  )?.sceneMode;
  const [activeIndex, oldIndex] = TabBarList.reduce(
    (pre, { path }, index) => {
      if (matchPath({path, end: true}, location.pathname)) {
        pre[0] = index;
      }
      if (matchPath({path, end: true}, oldMode.current?.path || '')) {
        pre[1] = index;
      }
      return pre;
    },
    [-1, -1],
  );
  if (activeIndex !== -1 && oldIndex !== -1) {
    className.current =
      activeIndex > oldIndex
        ? `forward-from-${TabBarList[activeIndex].sceneMode || 'right'}`
        : `back-to-${TabBarList[oldIndex].sceneMode || 'right'}`;
  } else {
    if (action === 'PUSH') {
      className.current = `forward-from-${routeSceneMode || 'right'}`;
    } else if (action === 'POP') {
      className.current = `back-to-${oldMode.current?.mode || 'right'}`;
    }
  }

  useEffect(() => {
    oldMode.current = {
      mode: routeSceneMode,
      path: location.pathname,
    };
  }, [location, routeSceneMode]);

  return {
    classNames: className.current,
    primaryKey: location.pathname,
    location,
  };
};

export default useSwitch;
