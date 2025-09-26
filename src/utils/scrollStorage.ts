// utils/scrollStorage.ts
const SCROLL_STORAGE_KEY = 'homePadScrollData';

export interface ScrollData {
  homePadActiveIndex: number;
  scrollPosition: number;
}

export const getScrollData = (): ScrollData => {
  const data = localStorage.getItem(SCROLL_STORAGE_KEY);
  return data ? JSON.parse(data) : { homePadActiveIndex: 0, scrollPosition: 0 };
};

export const saveScrollData = (data: ScrollData) => {
  localStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(data));
};

// 保存当前激活tab的滚动位置
export const saveScrollPosition = (scrollTop: number) => {
  const data = getScrollData();
  data.scrollPosition = scrollTop;
  saveScrollData(data);
};

// 获取当前激活tab的滚动位置
export const getScrollPosition = (): number => {
  const data = getScrollData();
  return data.scrollPosition
};

// 保存激活的tab索引
export const saveActiveIndex = (index: number) => {
  const data = getScrollData();
  data.homePadActiveIndex = index;
  saveScrollData(data);
};

export const getActiveIndex = (): number => {
  const data = getScrollData();
  return data.homePadActiveIndex;
};
