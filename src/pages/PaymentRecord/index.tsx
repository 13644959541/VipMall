import React, { useState } from 'react'
import { Image as AntdImage, Toast, Swiper } from 'antd-mobile'
import SwipeTabs from '../../components/SwipeTabs'
import PaymentRecordItem from '../../components/PaymentRecordItem'
import EmptyState from '../../components/EmptyState'
import styles from './index.module.less'

interface PaymentRecordItem {
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
  type: 'gift' | 'coupon' // 添加类型字段区分礼品和优惠券
}

const PaymentRecordPage = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  
  // 标签项配置
  const tabItems = [
    { key: 'gift', title: '周边礼品' },
    { key: 'coupon', title: '优惠券' }
  ]

  // 模拟兑换记录数据
  const initialPaymentRecords: PaymentRecordItem[] = [
    {
      id: '1',
      image: '/hot-pot-banner.png',
      name: '海底捞经典牛油火锅底料',
      points: 1200,
      quantity: 1,
      status: 'completed',
      orderDate: '2024-01-15 14:30',
      orderNumber: 'ORD20240115001',
      type: 'gift',
      orderRule: '兑换规则很长的描述...很长的描述...',
      orderChannel: '门店',
    },
    {
      id: '2',
      image: '/hot-pot-banner.png',
      name: '海底捞特色蘸料套装',
      points: 800,
      quantity: 2,
      status: 'processing',
      orderDate: '2024-01-16 10:15',
      orderNumber: 'ORD20240116002',
      type: 'gift',
      orderRule: '兑换规则很长的描述...',
      orderChannel: '门店'
    },
    {
      id: '3',
      image: '/hot-pot-banner.png',
      name: '海底捞特色套装',
      points: 1500,
      quantity: 1,
      orderDate: '2024-01-14 16:45',
      orderNumber: 'ORD20240114003',
      status: 'processing',
      type: 'gift',
      orderRule: '兑换规则很长的描述...',
      orderChannel: '门店'
    },
    {
      id: '4',
      image: '/满减券-双字号.png',
      name: '5元满减券',
      points: 2000,
      quantity: 1,
      status: 'completed',
      orderDate: '2024-01-17 09:20',
      orderNumber: 'ORD20240117004',
      type: 'coupon',
      orderRule: '兑换规则很长的描述...',
      orderChannel: 'App',
      orderValidDate: '2025-01-31'
    },
    {
      id: '5',
      image: '/代金券-双字号.png',
      name: '5元代金券',
      points: 2500,
      quantity: 2,
      status: 'processing',
      orderDate: '2024-01-18 15:40',
      orderNumber: 'ORD20240118005',
      type: 'coupon',
      orderRule: '兑换规则很长的描述...',
      orderChannel: 'App',
      orderValidDate: '2027-02-15'
    }
  ]

  const [records, setRecords] = useState<PaymentRecordItem[]>(initialPaymentRecords)

  // 分别过滤礼品和优惠券记录
  const giftRecords = records.filter(record => record.type === 'gift')
  const couponRecords = records.filter(record => record.type === 'coupon')

  const handleChangeStatus = async (recordId: string, currentStatus: string) => {
    if (currentStatus === 'completed') return; // 已核销的不再处理
    
    try {
      Toast.show('核销中...')
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新状态
      setRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === recordId ? { ...record, status: 'completed' } : record
        )
      )
      
      Toast.show('核销成功')
    } catch (error) {
      Toast.show('核销失败')
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 w-full h-full overflow-y-auto bg-gray-50">
        <SwipeTabs
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          tabItems={tabItems}
        >
          {/* 周边礼品标签页 */}
          <Swiper.Item key="gift">
            {/* 礼品空状态 */}
            {giftRecords.length === 0 && (
              <EmptyState message="您尚未兑换任何周边礼品" />
            )}

            {/* 礼品记录列表 */}
            {giftRecords.length > 0 && (
              <div className="p-1 space-y-1">
                {giftRecords.map(record => (
                  <PaymentRecordItem
                    key={record.id}
                    record={record}
                    onRedeem={handleChangeStatus}
                  />
                ))}
              </div>
            )}
          </Swiper.Item>

          {/* 优惠券标签页 */}
          <Swiper.Item key="coupon">
            {/* 优惠券空状态 */}
            {couponRecords.length === 0 && (
              <EmptyState message="您尚未兑换任何优惠券" />
            )}

            {/* 优惠券记录列表 */}
            {couponRecords.length > 0 && (
              <div className="p-1 space-y-1">
                {couponRecords.map(record => (
                  <PaymentRecordItem
                    key={record.id}
                    record={record}
                  />
                ))}
              </div>
            )}
          </Swiper.Item>
        </SwipeTabs>
      </div>
    </div>
  )
}

export default PaymentRecordPage
