import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言资源
import zhCNCommon from './zh-CN/common.json';
import enUSCommon from './en-US/common.json';

// 资源类型定义
export interface Resources {
  header: {
    home: string;
    coupon: string;
    meal: string;
    gift: string;
    cart: string;
    profile: string;
  };
  home: {
    tableNumber: string;
    redMember: string;
    silverMember: string;
    goldMember: string;
    premiumMember: string;
    redeemInMall: string;
    redemptionHistory: string;
    shoppingCart: string;
    exitPointsMall: string;
    exitMall: string;
    home: string;
    voucherZone: string;
    dishCouponZone: string;
    merchandise: string;
    storeHotSale: string;
    recommended: string;
    redeemableForMe: string;
    networkError: string;
    unknownUser: string;
  };
  product: {
    points: string;
    originalPrice: string;
    sales: string;
    redeem: string;
    available: string;
    unavailable: string;
    stock: string;
    memberZone: string;
    all: string;
    redeemableForRedMembers: string;
    redeemableForSilverMembers: string;
    redeemableForGoldMembers: string;
    redeemableForPremiumMembers: string;
    defaultSort: string;
    requiredPoints: string;
    selectStore: string;
    salesHighToLow: string;
    salesLowToHigh: string;
    pointsLowToHigh: string;
    pointsHighToLow: string;
  };
  productDetail: {
    redMemberPoints: string;
    silverMemberPoints: string;
    goldMemberPoints: string;
    premiumMemberPoints: string;
    purchaseRestrictionLevel: string;
    itemsRedeemed: string;
    itemsRemaining: string;
    redeemableTime: string;
    notYetAvailable: string;
    addToCart: string;
    redeemNow: string;
    productDetails: string;
    redemptionInstructions: string;
    couponType: string;
    availableStores: string;
    validityPeriod: string;
    availableTime: string;
    coinRedemption: string;
    transferable: string;
    usageInstructions: string;
  };
  redemptionRecord: {
    coupon: string;
    redemptionTime: string;
    usageRules: string;
    actualPayment: string;
    redemptionChannel: string;
    validUntil: string;
    verifyNow: string;
    verified: string;
    notVerified: string;
    noItemsRedeemed: string;
  };
  cart: {
    totalPoints: string;
    redeemNow: string;
    nonReturnable: string;
    delete: string;
    emptyCart: string;
    outOfStock: string;
    manage: string;
    done: string;
    selectAll: string;
  };
  modal: {
    similarCouponWarning: string;
    singleCouponWarning: string;
    confirmRedemption: string;
    confirmSingleCoupon: string;
    confirmDishCoupon: string;
    confirmVoucher: string;
    confirmMerchandise: string;
    emailVerificationCode: string;
    smsVerificationCode: string;
    sendVerificationCodeTo: string;
    enterVerificationCode: string;
    getCode: string;
    verificationCodeRequired: string;
    codeSentToEmail: string;
    codeSentToPhone: string;
    codeSendFailed: string;
    incorrectCode: string;
    sendSmsCode: string;
    sendEmailCode: string;
    confirmVerification: string;
    confirmMerchandiseVerification: string;
    confirmDeletion: string;
    confirmCartDeletion: string;
    confirmCartRedemption: string;
    cancel: string;
    confirm: string;
    continueRedemption: string;
    continueVerification: string;
    redemptionSuccessful: string;
    contactStaff: string;
    merchandiseContactStaff: string;
    gotIt: string;
    addedToCart: string;
    insufficientPoints: string;
    redeemSoon: string;
    verificationSuccessful: string;
    deletedSuccessfully: string;
    requestFailed: string;
    networkUnstable: string;
  };
  filter: {
    sort: string;
    default: string;
    pointsHigh: string;
    pointsLow: string;
    salesHigh: string;
    redeemableOnly: string;
    memberLevel: string;
  };
  button: {
    confirm: string;
    cancel: string;
    back: string;
    next: string;
  };
}

// 声明资源类型
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      common: Resources;
    };
  }
}

// 初始化 i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': {
        common: zhCNCommon
      },
      'en-US': {
        common: enUSCommon
      }
    },
    lng: 'zh-CN', // 默认语言
    fallbackLng: 'zh-CN', // 回退语言
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // React 已经做了 XSS 防护
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
