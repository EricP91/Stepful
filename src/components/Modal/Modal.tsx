import React from "react";
import "./modal.scss"; // Import modal-specific styles

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode; // Content to display in the modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__overlay" onClick={onClose}></div>
      <div className="modal__content">
        {content}
        <button className="modal__close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;