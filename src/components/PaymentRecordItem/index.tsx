import React from 'react'
import { Image as AntdImage, Dialog, Button } from 'antd-mobile'
import styles from './index.module.less'
import { useTranslation } from 'react-i18next'
import { RightOutline } from "antd-mobile-icons";

interface PaymentRecordItemProps {
  record: {
    id: string
    image: string
    name: string
    points: number
    quantity: number
    status: 'completed' | 'processing'
    orderDate: string
    orderNumber: string
    orderRule: string
    orderChannel: string
    orderValidDate?: string
    applicableStoresName?: string
    applicableStoresNameList?: string[]
    type: 'gift' | 'coupon'
  }
  onRedeem?: (recordId: string, currentStatus: string) => void
}

const PaymentRecordItem: React.FC<PaymentRecordItemProps> = ({ record, onRedeem }) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center p-1 justify-center overflow-hidden bg-white rounded-lg">
      <div className='flex flex-col'>
        <div className={`${styles['font']} mb-1`}>兑换时间: {record.orderDate}</div>
        <AntdImage
          src={record.image}
          width={150}
          height={130}
          fit="cover"
        />
      </div>
      <div className="ml-1 mt-2 flex-1 space-y-1">
        <div className={styles['name-container']}>
          <div className={styles.name}>{record.name}</div>
          <div className={styles['quantity-badge']}>
            <span className={styles['quantity-x']}>×</span>
            <span className={styles['quantity-number']}>{record.quantity}</span>
          </div>
        </div>
        <div className="space-y-1">
          {/* 优惠券类型显示有效期至 */}
          {record.type === 'coupon' && record.orderValidDate && (
            <div className={`${styles['font']}`}>{t('redemptionRecord.validUntil')}: {record.orderValidDate}</div>
          )}
          <div className={`${styles['font']}`}>{t('redemptionRecord.usageRules')}: {record.orderRule}</div>
          <div className={`${styles['font']}`}>{t('redemptionRecord.actualPayment')}: {record.points}</div>
          <div className={`${styles['font']}`}>{t('redemptionRecord.redemptionChannel')}: {record.orderChannel}</div>
          {/* 门店显示逻辑 - 只在数组为空时显示 */}
          {record.applicableStoresNameList && record.applicableStoresNameList.length === 0 && (
            <div className={`${styles['font']}`}>
              {t('productDetail.availableStores')}: {t('product.all')}
            </div>
          )}
          {/* 查看门店详情按钮 */}
          {record.applicableStoresNameList && record.applicableStoresNameList.length > 0 && (
             <div  className={`${styles['font']}`}
              onClick={() => {
                Modal.show({
                  title: t('productDetail.availableStores'),
                  content: (
                    <div>
                      {record.applicableStoresNameList!.map((store, index) => (
                        <div key={index}  className={`${styles['font']}`} style={{ 
                          marginBottom: '8px', 
                          paddingBottom: '8px',
                          borderBottom: '1px solid #e5e5e5'
                        }}>
                          {store}
                        </div>
                      ))}
                    </div>
                  ),
                  closeOnMaskClick: true,
                  showCloseButton: true,
                  closeOnAction: true,
                })
              }}
            >
              {t('productDetail.availableStores')} <RightOutline />
            </div>
          )}
          {/* 周边商城类型显示核销按钮 */}
          {record.type === 'gift' && onRedeem && (
            <div className="flex items-end justify-end h-1 gap-1">
              <div
                className={`${styles['redeemButton']} ${record.status === 'completed' ? styles['disabled'] : ''}`}
                onClick={() => record.status === 'processing' && onRedeem(record.id, record.status)}
              >
                {record.status === 'processing' ? t('redemptionRecord.verifyNow') : t('redemptionRecord.verified')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentRecordItem
