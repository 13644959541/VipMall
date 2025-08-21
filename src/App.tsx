import { BrowserRouter as Router } from 'react-router-dom';
import RouteRender from '@/routers/RouteRender';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import useAuthModel from '@/model/useAuthModel';

// 初始化FontAwesome
library.add(fas, far);


const App = () => {
  // 在应用启动时初始化用户信息
  useAuthModel();

  return (
    <>
      <Router>
        <RouteRender />
      </Router>
    </>
  );
};
export default App;
