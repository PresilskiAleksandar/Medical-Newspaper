import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, error, required, name, className = '' }) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="form-label">{label}{required && ' *'}</label>}
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`form-input form-textarea ${error ? 'input-error' : ''}`}
          rows={5}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`form-input ${error ? 'input-error' : ''}`}
        />
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default Input;
