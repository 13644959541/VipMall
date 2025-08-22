import { create } from 'zustand';
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

interface AuthState {
  user: UserInfo | null;
  loading: boolean;
  setUser: (user: UserInfo | null) => void;
  fetchUserInfo: () => void;
}

export const useAuthModel = create<AuthState>((set, get) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  fetchUserInfo: () => {
    set({ loading: true });
    console.log('开始获取用户信息...');
    
    NativeBridge.getUserInfo((userInfo) => {
      console.log('获取到的用户信息:', userInfo);
      if (userInfo) {
        console.log('用户信息有效，设置用户状态');
        set({ user: userInfo, loading: false });
      } else {
        console.log('用户信息为空或未获取到');
        set({ loading: false });
      }
    });
  },
}));

// 在应用启动时自动获取用户信息
export const initializeAuth = () => {
  const { fetchUserInfo } = useAuthModel.getState();
  fetchUserInfo();
};
