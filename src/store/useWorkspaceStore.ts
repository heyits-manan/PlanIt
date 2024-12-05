import { create } from "zustand";
import { persist } from "zustand/middleware";

function generateUniqueId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

interface Board {
  id: string;
  name: string;
  cards: { id: string; title: string }[];
}

interface Workspace {
  id: string;
  name: string;
  boards: Board[];
}

interface WorkspaceStore {
  workspaces: Workspace[];
  createWorkspace: (name: string) => void;
  deleteWorkspace: (workspaceId: string) => void;
  renameWorkspace: (workspaceId: string, newName: string) => void;
  createBoard: (workspaceId: string, boardName: string) => void;
  deleteBoard: (workspaceId: string, boardId: string) => void;
  reorderBoards: (
    workspaceId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  createCard: (workspaceId: string, boardId: string, cardTitle: string) => void;
  deleteCard: (workspaceId: string, boardId: string, cardId: string) => void;
  editCard: (
    workspaceId: string,
    boardId: string,
    cardId: string,
    newTitle: string
  ) => void;
  moveCard: (
    sourceWorkspaceId: string,
    destWorkspaceId: string,
    sourceBoardId: string,
    destBoardId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  addCard: (workspaceId: string, boardId: string, cardTitle: string) => void;
  addBoard: (boardName: string, workspaceId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [],

      createWorkspace: (name) =>
        set((state) => ({
          workspaces: [
            ...state.workspaces,
            {
              id: generateUniqueId(),
              name,
              boards: [],
            },
          ],
        })),

      deleteWorkspace: (workspaceId) =>
        set((state) => ({
          workspaces: state.workspaces.filter((w) => w.id !== workspaceId),
        })),

      renameWorkspace: (workspaceId, newName) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId ? { ...w, name: newName } : w
          ),
        })),

      createBoard: (workspaceId, boardName) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  boards: [
                    ...w.boards,
                    {
                      id: generateUniqueId(),
                      name: boardName,
                      cards: [],
                    },
                  ],
                }
              : w
          ),
        })),

      deleteBoard: (workspaceId, boardId) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  boards: w.boards.filter((b) => b.id !== boardId),
                }
              : w
          ),
        })),

      reorderBoards: (workspaceId, sourceIndex, destIndex) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  boards: moveInArray(w.boards, sourceIndex, destIndex),
                }
              : w
          ),
        })),

      createCard: (workspaceId, boardId, cardTitle) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  boards: w.boards.map((b) =>
                    b.id === boardId
                      ? {
                          ...b,
                          cards: [
                            ...b.cards,
                            {
                              id: generateUniqueId(),
                              title: cardTitle,
                            },
                          ],
                        }
                      : b
                  ),
                }
              : w
          ),
        })),

      deleteCard: (workspaceId, boardId, cardId) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  boards: w.boards.map((b) =>
                    b.id === boardId
                      ? {
                          ...b,
                          cards: b.cards.filter((c) => c.id !== cardId),
                        }
                      : b
                  ),
                }
              : w
          ),
        })),

      editCard: (workspaceId, boardId, cardId, newTitle) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  boards: w.boards.map((b) =>
                    b.id === boardId
                      ? {
                          ...b,
                          cards: b.cards.map((c) =>
                            c.id === cardId ? { ...c, title: newTitle } : c
                          ),
                        }
                      : b
                  ),
                }
              : w
          ),
        })),

      moveCard: (
        sourceWorkspaceId,
        destWorkspaceId,
        sourceBoardId,
        destBoardId,
        sourceIndex,
        destIndex
      ) =>
        set((state) => {
          const movedCard: { id: string; title: string } | null = null;

          if (movedCard) {
            const updatedWorkspaces = state.workspaces.map((w) => {
              // Destination workspace
              if (w.id === destWorkspaceId) {
                return {
                  ...w,
                  boards: w.boards.map((b) =>
                    b.id === destBoardId
                      ? {
                          ...b,
                          cards: [
                            ...b.cards.slice(0, destIndex),
                            movedCard!,
                            ...b.cards.slice(destIndex),
                          ],
                        }
                      : b
                  ),
                };
              }

              return w;
            });

            return { workspaces: updatedWorkspaces };
          }

          return state;
        }),

      addCard: (workspaceId, boardId, cardTitle) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  boards: w.boards.map((b) =>
                    b.id === boardId
                      ? {
                          ...b,
                          cards: [
                            ...b.cards,
                            {
                              id: generateUniqueId(),
                              title: cardTitle,
                            },
                          ],
                        }
                      : b
                  ),
                }
              : w
          ),
        })),

      addBoard: (boardName, workspaceId) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  boards: [
                    ...w.boards,
                    {
                      id: generateUniqueId(),
                      name: boardName,
                      cards: [],
                    },
                  ],
                }
              : w
          ),
        })),
    }),
    {
      name: "workspace-storage",
      version: 1,
    }
  )
);

// Helper function to move array items
function moveInArray<T>(arr: T[], sourceIndex: number, destIndex: number): T[] {
  const result = Array.from(arr);
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destIndex, 0, removed);
  return result;
}
