import React from 'react'
import { Image as AntdImage, Dialog, Button } from 'antd-mobile'
import styles from './index.module.less'
import { useTranslation } from 'react-i18next'
import { RightOutline } from "antd-mobile-icons";
import { formatDateTime } from '@/utils';

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
    storeName?: string,
    orderType?: string
    type?: string,
    categoryType?: number,
    validityPeriod?: string
  }
  onRedeem?: (recordId: string, currentStatus: string) => void
}

const PaymentRecordItem: React.FC<PaymentRecordItemProps> = ({ record, onRedeem }) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col items-left p-1 justify-center overflow-hidden bg-white rounded-[16px]">
      <div className={`${styles['font']} mb-1`}>{t('redemptionRecord.redemptionTime')}: {formatDateTime(record.orderDate)}</div>

      {/* 整个内容区域使用相对定位 */}
      <div className="relative flex flex-row w-full">
        {/* 图片区域 */}
        <AntdImage
          src={record.image}
          width={158}
          height={133}
          fit="cover"
          className="rounded-[16px]"
        />

        <div className="ml-1 flex-1" style={{ minHeight: '133px' }}>
          <div className={styles.name}>{record.name}</div>
          <div className="">
            {record.type !== "0" && record.validityPeriod && (
              <div className={`${styles['font']}`}>{t('productDetail.validityPeriod')}: {record.validityPeriod}</div>
            )}
            {record.orderRule && record.orderRule.trim() !== '' && (
              <div className={`${styles['font']}`}>{t('redemptionRecord.usageRules')}: {record.orderRule}</div>
            )}

            <div className={`${styles['font']}`}>{t('redemptionRecord.actualPayment')}: {record.points} {t('product.points')}</div>
            <div className={`${styles['font']}`}>{t('redemptionRecord.redemptionChannel')}: {record.storeName}</div>
            {record.applicableStoresNameList && record.applicableStoresNameList.length === 0 && (
              <div className={`${styles['font']}`}>
                {t('productDetail.availableStores')}: {t('supplementary.allStores')}
              </div>
            )}
            {record.applicableStoresNameList && record.applicableStoresNameList.length > 0 && (
              <div className={`${styles['font']}`}
                onClick={() => {
                  Modal.show({
                    title: t('productDetail.availableStores'),
                    content: (
                      <div>
                        {record.applicableStoresNameList!.map((store, index) => (
                          <div key={index} className={`${styles['font']}`} style={{
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
          </div>
        </div>

        {/* 数量徽章 - 绝对定位在卡片最右边，与名称顶部对齐 */}
        <div className="absolute right-0 top-0"> {/* 调整位置到卡片右上角 */}
          <div className={styles['quantity-badge']}>
            <span className={styles['quantity-x']}>×</span>
            <span className={styles['quantity-number']}>{record.quantity}</span>
          </div>
        </div>
        {record.categoryType === 0 && onRedeem && (
          <div className="absolute right-0 bottom-0">
            <div
              className={`${styles['redeemButton']} ${record.type === '1' || record.status.toLowerCase() === 'completed' ? styles['disabled'] : ''
                }`}
              onClick={() => {
                if (record.type === '0' && record.status.toLowerCase() === 'processing') {
                  onRedeem(record.id, record.status);
                }
              }}
            >
              {record.type === '1' || record.status.toLowerCase() === 'completed'
                ? t('cart.done')
                : t('redemptionRecord.verifyNow')
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentRecordItem
