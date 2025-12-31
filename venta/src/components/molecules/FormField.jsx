import React from 'react';
import Input from '../atoms/Input';

const FormField = ({
  type = 'text',
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  description,
  variant = 'default'
}) => {
  return (
    <div className="mb-4">
      <Input
        type={type}
        label={label}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        icon={icon}
        required={required}
        variant={variant}
      />
      
      {description && (
        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
};

export default FormField;