import React from 'react';
import { Select as AntSelect } from 'antd';
import { cn } from '@/lib/utils';

interface Option {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

interface CustomMultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  size?: 'large' | 'middle' | 'small';
  disabled?: boolean;
  maxTagCount?: number;
}

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className,
  size = 'middle',
  disabled,
  maxTagCount
}) => {
  const handleChange = (val: string[]) => {
    onChange(val);
  };

  return (
    <AntSelect
      mode="multiple"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      options={options}
      className={cn("w-full", className)}
      size={size}
      disabled={disabled}
      maxTagCount={maxTagCount}
      style={{ width: '100%' }}
    />
  );
}; 