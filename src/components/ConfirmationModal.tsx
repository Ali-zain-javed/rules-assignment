import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  type?: 'cancel' | 'delete';
}

const ConfirmModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  type = 'delete',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <p>{message}</p>
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            No
          </button>
          <button
            className={`${
              type == 'delete' ? 'bg-red-500' : 'bg-gray-500'
            } text-white px-4 py-2 rounded`}
            onClick={onConfirm}
          >
            {type == 'delete' ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmModal;
