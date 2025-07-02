


import React from "react";

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  type?: "button" | "submit" | "reset";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  className = "",
  type = "button", 
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={` ${className}`} 
      {...rest}
    >
      {children}
    </button>
  );
};

export default CustomButton;

