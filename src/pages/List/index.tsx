
import useAxios from '@/hooks/useAxios';
import { Space, Badge, NoticeBar } from 'antd-mobile';
import Axios from 'axios';
import { FC, memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';
const List: FC = () => {
  const [state, setstate] = useState(0);
  const nva = useNavigate();
  // const { doAxios } = useAxios<any>(
  //   () => Axios.get<any>(''),
  //   [],
  // );
  // useEffect(() => {
  //   doAxios();
  // }, [doAxios]);

  return (
    <div>
    统计
    </div>
  );
};
export default memo(List);
