import { Image as AntdImage, Badge } from 'antd-mobile';
import { Star } from 'lucide-react';

interface UserProfileProps {
  avatar: string;
  name: string;
  badge: string;
  points: number;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  avatar,
  name,
  badge,
  points,
  className = ''
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="relative inline-block mb-1">
        <div className="rounded-md overflow-hidden mx-auto bg-orange-100">
          <AntdImage
            src={avatar}
            alt="用户头像"
            width="100%"
            height="100%"
            fit="cover"
            fallback={
              <div className="w-full h-full bg-orange-200 flex items-center justify-center">
                🐼
              </div>
            }
          />
        </div>
        <Badge content={badge} />
      </div>
      <div className="text-gray-600 mb-1">{name}</div>
      <div className="flex items-center justify-center text-orange-500 font-bold">
        <Star className="h-1 w-1 fill-orange-500 text-orange-500" />
        {points.toLocaleString()}
      </div>
    </div>
  );
};

export default UserProfile;
