import React, { memo, useState } from 'react'
import { Tabs } from 'antd-mobile'
import styles from './index.module.less'

const tabItems = [
  { key: 'first', title: '首页' },
  { key: 'second', title: '代金卷专区' },
  { key: 'third', title: '菜品卷专区' },
  { key: 'fourth', title: '周边礼品' },
]

const HomeMobile = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className={styles['mobile-home']}>
      <Tabs
        activeKey={tabItems[activeIndex].key}
        onChange={key => {
          const index = tabItems.findIndex(item => item.key === key)
          setActiveIndex(index)
        }}
      >
        {tabItems.map(item => (
          <Tabs.Tab title={item.title} key={item.key} />
        ))}
      </Tabs>
      
      <div className={styles.content} style={{ color: 'yellowgreen' }}>
        {activeIndex === 0 && 'Mobile首页内容'}
        {activeIndex === 1 && 'Mobile代金卷专区'}
        {activeIndex === 2 && 'Mobile菜品卷专区'} 
        {activeIndex === 3 && 'Mobile周边礼品'}
      </div>
    </div>
  )
}

export default memo(HomeMobile)
