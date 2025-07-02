import { Modal, type ModalProps } from "antd";

interface CustomModalProps extends ModalProps {
  children: React.ReactNode;
}

const CustomModal = ({ children, ...props }: CustomModalProps) => {
  return (
    <Modal
      centered
      destroyOnClose
      {...props}
      bodyStyle={{ padding: "24px" }}
      style={{ borderRadius: 8 }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
