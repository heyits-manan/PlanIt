import { Plus, MoreVertical, Check, X } from "lucide-react";
import { Board as BoardType, Card as CardType } from "../../types";
import { Card } from "./Card";
import { BoardMenu } from "./BoardMenu";

interface BoardProps {
  board: BoardType;
  isEditing: boolean;
  editingBoard: BoardType | null;
  openMenuId: number | null;
  onAddCard: () => void;
  onToggleMenu: (boardId: number, event: React.MouseEvent) => void;
  onUpdateBoard: (boardId: number) => void;
  onCancelEdit: () => void;
  onDeleteBoard: (boardId: number) => void;
  onEditBoard: (board: BoardType) => void;
  setEditingBoard: (board: BoardType | null) => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (cardId: number, boardId: number) => void;
  onUpdateCard: (cardId: number, boardId: number) => void;
  editingCard: CardType | null;
  setEditingCard: (card: CardType | null) => void;
}

export const Board = ({
  board,
  isEditing,
  editingBoard,
  openMenuId,
  onAddCard,
  onToggleMenu,
  onUpdateBoard,
  onCancelEdit,
  onDeleteBoard,
  onEditBoard,
  setEditingBoard,
  onEditCard,
  onDeleteCard,
  onUpdateCard,
  editingCard,
  setEditingCard,
}: BoardProps) => {
  return (
    <div className="flex-shrink-0 w-80 bg-gray-100 rounded-xl overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={editingBoard?.name}
                onChange={(e) =>
                  setEditingBoard({
                    ...editingBoard!,
                    name: e.target.value,
                  })
                }
                className="flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={() => onUpdateBoard(board.id)}
                className="p-1 rounded-md hover:bg-green-100 text-green-600"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-1 rounded-md hover:bg-red-100 text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <h3 className="font-semibold text-gray-900">{board.name}</h3>
          )}
          <div className="flex items-center space-x-1">
            <button
              onClick={onAddCard}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-blue-600"
              title="Add new card"
            >
              <Plus className="w-5 h-5" />
            </button>
            <div className="relative board-menu">
              <button
                onClick={(e) => onToggleMenu(board.id, e)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
                title="More options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {openMenuId === board.id && (
                <BoardMenu
                  onEdit={() => onEditBoard(board)}
                  onDelete={() => onDeleteBoard(board.id)}
                  onClose={() => onToggleMenu(board.id, {} as React.MouseEvent)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {board.cards && board.cards.length > 0 ? (
          board.cards.map((card) => (
            <div
              key={card.id}
              className="group bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <Card
                card={card}
                isEditing={editingCard?.id === card.id}
                onEdit={onEditCard}
                onDelete={(cardId) => onDeleteCard(cardId, board.id)}
                onUpdate={(cardId) => onUpdateCard(cardId, board.id)}
                onCancel={() => setEditingCard(null)}
                editingCard={editingCard}
                setEditingCard={setEditingCard}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No cards yet</p>
            <button
              onClick={onAddCard}
              className="mt-2 text-blue-600 text-sm hover:text-blue-700"
            >
              Add a card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
