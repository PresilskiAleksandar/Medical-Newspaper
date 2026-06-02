import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, className = '' }) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
