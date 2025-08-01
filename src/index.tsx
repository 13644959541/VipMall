import '@/assets/css/common.less';
import 'lib-flexible';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalProvider } from 'rmox';
import App from '@/App';
import { setWindowHeight } from './utils';

setWindowHeight();
window.onresize = () => {
  setWindowHeight();
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </StrictMode>
);
