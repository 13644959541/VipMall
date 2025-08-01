import { FC, memo } from 'react';
import { Outlet } from 'react-router-dom';
import './index.less';

const Index: FC = () => {
  return (
        <Outlet />
  );
};

export default memo(Index);
