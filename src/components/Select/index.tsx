import React, { useState, useRef, useEffect } from "react";
import { DownOutline, UpOutline } from "antd-mobile-icons";
import styles from './index.module.less'

interface SelectProps {
  options?: Array<{label: string, value: string}>;
  defaultValue?: string;
  defaultLabel?: string;
  title?: string;
}

export default function Select({ 
  options = [], 
  defaultLabel = '默认排序',
  title = '推荐'
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultLabel);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    const item = options.find((opt) => opt.value === value)!;
    setSelected(item.label);
    setOpen(false);
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles['dropdown-container']} ref={dropdownRef}>
      <div
        className={styles['dropdown-header']}
        onClick={() => setOpen(!open)}
      >
        <span>{selected}</span>
        {open ? <UpOutline /> : <DownOutline />}
      </div>

      {open && (
        <>
          <div className={styles['dropdown-menu']}>
            <div className={`${styles['dropdown-title']}`}>{title}</div>
            {options.map((opt) => (
              <div
                key={opt.value}
                className={styles['dropdown-item']}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                <span className={styles.arrow}>{opt.value.includes("asc") ? "↑" : "↓"}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
