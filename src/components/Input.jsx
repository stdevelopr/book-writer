const Input = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  size = 'md',
  ...props 
}) => {
  const baseStyles = 'border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  
  const sizes = {
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