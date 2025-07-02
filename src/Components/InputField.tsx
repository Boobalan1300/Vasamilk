

import '../Styles/FromFields.css'
import { Input, InputNumber } from 'antd';

type FormFieldProps = {
  label?: string;
  type?: string;
  name: string;
  value: any;
  placeholder: string;
  onChange: (e: any) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
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
    <div style={{ marginBottom: 16 }}>
      {label && <label htmlFor={name} style={{ fontWeight: 500 }}>{label}</label>}
      {type === "number" ? (
        <InputNumber
          id={name}
          name={name}
          value={value}
          onChange={(val) => onChange({ target: { name, value: val ?? 0 } })}
          onBlur={onBlur}
          style={{ width: "100%" }}
          min={0}
          max={9999}
          placeholder={placeholder}
          status={touched && error ? "error" : undefined}
        />
      ) : (
        <Input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          status={touched && error ? "error" : undefined}
        />
      )}
      {touched && error && (
        <div className="error">{error}</div>
      )}
    </div>
  );
};

export default FormField;
