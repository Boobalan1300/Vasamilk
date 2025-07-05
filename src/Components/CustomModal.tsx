import { Modal, type ModalProps } from "antd";
import React from "react";

interface CustomModalProps extends ModalProps {
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ children, ...props }) => {
  return (
    <Modal
      centered
      {...props}
    
      className="custom-modal"
     
      afterClose={() => {
        // optional: add reset logic here if needed
      }}
      style={{ borderRadius: 8 }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
  // AntD v5: Use className to style modal body instead of bodyStyle
   // AntD v5: Use afterClose to clear content instead of destroyOnClose