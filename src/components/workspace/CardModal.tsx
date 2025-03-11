// components/workspace/CardModal.tsx
import React from "react";
import { Modal } from "./Modal";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: { title: string; description: string };
  setCardData: React.Dispatch<
    React.SetStateAction<{ title: string; description: string }>
  >;
  onSubmit: () => void;
  isEditing: boolean;
}

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  cardData,
  setCardData,
  onSubmit,
  isEditing,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Card" : "Create New Card"}
      description="Add details about your task or idea."
    >
      <div>
        <input
          type="text"
          value={cardData.title}
          onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
          placeholder="Card title"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
        />
        <textarea
          value={cardData.description}
          onChange={(e) =>
            setCardData({ ...cardData, description: e.target.value })
          }
          placeholder="Add a more detailed description..."
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 resize-none"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? "Update Card" : "Create Card"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
