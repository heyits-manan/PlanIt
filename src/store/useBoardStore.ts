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

interface BoardState {
  boards: Board[];
  addBoard: (name: string) => void;
  deleteBoard: (id: string) => void;
  reorderBoards: (startIndex: number, endIndex: number) => void;
  addCard: (boardId: string, title: string) => void;
  deleteCard: (boardId: string, cardId: string) => void;

  moveCard: (
    sourceBoardId: string,
    destinationBoardId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  addBoard: (name) =>
    set((state) => ({
      boards: [...state.boards, { id: Date.now().toString(), name, cards: [] }],
    })),
  deleteBoard: (id) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== id),
    })),
  reorderBoards: (startIndex, endIndex) =>
    set((state) => {
      const boards = Array.from(state.boards);
      const [removed] = boards.splice(startIndex, 1);
      boards.splice(endIndex, 0, removed);
      return { boards };
    }),
  addCard: (boardId, title) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              cards: [...board.cards, { id: Date.now().toString(), title }],
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

      const sourceCards = Array.from(sourceBoard.cards);

      if (sourceBoardId === destinationBoardId) {
        const [movedCard] = sourceCards.splice(sourceIndex, 1);
        sourceCards.splice(destinationIndex, 0, movedCard);

        return {
          boards: state.boards.map((board) =>
            board.id === sourceBoardId
              ? { ...board, cards: sourceCards }
              : board
          ),
        };
      }

      const [movedCard] = sourceCards.splice(sourceIndex, 1);
      const destinationCards = Array.from(destinationBoard.cards);
      destinationCards.splice(destinationIndex, 0, movedCard);

      return {
        boards: state.boards.map((board) => {
          if (board.id === sourceBoardId)
            return { ...board, cards: sourceCards };
          if (board.id === destinationBoardId)
            return { ...board, cards: destinationCards };
          return board;
        }),
      };
    }),
}));
