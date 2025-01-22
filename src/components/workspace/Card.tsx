import { Pencil, Trash2 } from "lucide-react";
import { Card as CardType } from "../../types";

interface CardProps {
  card: CardType;
  isEditing: boolean;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: number) => void;
  onUpdate: (cardId: number) => void;
  onCancel: () => void;
  editingCard: CardType | null;
  setEditingCard: (card: CardType | null) => void;
}

export const Card = ({
  card,
  isEditing,
  onEdit,
  onDelete,
  onUpdate,
  onCancel,
  editingCard,
  setEditingCard,
}: CardProps) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={editingCard?.title}
          onChange={(e) => setEditingCard({ ...card, title: e.target.value })}
          className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <textarea
          value={editingCard?.description}
          onChange={(e) =>
            setEditingCard({ ...card, description: e.target.value })
          }
          className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          rows={3}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(card.id)}
            className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-gray-900">{card.title}</h4>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(card)}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {card.description && (
        <p className="mt-2 text-sm text-gray-600">{card.description}</p>
      )}
    </div>
  );
};
