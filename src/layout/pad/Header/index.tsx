import React from 'react';
import styles from './index.module.less';
import { Image as AntdImage, Toast } from 'antd-mobile'
import DropdownSort from '@/components/Select';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthModel } from '../../../model/useAuthModel'
interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationHistory, setNavigationHistory] = React.useState<string[]>([]);
  const canGoBack = navigationHistory.length > 1;
  const { user } = useAuthModel()
  //多语言
  // "KR ""韩国""
  // SG ""新加坡""
  // TW ""台湾地区""
  // HK ""香港地区""
  // MO ""澳门地区""
  // US ""美国""
  // GB ""英国""
  // JP ""日本""
  // CA ""加拿大""
  // AU ""澳大利亚""
  // VN ""越南""
  // MY ""马来西亚""
  // ID ""印度尼西亚""
  // TH ""泰国""
  // UAE ""阿联酋""
  // PH ""菲律宾""
  // KHM ""柬埔寨""
  const languageOptions = [
    { label: "简体中文", value: "ZH" },
    { label: "English", value: "US" },
    { label: "繁體中文", value: "TW" },
    { label: "한국어", value: "KR" },
    { label: "日本語", value: "JP" },
    { label: "ไทย", value: "TH" },
    { label: "新加坡", value: "SG" },
    { label: "香港地区", value: "HK" },
    { label: "澳门地区", value: "MO" },
    { label: "英国", value: "GB" },
    { label: "加拿大", value: "CA" },
    { label: "澳大利亚", value: "AU" },
    { label: "越南", value: "VN" },
    { label: "马来西亚", value: "MY" },
    { label: "印度尼西亚", value: "ID" },
    { label: "阿联酋", value: "UAE" },
    { label: "菲律宾", value: "PH" },
    { label: "柬埔寨", value: "KHM" }
  ]
  const languageChange = (value: string) => {
    console.log(value);
  };
  const back = () => {
    if (canGoBack) {
      // 从历史记录中移除当前页面，然后导航到上一个页面
      setNavigationHistory(prev => prev.slice(0, -1));
      navigate(-1);
    } else {
      Toast.show({
        content: '已经是第一页了',
        duration: 1000,
      });
    }
  }
  
  const pad = (
    <NavBar onBack={canGoBack ? back : undefined} className={`${styles['nav']} ${!canGoBack ? styles['disabled'] : ''}`}
      right={
        <div className={`${styles['lang']} flex items-center`}>
          <AntdImage
            src='/Language.svg'
            width={10}
            height={10}
            fit="cover"
          />
          <DropdownSort
            options={languageOptions}
            onChange={languageChange}
            defaultLabel="简体中文"
          />
        </div>
      }
      left ={
          <div className={`${styles['header']} flex items-center justify-between `}>
          <div className={`${styles['table']} `}>桌号: {user?.tableNo}</div>
        </div>
      }>
      
    </NavBar>
  )

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // 记录导航历史
    setNavigationHistory(prev => {
      // 如果当前路径与最后一个历史记录相同，则不重复添加
      if (prev.length === 0 || prev[prev.length - 1] !== location.pathname) {
        return [...prev, location.pathname];
      }
      return prev;
    });
  }, [location.pathname]);

  return (
    <div className={className}>
      {isDesktop ? pad : null}
    </div>
  );
};

export default Header;
