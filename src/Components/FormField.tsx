
import '../Styles/FromFields.css'

import { Input } from 'antd';

type FormFieldProps = {
  label?: string;
  type?: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
}) => {
  return (
    <>
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <Input
          id={name}
           type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
           placeholder={placeholder}
          //  className='p-2'
            status={touched && error ? "error" : undefined}
        />
        {touched && error && (
            <div className="error">{error}</div>
        )}
      </div>
    </>
  );
};

export default FormField;
