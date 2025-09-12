import { useState, useEffect } from 'react'
import { Image as AntdImage, Toast, Swiper } from 'antd-mobile'
import SwipeTabs from '../../components/SwipeTabs'
import PaymentRecordItem from '../../components/PaymentRecordItem'
import EmptyState from '../../components/EmptyState'
import AlertModal from '../../components/AlertModal'
import EmailVerificationModal from '../../components/EmailVerificationModal'
import { useAuthModel } from '../../model/useAuthModel'
import { shouldShowVerification } from '../../utils/bridge'
import { useTranslation } from 'react-i18next'
import { getOrderRequest, OrderItemRecordResponse } from '../../services/orderSerivce'
import { submitOrderRequest } from '../../services/orderSerivce'
import i18n from '@/locales'

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
    { key: 'gift', title: t('home.merchandise') },
    { key: 'coupon', title: t('redemptionRecord.coupon') }
  ]

  const [records, setRecords] = useState<PaymentRecordItem[]>([])
  const [giftRecords, setGiftRecords] = useState<OrderItemRecordResponse[]>([])
  const [couponRecords, setCouponRecords] = useState<OrderItemRecordResponse[]>([])
  const [loading, setLoading] = useState(true)

  // 加载订单数据
  useEffect(() => {
    const loadOrderData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // 加载礼品订单
        const giftData = await getOrderRequest({
          language: i18n.language,
          memberId: user.customerKey || '',
          productType: 0, // 0-周边礼品
          storeId: user.shopNo || ''
        });
        setGiftRecords(giftData);

        // 加载优惠券订单
        const couponData = await getOrderRequest({
          language: i18n.language,
          memberId: user.customerKey || '',
          productType: 1, // 1-代金券
          storeId: user.shopNo || ''
        });
        setCouponRecords(couponData);

      } catch (error) {
        console.error('加载订单数据失败:', error);
        Toast.show({ icon: 'fail', content: t('modal.requestFailed') });
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [user, t]);

  // 转换API数据到组件需要的格式
  const convertToPaymentRecord = (item: OrderItemRecordResponse): PaymentRecordItem => ({
    id: item.itemId?.toString() || '',
    image: item.productImage || '/hot-pot-banner.jpg',
    name: item.productName || '',
    points: item.totalPoints || 0,
    quantity: item.quantity || 1,
    status: item.verificationStatus === '1' ? 'completed' : 'processing',
    orderDate: item.orderTime || '',
    orderNumber: item.orderNo || '',
    orderRule: item.exclusionText || '',
    orderChannel: item.terminalType || 'App',
    orderValidDate: item.validityPeriod,
    type: item.productType === '1' ? 'coupon' : 'gift'
  });

  const convertedGiftRecords = giftRecords.map(convertToPaymentRecord);
  const convertedCouponRecords = couponRecords.map(convertToPaymentRecord);

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
    // 关闭AlertModal
    setShowAlertModal(false)
    
    // 检查是否需要验证
    if (user && shouldShowVerification(user.loginStyle, user.verifyType, 'verification')) {
      setShowEmailModal(true)
    } else {
      // 不需要验证，直接执行核销操作（跳过验证码检查）
      exchange('', '', true)
    }
  }

  const exchange = async (email: string, code: string, skipCodeCheck = false) => {
    try {
      if (!skipCodeCheck && (!code || !code.trim())) {
        Toast.show({ icon: 'fail', content: t('modal.enterVerificationCode') });
        return;
      }

      // 调用核销API - 使用短信验证码核销
      const requestData = {
        itemId: parseInt(currentRecordId), // 订单商品ID
      };
      await submitOrderRequest(requestData);

      // 更新记录状态为已核销
      const updatedRecord = records.find(record => record.id === currentRecordId)!
      updatedRecord!.status = 'completed'
      setRecords([...records])
      
      Toast.show({
        content: t('modal.verificationSuccessful'),
        position: 'center',
        duration: 3000
      });

    } catch (error) {
      console.error('核销失败:', error);
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
            {loading ? (
              // 加载中状态
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : convertedGiftRecords.length === 0 ? (
              // 空状态
              <EmptyState message={t('redemptionRecord.noItemsRedeemed')} />
            ) : (
              // 礼品记录列表
              <div className="p-1 space-y-1 pb-10">
                {convertedGiftRecords.map(record => (
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
            {loading ? (
              // 加载中状态
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : convertedCouponRecords.length === 0 ? (
              // 空状态
              <EmptyState message={t('redemptionRecord.noItemsRedeemed')} />
            ) : (
              // 优惠券记录列表
              <div className="p-1 space-y-1 pb-10">
                {convertedCouponRecords.map(record => (
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
        verifyType="9" // 9表示核销
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
