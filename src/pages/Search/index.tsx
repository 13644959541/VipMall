import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
const Search = () => {
  const nav = useNavigate();
  return (
    <div
      className="tabbar_page"
      onClick={() => nav('/other1')}>
      我的
    </div>
  );
};
export default memo(Search);
