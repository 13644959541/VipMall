import AnimatedSwitch from '@/components/AnimatedSwitch';
import useTitle from '@/hooks/useTitle';
import { White } from '@/typings';
import { treeToList } from '@/utils';
import { Suspense, useMemo, useRef } from 'react';
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
const routeList = treeToList(routes, ['routes', 'tabBars']);

const RouteRender = () => {
  const { classNames, primaryKey, location } = useSwitch();
  const routeRef = useRef<HTMLDivElement>(null);
  const routesView = useMemo(() => {
    return routes.map((v) => generateRoute(v));
  }, []);
  
  useTitle(routeList.find((v) => v.path === location.pathname)?.title);
  
  return (
    <ResponsiveLayout>
      <AnimatedSwitch
        ref={routeRef}
        classNames={classNames}
        primaryKey={primaryKey}>
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
