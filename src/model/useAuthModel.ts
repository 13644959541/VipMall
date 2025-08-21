import { useState, useEffect } from 'react';
import { createModel } from 'rmox';
import { NativeBridge } from '@/utils/bridge';

interface MemberLevelConfig {
  level: number;
  growthValueMin: number;
  country: string;
  growthValueMax: number;
}

interface UserInfo {
  remoteCountry: string;
  nickname: string;
  mobile: string;
  scoreExpire: number;
  smsFlg: string;
  levelUpGrowth: number;
  nextMonthLevel: number;
  totalShopCount: string;
  expireGrowth: number;
  growthValue: number;
  points?: number;
  isCompleteMemberInfo: boolean;
  pwd: string;
  isWeakPwd: boolean;
  monthGrowth: number;
  loginType: string;
  areaCode: string;
  localLevel: string;
  unsubscribe: boolean;
  loginStyle: string;
  isRemoteLogin: string;
  customerKey: string;
  posPushFlag: string;
  sex: string;
  RealName: string;
  memberLevelConfigList: MemberLevelConfig[];
  defaultLoginType: string;
  solarBirth: string;
  email: string;
  country: string;
  tableNo: string;
  shopNo: string;
  avatar: string;
}

const useAuthModel = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取用户信息
  const fetchUserInfo = () => {
    setLoading(true);
    NativeBridge.getUserInfo((userInfo) => {
      if (userInfo) {
        setUser(userInfo);
      }
      setLoading(false);
    });
  };

  // 项目启动时自动获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return {
    setUser,
    user,
    loading,
    fetchUserInfo, // 暴露fetch方法，可以在其他地方调用
  };
};
export default createModel(useAuthModel, { global: true });
