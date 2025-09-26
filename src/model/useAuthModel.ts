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
  Points?: number;
  isCompleteMemberInfo: boolean;
  pwd: string;
  isWeakPwd: boolean;
  monthGrowth: number;
  loginType: string;
  areaCode: string;
  localLevel: string;
  unsubscribe: boolean;
  loginStyle: string;
  verifyType: string;
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
  updateUserPoints: (newPoints: number) => void;
}

export const useAuthModel = create<AuthState>((set, get) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  fetchUserInfo: () => {
    set({ loading: true });
    NativeBridge.getUserInfo((userInfo) => {
      if (userInfo) {
        set({ user: userInfo, loading: false });
        authInitialized = true;
        window.dispatchEvent(new CustomEvent('authInitialized'));
      } else {
        set({ loading: false });
        window.location.href = '/errorPage';
      }
    });
  },
  updateUserPoints: (newPoints: number) => {
    set((state) => ({
      user: state.user ? { ...state.user, Points: newPoints } : null
    }));
  },
}));

export const initializeAuth = () => {
  const { fetchUserInfo } = useAuthModel.getState();
  fetchUserInfo();
};

let authInitialized = false;

export const onAuthInitialized = (callback: () => void) => {
  if (authInitialized) {
    callback();
  } else {
    const handleAuthInitialized = () => {
      callback();
      window.removeEventListener('authInitialized', handleAuthInitialized);
    };
    window.addEventListener('authInitialized', handleAuthInitialized);
  }
};
