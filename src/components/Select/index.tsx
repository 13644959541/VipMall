import React, { useState, useRef, useEffect } from "react";
import { DownOutline, UpOutline } from "antd-mobile-icons";
import styles from './index.module.less'
import { useTranslation } from "react-i18next";

interface SelectProps {
  options?: Array<{ label: string, value: string }>;
  defaultValue?: string;
  defaultLabel?: string;
  onChange?: (value: string) => void;
}
export default function Select({
  options = [],
  defaultLabel = '' ,
  onChange
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('common'); // 这里指定命名空间
  const [selectedValue, setSelectedValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);


  // 设置默认选中第一个选项
  useEffect(() => {
    if (!selectedValue && options.length > 0) {
      setSelectedValue(options[0].value);
    }
  }, [options, selectedValue]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setOpen(false);
    onChange?.(value);
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
        <span>{defaultLabel}</span>
        {open ? <UpOutline /> : <DownOutline />}
      </div>

      {open && (
        <>
          <div className={styles['dropdown-menu']}>
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`${styles['dropdown-item']} ${opt.value === selectedValue ? styles['dropdown-item-selected'] : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
