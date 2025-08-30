import React from 'react';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  size?: InputSize;
}

const Input = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  size = 'md',
  ...props 
}: InputProps) => {
  const baseStyles = 'border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  
  const sizes: Record<InputSize, string> = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-3 text-lg'
  };
  
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${baseStyles} ${sizes[size]} ${className}`}
      {...props}
    />
  );
};

export default Input;