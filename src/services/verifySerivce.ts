
import { post } from '../plugins/request';

export interface sendVerifyCodeRequest {
    /**
     * 国码 type=1时不能为空
     */
    areaCode?: string;
    /**
     * 国家编码
     */
    country: string;
    /**
     * 客户标识（手机号或邮箱）type=1填入手机号；type=2填入邮箱
     */
    customerKey: string;
    /**
     * 门店名称
     */
    deptName: string;
    /**
     * 设备来源 积分商城score_mall pc后台pc ...
     */
    deviceSource: string;
    /**
     * 语言 zh en..
     */
    language: string;
    /**
     * 当地时间；非服务器时间
     */
    localTime: string;
    /**
     * 门店id
     */
    storeId: string;
    /**
     * 1手机号 2邮箱
     */
    type: number;
    /**
     * 6表示积分兑换 9表示券核销
     */
    verifyType: string;
}


/**
 * 校验验证码请求参数 校验验证码请求参数
 *
 * SmsEmailCheckVerifyCodeRequest
 */
export interface checkVerifyCodeRequest {
    /**
     * 国码，type=1时不能为空，用于短信发送
     */
    areaCode?: string;
    /**
     * 客户标识（手机号或邮箱）
     */
    customerKey: string;
    /**
     * 类型（1-短信，2-邮箱）
     */
    type: number;
    /**
     * 验证码
     */
    verifyCode: string;
    /**
     * 验证类型
     */
    verifyType: string;
}



export const sendVerifyCodeRequest = async (data:sendVerifyCodeRequest): Promise<any[]> => {
  try { 
    const response = await post('/front/sms-email/send-verify-code', data);
    return response.records || [];
  } catch (error) {
    console.error('发送失败:', error);
    throw error;
  }
};

export const checkVerifyCodeRequest = async (data:checkVerifyCodeRequest): Promise<any[]> => {
  try {
    const response = await post('/front/sms-email/check-verify-code', data);
    if (response.code !== "ok" && response.success !== true) {
      throw new Error(response.msg || '验证码验证失败');
    }
    return response.items || [];
  } catch (error) {
   
    throw error;
  }
};
