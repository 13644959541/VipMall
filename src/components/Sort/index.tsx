import React, { useState } from "react";
import { UpOutline, DownOutline } from "antd-mobile-icons";
import styles from './index.module.less';

interface SortProps {
  defaultLabel: string;
  pointsLabel: string;
  salesLabel: string;
  onChange?: (value: string) => void;
}

export default function Sort({
  defaultLabel,
  pointsLabel,
  salesLabel,
  onChange
}: SortProps) {
  const [sortField, setSortField] = useState('default'); // 当前排序字段
  const [sortOrder, setSortOrder] = useState(''); // asc / desc

  const handleSort = (field: string) => {
    let order = 'asc';
    if (field === sortField) {
      order = sortOrder === 'asc' ? 'desc' : 'asc'; // 切换顺序
    }

    setSortField(field);
    setSortOrder(order);
    // 传递给父组件的格式：field-order (如 "points-asc")
    onChange?.(field === 'default' ? 'default' : `${field}-${order}`);
  };

  const renderArrows = (field: string) => (
    <span className={`${styles['sort-arrows']} ${sortField === field ? `${styles['active']} ${styles[sortOrder]}` : ''
      }`}>
      <UpOutline style={{ display: 'none' }} />
      <DownOutline style={{ display: 'none' }} />
    </span>
  );

  return (
    <div className={`${styles['sort-container']} flex items-center justify-between `}>
      <div
        className={`${styles['sort-item']} ${
          sortField === "" || sortField === "default" ? styles['active'] : ''
        }`}
        onClick={() => handleSort("default")}
      >
        {defaultLabel}
      </div>
      <div
        className={`${styles['sort-item']} ${sortField === "sales" ? styles['active'] : ''
          }`}
        onClick={() => handleSort("sales")}
      >
        {salesLabel}
        {renderArrows("sales")}
      </div>
      <div
        className={`${styles['sort-item']} ${sortField === "points" ? styles['active'] : ''
          }`}
        onClick={() => handleSort("points")}
      >
        {pointsLabel}
        {renderArrows("points")}
      </div>
    </div>
  );
}
