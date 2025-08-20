import React from 'react'
import { Image as AntdImage } from 'antd-mobile'
import styles from './index.module.less'

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
    type: 'gift' | 'coupon'
  }
  onRedeem?: (recordId: string, currentStatus: string) => void
}

const PaymentRecordItem: React.FC<PaymentRecordItemProps> = ({ record, onRedeem }) => {
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
            <div className={`${styles['font']}`}>有效期至: {record.orderValidDate}</div>
          )}
          
          <div className={`${styles['font']}`}>使用规则: {record.orderRule}</div>
          <div className={`${styles['font']}`}>实付: {record.points}</div>
          <div className={`${styles['font']}`}>兑换渠道: {record.orderChannel}</div>
          
          {/* 周边商城类型显示核销按钮 */}
          {record.type === 'gift' && onRedeem && (
            <div className="flex items-end justify-end h-1 gap-1">
              <div
                className={`${styles['redeemButton']} ${record.status === 'completed' ? styles['disabled'] : ''}`}
                onClick={() => record.status === 'processing' && onRedeem(record.id, record.status)}
              >
                {record.status === 'processing' ? '去核销' : '已核销'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentRecordItem
