import { Image as AntdImage, Badge } from 'antd-mobile';
import styles from './index.module.less'
import { useTranslation } from 'react-i18next';
import { formatNumberWithCommas } from '@/utils';

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
  const membershipLevels = [
    { level: 1, name: t('home.redMember'), color: "#E60012", url: '/badge-1.svg' },
    { level: 2, name: t('home.silverMember'), color: "#9B9B9E", url: '/badge-2.svg' },
    { level: 3, name: t('home.goldMember'), color: "#D3A24E", url: '/badge-3.svg' },
    { level: 4, name: t('home.premiumMember'), color: "#101820", url: '/badge-4.svg' }
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
        <div style={{ fontSize: '12px', fontWeight: 400 }}>{name}</div>
        <div className={`${styles['profile']} `}>
          {membershipLevels.find(data => data.level === parseInt(localLevel))?.url && (
            <img
              src={membershipLevels.find(data => data.level === parseInt(localLevel))?.url}
              className="h-[24px] w-[24px] z-10 -mr-[12px] rounded-[8px]"
              alt="badge-icon"
            />
          )}
          <Badge
            content={
              membershipLevels.find(level => level.level === parseInt(localLevel))?.name || t('home.redMember')
            }
            color={membershipLevels.find(level => level.level === parseInt(localLevel))?.color || '#E60012'}
            className={`${styles['adaptive-badge']}`}
          />

        </div>
        <div className="flex items-center">
          <img
            src="/star.svg"
            className="h-[26px] w-[26px] mr-[5px]"
            alt="star-icon"
          />
          <div style={{ fontSize: '24px', fontWeight: 900, color:'#101820'}}>
            {formatNumberWithCommas(points)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
