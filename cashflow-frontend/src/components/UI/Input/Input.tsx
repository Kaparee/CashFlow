import React from 'react'

interface InputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    id: string;
    divClass?: string;
    labelClass?: string;
    inputClass?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    id,
    divClass,
    labelClass,
    inputClass,
    error
}) => {
    return (
        <div className={`mb-3 text-start  ${divClass}`}>
            <label htmlFor={id} className={`fw-bold form-label small ${labelClass}`}>{label}</label>

            <input id={id} className={`form-control py-2 px-3 rounded-5 shadow-sm ${error ? 'is-invalid' : ''} ${inputClass}`} type={type} value={value} placeholder={placeholder} onChange={onChange} />

            {error && <div className="invalid-feedback ps-2">{error}</div>}
        </div>
    );
};

export default Input;