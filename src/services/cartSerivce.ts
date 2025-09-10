import { get , post } from '../plugins/request';

export const cartAddOrUpdate = async (data: {
    memberId: string;
    storeId: string;
    countryCode: string;
    products: Array<{
    productType: number;
    productId: string;
    quantity: number;
    isSelected: boolean;
    templateId?:string;
  }>;
}): Promise<any[]> => {
  try {
    const response = await post('/front/cart/addOrUpdate', data);
    return response.records || [];
  } catch (error) {
    console.error('保存购物车失败:', error);
    throw error;
  }
};

export const getCartDetails = async (params: {
  memberId: string;
  countryCode: string;
  language: string;
  storeId: string;
  localLevel: string;
}): Promise<any[]> => {
  try {
    const response = await get('/front/cart/detail', params);
    return response.items || [];
  } catch (error) {
    console.error('获取购物车详情失败:', error);
    throw error;
  }
};
