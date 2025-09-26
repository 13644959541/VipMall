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
  applicableStoresName?: string,
  applicableStoresNameList?: string[],
  storeName?: string,
  type?:string
  categoryType?: number,
  validityPeriod?: string
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
          categoryType: 0, // 0-周边礼品
          storeId: user.shopNo || '',
          countryCode: user.country || ''
        });
        setGiftRecords(giftData);
        
        // 加载优惠券订单
        const couponData = await getOrderRequest({
          language: i18n.language,
          memberId: user.customerKey || '',
          categoryType: 1, // 1-代金券
          storeId: user.shopNo || '',
          countryCode: user.country || ''
        });
        setCouponRecords(couponData);

      } catch (error) {
        console.error('加载订单数据失败:', error);
        Toast.show({
          content: t('modal.requestFailed'),
          position: 'center',
          duration: 3000
        })
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
    applicableStoresName: item.applicableStoresName || '',
    applicableStoresNameList: item.applicableStoresNameList || [],
    storeName: item.storeName || '',
    type: item.productType  || "0",
    categoryType: item.categoryType || 0,
    validityPeriod: item.validityPeriod || ''
  });

  const convertedGiftRecords = giftRecords.map(convertToPaymentRecord);
  const convertedCouponRecords = couponRecords.map(convertToPaymentRecord);

  const handleChangeStatus = (recordId: string, currentStatus: string) => {
    if (currentStatus === 'completed') return;

    setCurrentRecordId(recordId)
    setCurrentRecordStatus(currentStatus)

    setAlertContent({
      title: t('modal.confirmVerification') ,
      message:  t('modal.confirmMerchandiseVerification') 
    })
    setShowAlertModal(true)
  }

  const handleConfirmVerification = () => {
    setShowAlertModal(false)
    
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
        Toast.show({ content: t('modal.enterVerificationCode') });
        return;
      }

      const requestData = {
        itemId: parseInt(currentRecordId),
      };
      await submitOrderRequest(requestData);

      const updatedGiftRecords = giftRecords.map(record => 
        record.itemId?.toString() === currentRecordId 
          ? { ...record, verificationStatus: '1' }
          : record
      );
      setGiftRecords(updatedGiftRecords);
        
      Toast.show({
        content: t('modal.verificationSuccessful'),
        position: 'center',
        duration: 3000
      });

    } catch (error) {
      console.error('核销失败:', error);
      Toast.show({
        content: t('modal.requestFailed'),
        position: 'center',
        duration: 3000
      });
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 w-full h-full overflow-y-auto bg-[#F4F4F5]">
        <SwipeTabs
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          tabItems={tabItems}
        >
          {/* 周边礼品标签页 */}
          <Swiper.Item key="gift">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : convertedGiftRecords.length === 0 ? (
              // 空状态
              <EmptyState message={t('redemptionRecord.noItemsRedeemed')} />
            ) : (
              <div className="p-1 space-y-1 pb-10">
                {convertedGiftRecords.map((record ,index) => (
                  <PaymentRecordItem
                    key={`${index}`}
                    record={record}
                    onRedeem={handleChangeStatus}
                  />
                ))}
              </div>
            )}
          </Swiper.Item>

          <Swiper.Item key="coupon">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : convertedCouponRecords.length === 0 ? (
              // 空状态
              <EmptyState message={t('redemptionRecord.noItemsRedeemed')} />
            ) : (
              // 优惠券记录列表
              <div className="p-1 space-y-1 pb-10">
                {convertedCouponRecords.map((record ,index) => (
                  <PaymentRecordItem
                    key={`${index}`}
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
        verifyType="9" // 9核销
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
