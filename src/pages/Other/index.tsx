import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
const Other = () => {
  const nav = useNavigate();
  return (
    <div
      onClick={() => {
        nav(-1);
      }}
      >
     其他
    </div>
  );
};
export default memo(Other);
