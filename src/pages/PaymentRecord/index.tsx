import React, { useState } from 'react'
import { Image as AntdImage, Toast, Swiper } from 'antd-mobile'
import SwipeTabs from '../../components/SwipeTabs'
import PaymentRecordItem from '../../components/PaymentRecordItem'
import EmptyState from '../../components/EmptyState'
import AlertModal from '../../components/AlertModal'
import EmailVerificationModal from '../../components/EmailVerificationModal'
import { useAuthModel } from '../../model/useAuthModel'
import styles from './index.module.less'
import { useTranslation } from 'react-i18next'

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
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertContent, setAlertContent] = useState({ title: '', message: '' })
  const [currentRecordId, setCurrentRecordId] = useState<string>('')
  const [currentRecordStatus, setCurrentRecordStatus] = useState<string>('')
  const { user } = useAuthModel()
  
   const { t } = useTranslation('common');
  // 标签项配置
  const tabItems = [
    { key: 'gift', title: t('header.gift') },
    { key: 'coupon', title: t('header.coupon') }
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

  const handleChangeStatus = (recordId: string, currentStatus: string) => {
    if (currentStatus === 'completed') return; // 已核销的不再处理

    // 保存当前记录信息
    setCurrentRecordId(recordId)
    setCurrentRecordStatus(currentStatus)

    // 显示确认核销的AlertModal
    setAlertContent({
      title: t('modal.confirmVerification') ,
      message:  t('modal.confirmMerchandiseVerification') 
    })
    setShowAlertModal(true)
  }

  const handleConfirmVerification = () => {
    // 关闭AlertModal并显示EmailVerificationModal
    setShowAlertModal(false)
    setShowEmailModal(true)
  }

  const exchange = async (email: string, code: string) => {
    try {
      // 验证输入
      // if (!email || !email.trim()) {
      //   Toast.show({ icon: 'fail', content: '请输入邮箱地址' });
      //   return;
      // }

      // // 简单的邮箱格式验证
      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // if (!emailRegex.test(email)) {
      //   Toast.show({ icon: 'fail', content: '请输入有效的邮箱地址' });
      //   return;
      // }

      if (!code || !code.trim()) {
        Toast.show({ icon: 'fail', content: t('modal.enterVerificationCode') });
        return;
      }

      // 模拟 API 请求 - 这里应该替换为实际的 API 调用
      // 例如: const response = await api.post('/exchange', { email, code, productId: product?.id, quantity });

      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟成功响应
      const success = Math.random() > 0.3; // 70% 成功率用于演示

      if (success) {
        // 更新记录状态为已核销
        const updatedRecord = records.find(record => record.id === currentRecordId)!
        updatedRecord!.status = 'completed'
        setRecords([...records])
        Toast.show({
          content: t('modal.verificationSuccessful') ,
          position: 'center',
          duration: 3000
        })

      } else {
        throw new Error(t('modal.requestFailed'));
      }
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: t('modal.requestFailed'),
        position: 'center',
        duration: 3000
      });
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
      <EmailVerificationModal
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onConfirm={(email, code) => {
          exchange(email, code)
          setShowEmailModal(false)
        }}
        confirmText= {t('modal.continueVerification')}
        cancelText= {t('modal.cancel')}
        userInfo={user || { email: undefined, mobile: undefined }}
      />
      <AlertModal
        visible={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        onConfirm={handleConfirmVerification}
        title={alertContent.title}
        message={alertContent.message}
        confirmText= {t('modal.confirm')}
        cancelText= {t('modal.cancel')}
      />
    </div>
  )
}

export default PaymentRecordPage
