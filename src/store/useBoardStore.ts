import { create } from "zustand";

interface Card {
  id: string;
  title: string;
}

interface Board {
  id: string;
  name: string;
  cards: Card[];
}

interface BoardStore {
  boards: Board[];
  addBoard: (name: string) => void;
  deleteBoard: (id: string) => void;
  addCard: (boardId: string, title: string) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  editCard: (boardId: string, cardId: string, newTitle: string) => void;
  reorderBoards: (sourceIndex: number, destinationIndex: number) => void;
  moveCard: (
    sourceBoardId: string,
    destinationBoardId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBoardStore = create<BoardStore>((set) => ({
  boards: [
    {
      id: generateId(),
      name: "To Do",
      cards: [
        { id: generateId(), title: "Task 1" },
        { id: generateId(), title: "Task 2" },
      ],
    },
    {
      id: generateId(),
      name: "In Progress",
      cards: [
        { id: generateId(), title: "Task 3" },
        { id: generateId(), title: "Task 4" },
      ],
    },
    {
      id: generateId(),
      name: "Done",
      cards: [{ id: generateId(), title: "Task 5" }],
    },
  ],

  addBoard: (name) =>
    set((state) => ({
      boards: [...state.boards, { id: generateId(), name, cards: [] }],
    })),

  deleteBoard: (id) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== id),
    })),

  addCard: (boardId, title) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              cards: [...board.cards, { id: generateId(), title }],
            }
          : board
      ),
    })),

  deleteCard: (boardId, cardId) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              cards: board.cards.filter((card) => card.id !== cardId),
            }
          : board
      ),
    })),

  editCard: (boardId, cardId, newTitle) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              cards: board.cards.map((card) =>
                card.id === cardId ? { ...card, title: newTitle } : card
              ),
            }
          : board
      ),
    })),

  reorderBoards: (sourceIndex, destinationIndex) =>
    set((state) => {
      const boards = Array.from(state.boards);
      const [moved] = boards.splice(sourceIndex, 1);
      boards.splice(destinationIndex, 0, moved);
      return { boards };
    }),

  moveCard: (
    sourceBoardId,
    destinationBoardId,
    sourceIndex,
    destinationIndex
  ) =>
    set((state) => {
      const sourceBoard = state.boards.find(
        (board) => board.id === sourceBoardId
      );
      const destinationBoard = state.boards.find(
        (board) => board.id === destinationBoardId
      );

      if (!sourceBoard || !destinationBoard) return state;

      const [movedCard] = sourceBoard.cards.splice(sourceIndex, 1);
      destinationBoard.cards.splice(destinationIndex, 0, movedCard);

      return {
        boards: [...state.boards],
      };
    }),
}));
