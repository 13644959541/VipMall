import React, { useState, useEffect } from 'react';
import { Modal, Input, Toast } from 'antd-mobile';
import { useAuthModel } from "@/model/useAuthModel";
import { sendVerifyCodeRequest, checkVerifyCodeRequest } from "@/services/verifySerivce";
import styles from './index.module.less'
import { useTranslation } from "react-i18next"

interface EmailVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (email: string, code: string) => void;
  userInfo: {
    email?: string;
    mobile?: string;
  };
  confirmText: string;
  cancelText: string;
  verifyType: string; // '6'表示积分兑换，'9'表示核销
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  userInfo,
  confirmText,
  cancelText,
  verifyType,
}) => {
  const [verificationType, setVerificationType] = useState<'email' | 'mobile'>('email');
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [hasSent, setHasSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { t } = useTranslation('common');
  useEffect(() => {
    if (userInfo?.email) {
      setVerificationType('email');
    } else if (userInfo?.mobile) {
      setVerificationType('mobile');
    }
  }, [userInfo]);

  useEffect(() => {
    if (!visible) {
      // Reset form when modal closes
      setCode('');
      setCountdown(0);
      setHasSent(false);
      setEmailSent(false);
    }
  }, [visible]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && hasSent && verificationType === 'email') {
      // 倒计时结束且是邮箱验证时，设置 emailSent 为 true
      setEmailSent(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, hasSent, verificationType]);

  const formatUserInfo = () => {
    if (verificationType === 'email' && userInfo?.email) {
      const [username, domain] = userInfo.email.split('@');
      return `***@${domain}`;
    } else if (verificationType === 'mobile' && userInfo?.mobile) {
      const mobile = userInfo.mobile;
      return `${mobile.slice(0, 3)}****${mobile.slice(-3)}`;
    }
    return '';
  };

  const handleSendCode = async () => {
    setSending(true);
    setCountdown(90);
    setHasSent(true);
    try {
      const { user } = useAuthModel.getState();

      const requestData = {
        areaCode: verificationType === 'mobile' ? user?.areaCode || '+86' : undefined,
        country: user?.country || 'CN',
        customerKey: (verificationType === 'email' ? user?.email : user?.mobile) || '',
        deptName: user?.shopNo || '',
        deviceSource: 'score_mall',
        language: 'cn',
        localTime: new Date().toISOString(),
        storeId: user?.shopNo || '',
        type: verificationType === 'email' ? 2 : 1,
        verifyType: verifyType
      };

      await sendVerifyCodeRequest(requestData);
      const message = verificationType === 'email'
        ? t('modal.codeSentToEmail')
        : t('modal.codeSentToPhone');
      Toast.show(message);
    } catch (error) {
      Toast.show(t('modal.codeSendFailed'));
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (!code) {
      Toast.show(t('modal.verificationCodeRequired'));
      return;
    }

    try {
      const { user } = useAuthModel.getState();
      const customerKey = verificationType === 'email' ? userInfo?.email || '' : userInfo?.mobile || '';

      const requestData = {
        areaCode: verificationType === 'mobile' ? user?.areaCode || '+86' : undefined,
        customerKey,
        type: verificationType === 'email' ? 2 : 1,
        verifyCode: code,
        verifyType: verifyType,
      };
      await checkVerifyCodeRequest(requestData);
      onConfirm(customerKey, code);
    } catch (error) {
      Toast.show(t('modal.incorrectCode'));
    }
  };

  const toggleVerificationType = () => {
    setVerificationType(verificationType === 'email' ? 'mobile' : 'email');
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={
        <div className={`${styles['modalTitle']}`}>
          <span className='ml-1 mb-1 p-1'>{verificationType === 'email' ? t('modal.emailVerificationCode') : t('modal.smsVerificationCode')}</span>
          <img
            src="/modal.svg"
            alt="icon-hdl"
            width={140}
            height={140}
            className={styles.pandaIcon}
          />
        </div>
      }
      content={
        <div className={`${styles['inputWrapper']} `}>
          {userInfo && (userInfo.email || userInfo.mobile) && (
            <div className={styles.userInfo}>
              {t('modal.sendVerificationCodeTo')}:{formatUserInfo()}
            </div>
          )}

          <div className={styles.codeInputWrapper}>
            <Input
              id="verification-code"
              name="verificationCode"
              placeholder={t('modal.enterVerificationCode')}
              value={code}
              onChange={setCode}
              className={styles.codeInput}
            />
            <a
              onClick={(sending || countdown > 0) ? undefined : handleSendCode}
              className={`${styles.sendCodeButton} ${(sending || countdown > 0) ? styles.disabled : ''}`}
            >
              {countdown > 0 ? `${countdown}s` : (sending ? '...' : (hasSent ? t('modal.getCode') : t('modal.getCode')))}
            </a>
          </div>
          {userInfo?.email && userInfo?.mobile && (
            <div className={styles.toggleWrapper}>
              <a
                onClick={(verificationType === 'email' && !emailSent) ? undefined : toggleVerificationType}
                className={` ${(verificationType === 'email' && !emailSent) ? styles.toggleButton : styles.toggleButtonActive}`}
              >
                {verificationType === 'email' ? t('modal.sendSmsCode') : t('modal.sendEmailCode')}
              </a>
            </div>
          )}
          <div className={styles.modalActions}>
            <div onClick={onClose} className={styles.cancelButton}>
              {cancelText}
            </div>
            <div onClick={handleVerify} className={styles.confirmButton}>
              {confirmText}
            </div>
          </div>
        </div>
      }
      className={styles.modalWrapper}
    />
  );
};

export default EmailVerificationModal;
