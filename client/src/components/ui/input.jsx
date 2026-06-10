import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  id,
  type = 'text',
  error,
  helperText,
  className = '',
  as = 'input',
  options = [],
  ...props
}, ref) => {
  const Component = as;
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={`ui-input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ui-input-label">
          {label}
        </label>
      )}
      
      <div className="ui-input-container">
        {as === 'select' ? (
          <select
            id={inputId}
            ref={ref}
            className={`ui-input-field ${hasError ? 'is-error' : ''}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <Component
            id={inputId}
            ref={ref}
            type={as === 'input' ? type : undefined}
            className={`ui-input-field ${as === 'textarea' ? 'is-textarea' : ''} ${hasError ? 'is-error' : ''}`}
            {...props}
          />
        )}
      </div>

      {(error || helperText) && (
        <p className={`ui-input-helper ${hasError ? 'is-error' : ''}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
