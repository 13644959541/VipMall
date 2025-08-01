import { BrowserRouter as Router } from 'react-router-dom';
import RouteRender from '@/routers/RouteRender';
const App = () => {
  return (
    <>
      <Router>
        <RouteRender />
      </Router>
    </>
  );
};
export default App;
