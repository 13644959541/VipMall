import AnimatedSwitch from '@/components/AnimatedSwitch';
import LoadingView from '@/components/LoadingView';
import useTitle from '@/hooks/useTitle';
import { White } from '@/typings';
import { treeToList } from '@/utils';
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import ResponsiveLayout from '@/layout/ResponsiveLayout';
import routes from './index';
import useSwitch from './useSwitch';
const generateRoute = ({
  routes,
  path,
  component: Component,
  tabBars,
  ...other
}: White.RouteConfig) => (
  <Route path={path} key={path} element={<Component />} {...other}>
    {(routes || tabBars)?.map((v) => generateRoute(v))}
  </Route>
);
let isStart = false;
const routeList = treeToList(routes, ['routes', 'tabBars']);
const handler = (e: any) => {
  e.stopPropagation();
  e.preventDefault();
};
const RouteRender = () => {
  const { classNames, primaryKey, location } = useSwitch();
  const routeRef = useRef<HTMLDivElement>(null);
  const routesView = useMemo(() => {
    return routes.map((v) => generateRoute(v));
  }, []);
  useLayoutEffect(() => {
    document.removeEventListener('click', handler, true);
  }, []);
  useTitle(routeList.find((v) => v.path === location.pathname)?.title);
  return (
    <ResponsiveLayout>
      <AnimatedSwitch
        ref={routeRef}
        classNames={classNames}
        primaryKey={primaryKey}
        onEnter={() => {
          if (!isStart) {
            document.addEventListener('click', handler, true);
            isStart = !isStart;
          }
        }}
        onExited={() => {
          if (isStart) {
            document.removeEventListener('click', handler, true);
            isStart = !isStart;
          }
        }}>
        <div ref={routeRef}>
          <Suspense>
            <Routes location={location}>{routesView}</Routes>
          </Suspense>
        </div>
      </AnimatedSwitch>
    </ResponsiveLayout>
  );
};
export default RouteRender;
