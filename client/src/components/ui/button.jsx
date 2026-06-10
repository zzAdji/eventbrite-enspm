import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClass = 'ui-btn';
  const variantClass = `ui-btn--${variant}`;
  const stateClass = disabled || loading ? 'is-disabled' : '';
  
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${stateClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="ui-btn-loader"></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
