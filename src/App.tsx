import { BrowserRouter as Router } from 'react-router-dom';
import RouteRender from '@/routers/RouteRender';
import { useEffect } from 'react';

declare global {
  interface Window {
    chrome?: {
      runtime?: {
        id?: string;
      };
    };
  }
}

const App = () => {
  useEffect(() => {
    if(window.chrome?.runtime?.id) {
      console.warn('检测到浏览器扩展程序，可能影响应用运行');
    }
  }, []);

  return (
    <>
      <Router>
        <RouteRender />
      </Router>
    </>
  );
};
export default App;
