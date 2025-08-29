import React from 'react';
import styles from './index.module.less';
import { Image as AntdImage, Toast } from 'antd-mobile'
import DropdownSort from '@/components/Select';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthModel } from '../../../model/useAuthModel'
import { useTranslation } from 'react-i18next';
interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationHistory, setNavigationHistory] = React.useState<string[]>([]);
  const canGoBack = navigationHistory.length > 1;
  const { user } = useAuthModel()
  const { i18n, t } = useTranslation('common');
  // 语言选项映射到 i18next 的语言代码
  const languageOptions = [
    { label: "简体中文", value: "zh-CN" },
    { label: "English", value: "en-US" }
  ]
  
  const languageChange = (value: string) => {
    i18n.changeLanguage(value);
  };
  
  // 获取当前语言的显示标签
  const getCurrentLanguageLabel = () => {
    const currentLang = languageOptions.find(option => option.value === i18n.language);
    return currentLang?.label || "简体中文";
  };
  const back = () => {
    if (canGoBack) {
      // 从历史记录中移除当前页面，然后导航到上一个页面
      setNavigationHistory(prev => prev.slice(0, -1));
      navigate(-1);
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
            defaultLabel={getCurrentLanguageLabel()}
          />
        </div>
      }
      left ={
          <div className={`${styles['header']} flex items-center justify-between `}>
          <div className={`${styles['table']} `}>{t('home.tableNumber')}: {user?.tableNo}</div>
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
