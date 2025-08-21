import { memo } from 'react';
import { Image as AntdImage } from 'antd-mobile'

const NoFound = () => {
  return (
    <div className={`flex flex-col items-center justify-center h-full mt-12`}>
      <AntdImage src="/error.svg" width={500} height={500} />
    </div>
  );
};
export default memo(NoFound);
