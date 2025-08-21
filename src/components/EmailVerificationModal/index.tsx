import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Toast } from 'antd-mobile';
import styles from './index.module.less'

interface EmailVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (email: string, code: string) => void;
  userInfo: {
    email?: string;
    mobile?: string;
  };
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  userInfo
}) => {
  const [verificationType, setVerificationType] = useState<'email' | 'mobile'>('email');
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [hasSent, setHasSent] = useState(false);

  useEffect(() => {
    // Set initial verification type based on available user info
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
    }
  }, [visible]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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

  const handleSendCode = () => {
    setSending(true);
    setCountdown(90);
    setHasSent(true);
    
    // 模拟发送验证码请求
    setTimeout(() => {
      setSending(false);
      const message = verificationType === 'email' 
        ? '验证码已发送至邮箱' 
        : '验证码已发送至手机';
      Toast.show(message);
    },2000);
  };

  const handleVerify = () => {
    if (!code) {
      Toast.show('请输入验证码');
      return;
    }

    // 模拟验证码验证
    Toast.show('验证成功');
    const contact = verificationType === 'email' ? userInfo?.email || '' : userInfo?.mobile || '';
    onConfirm(contact, code);
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
          <span className='ml-1 mb-1 p-1'>{verificationType === 'email' ? '邮箱验证码' : '手机验证码'}</span>
          <img
            src="/modal.svg"
            alt="icon-hdl"
            className={styles.pandaIcon}
          />
        </div>
      }
      content={
        <div className={`${styles['inputWrapper']} space-y-1`}>
          {/* Display formatted user information */}
          {userInfo && (userInfo.email || userInfo.mobile) && (
            <div className={styles.userInfo}>
              发送验证码至: {formatUserInfo()}
            </div>
          )}

          {/* Verification code input with send button */}
          <div className={styles.codeInputWrapper}>
            <Input
              id="verification-code"
              name="verificationCode"
              placeholder="请输入验证码"
              value={code}
              onChange={setCode}
              className={styles.codeInput}
            />
            <a
              onClick={(sending || countdown > 0) ? undefined : handleSendCode}
              className={`${styles.sendCodeButton} ${(sending || countdown > 0) ? styles.disabled : ''}`}
            >
              {countdown > 0 ? `${countdown}s` : (sending ? '发送中...' : (hasSent ? '再次发送' : '获取验证码'))}
            </a>
          </div>
          {/* Toggle button for switching verification type */}
          {userInfo?.email && userInfo?.mobile && (
            <div className={styles.toggleWrapper}>
              <a onClick={toggleVerificationType} className={styles.toggleButton}>
                {verificationType === 'email' ? '发送手机验证码' : '发送邮箱验证码'}
              </a>
            </div>
          )}

          <div className={styles.modalActions}>
            <div onClick={onClose} className={styles.cancelButton}>
              取消
            </div>
            <div onClick={handleVerify} className={styles.confirmButton}>
              继续兑换
            </div>
          </div>
        </div>
      }
      className={styles.modalWrapper}
    />
  );
};

export default EmailVerificationModal;
