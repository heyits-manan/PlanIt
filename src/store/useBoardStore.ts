// stores/useStore.ts
import { create } from "zustand";

interface Board {
  id: string;
  name: string;
}

interface BoardState {
  boards: Board[];
  addBoard: (name: string) => void;
  deleteBoard: (id: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  addBoard: (name: string) =>
    set((state) => ({
      boards: [...state.boards, { id: Date.now().toString(), name }],
    })),
  deleteBoard: (id: string) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== id),
    })),
}));
