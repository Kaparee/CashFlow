import React, { useState } from 'react'
interface InputProps {
    name: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    id: string;
    divClass?: string;
    labelClass?: string;
    inputClass?: string;
    passwordButtonClass?: string;
    passwordEyeClass?: string;
    error?: string;
}


const Input: React.FC<InputProps> = ({
    name,
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    id,
    divClass,
    labelClass,
    inputClass,
    passwordButtonClass,
    passwordEyeClass,
    error
}) => {
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    return (
        <div className={`mb-3 text-start  ${divClass}`}>
            <label htmlFor={id} className={`fw-bold form-label small ${labelClass}`}>{label}</label>

            <div className='input-group'>
                <input id={id} name={name} className={`form-control py-2 px-3 rounded-5 ${type === 'password' ? 'border-end-0 rounded-end-0' : ''} shadow-sm ${error ? 'is-invalid' : ''} ${inputClass}`} type={type === 'password' ? showPassword ? 'text' : 'password' : type} value={value} placeholder={placeholder} onChange={onChange} onBlur={onBlur} aria-describedby={type === 'password' ? `button-${id}` : ''}/>
                {type === 'password' ? <button className={`btn border rounded-start shadow-sm rounded-5 rounded-start-0 ${error ? 'border-danger' : ''} ${passwordButtonClass}`} type="button" onClick={() => setShowPassword(!showPassword)} id={`button-${id}`}>{showPassword ? <i className={`bi bi-eye-slash ${passwordEyeClass}`}></i> : <i className={`bi bi-eye ${passwordEyeClass}`}></i>}</button> : ''}
            </div>
            {error && <div className="invalid-feedback ps-2 opacity-100">{error}</div>}
        </div>
    );
};

export default Input;