import { Image as AntdImage, Badge } from 'antd-mobile';
import styles from './index.module.less'
import { useTranslation } from 'react-i18next';

interface UserProfileProps {
  avatar: string;
  name: string;
  localLevel: string;
  points: number;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  avatar,
  name,
  localLevel,
  points,
  className = ''
}) => {
  
  const { t } = useTranslation('common'); // 这里指定命名空间
  const memberLevels = [
    { level: 1, name:  t('home.redMember'), color: "#E60012",url:'/badge-1.svg'},
    { level: 2, name:  t('home.silverMember'), color: "#9B9B9E",url:'/badge-2.svg' },
    { level: 3, name:  t('home.goldMember'), color: "#D3A24E",url:'/badge-3.svg' },
    { level: 4, name:  t('home.premiumMember'), color: "#101820",url:'/badge-4.svg' }
  ]
  return (
    <div className={`${className}`}>
      <div className="flex flex-col items-center justify-center space-y-1">
        <AntdImage
          src={avatar}
          alt="avatar-icon"
          width="60px"
          height="60px"
          fit="cover"
        />
        <div style={{ fontSize:'12px', fontWeight: 400 }}>{name}</div>
        <div className={`${styles['profile']} relative`}>
          <Badge
            content={
              memberLevels.find(level => level.level === parseInt(localLevel))?.name ||  t('home.redMember')
            }
            color={memberLevels.find(level => level.level === parseInt(localLevel))?.color || '#E60012'}
            style={{ width: '66px', height:'20px', justifyContent: 'center', alignItems: 'center' }}
          />
          {memberLevels.find(data => data.level === parseInt(localLevel))?.url && (
            <img 
              src={memberLevels.find(data => data.level === parseInt(localLevel))?.url}
              className="absolute top-[5px] right-4 h-1 w-1 z-10" 
              alt="badge-icon"
            />
          )}
        </div>
        <div className="flex items-center">
          <img
            src="/star.svg"
            className="h-2 w-2 mr-[5px]"
            alt="star-icon"
          />
          <div style={{ fontSize: '24px', fontWeight: 860  }}>
            {points}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
