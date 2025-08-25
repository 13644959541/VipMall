import React from 'react';
import { Modal } from 'antd-mobile';
import styles from './index.module.less'

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  showConfirmButton?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  showConfirmButton = true,
}) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={
        <div className={styles.modalTitle}>
          <span className='ml-1 mb-1 p-1'>{title}</span>
          <img
            src="/modal.svg"
            alt="icon-hdl"
            className={styles.pandaIcon}
          />
        </div>
      }
      content={
        <div className={`${styles['inputWrapper']} space-y-6`}>
          {/* Message content */}
          <div className={styles.messageContent}>
            {message}
          </div>

          {/* Action buttons */}
          <div className={styles.modalActions}>
            {showConfirmButton && (
              <div onClick={onClose} className={styles.cancelButton}>
              {cancelText}
            </div>
            )}
            <div onClick={onConfirm} className={styles.confirmButton}>
                {confirmText}
              </div>
          </div>
        </div>
      }
      className={styles.modalWrapper}
    />
  );
};

export default AlertModal;
