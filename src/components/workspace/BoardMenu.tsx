import { Pencil, Trash2 } from "lucide-react";

interface BoardMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const BoardMenu = ({ onEdit, onDelete, onClose }: BoardMenuProps) => {
  return (
    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
      >
        <Pencil className="w-4 h-4" />
        <span>Edit Board</span>
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete Board</span>
      </button>
    </div>
  );
};
