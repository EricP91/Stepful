import React from "react";
import "./modal.scss"; // Import modal-specific styles

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  content: React.ReactNode; // Content to display in the modal
}

const Modal: React.FC<IModalProps> = ({
  isOpen,
  onClose,
  content,
  onConfirm,
  confirmText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__overlay" onClick={onClose}></div>
      <div className="modal__content">
        {content}

        <div className="modal__actions">
          {!!confirmText && (
            <button className="modal__button" onClick={onConfirm}>
              {confirmText}
            </button>
          )}
          <button className="modal__button modal__button--close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
