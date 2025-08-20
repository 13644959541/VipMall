import { Image as AntdImage, Badge } from 'antd-mobile';
import styles from './index.module.less'

interface UserProfileProps {
  avatar: string;
  name: string;
  localLevel: string;
  points: number;
  className?: string;
}

const memberLevels = [
  { level: 1, name: "红海会员", color: "#E60012",url:'/badge-1.svg'},
  { level: 2, name: "银海会员", color: "#9B9B9E",url:'/badge-2.svg' },
  { level: 3, name: "金海会员", color: "#D3A24E",url:'/badge-3.svg' },
  { level: 4, name: "黑海会员", color: "#101820",url:'/badge-4.svg' }
]


const UserProfile: React.FC<UserProfileProps> = ({
  avatar,
  name,
  localLevel,
  points,
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex flex-col items-center justify-center space-y-1">
        <AntdImage
          src={avatar}
          alt="用户头像"
          width="60px"
          height="60px"
          fit="cover"
        />
        <div style={{ fontSize:'12px', fontWeight: 400 }}>{name}</div>
        <div className={`${styles['profile']} relative`}>
          <Badge
            content={
              memberLevels.find(level => level.level === parseInt(localLevel))?.name || '红海会员'
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
            {points.toLocaleString('zh-CN', { useGrouping: true })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
