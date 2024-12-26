import { create } from "zustand";
import { persist } from "zustand/middleware";

function generateUniqueId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

interface Card {
  id: string;
  title: string;
}

interface Board {
  id: string;
  name: string;
  cards: Card[];
  position: number;
}

interface Workspace {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  boards: Board[];
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceStore {
  workspaces: Workspace[];
  fetchWorkspaces: () => Promise<void>;
  createWorkspace: (workspace: Workspace) => void;
  deleteWorkspace: (workspaceId: string) => void;
  renameWorkspace: (workspaceId: string, newName: string) => void;
  createBoard: (workspaceId: string, boardName: string) => void;
  deleteBoard: (workspaceId: string, boardId: string) => void;
  reorderBoards: (
    workspaceId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  moveCard: (
    sourceWorkspaceId: string,
    destWorkspaceId: string,
    sourceBoardId: string,
    destBoardId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  deleteCard: (workspaceId: string, boardId: string, cardId: string) => void;
  editCard: (
    workspaceId: string,
    boardId: string,
    cardId: string,
    newTitle: string
  ) => void;
  addBoard: (workspaceId: string, boardName: string) => void;
  addCard: (workspaceId: string, boardId: string, cardTitle: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [],
      fetchWorkspaces: async () => {
        const response = await fetch("/api/workspaces");
        const data = await response.json();
        set({ workspaces: data.workspaces });
      },
      createWorkspace: (workspace: Workspace) => {
        set((state) => ({
          workspaces: [...state.workspaces, workspace],
        }));
      },
      deleteWorkspace: (workspaceId: string) =>
        set((state) => ({
          workspaces: state.workspaces.filter(
            (workspace) => workspace._id !== workspaceId
          ),
        })),
      renameWorkspace: (workspaceId: string, newName: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace._id === workspaceId
              ? { ...workspace, name: newName }
              : workspace
          ),
        })),
      createBoard: (workspaceId: string, boardName: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace._id === workspaceId
              ? {
                  ...workspace,
                  boards: [
                    ...workspace.boards,
                    {
                      id: generateUniqueId(),
                      name: boardName,
                      cards: [],
                      position: workspace.boards.length,
                    },
                  ],
                }
              : workspace
          ),
        })),
      deleteBoard: (workspaceId: string, boardId: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace._id === workspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.filter(
                    (board) => board.id !== boardId
                  ),
                }
              : workspace
          ),
        })),
      reorderBoards: (
        workspaceId: string,
        sourceIndex: number,
        destIndex: number
      ) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) => {
            if (workspace._id === workspaceId) {
              const boards = Array.from(workspace.boards);
              const [movedBoard] = boards.splice(sourceIndex, 1);
              boards.splice(destIndex, 0, movedBoard);
              return { ...workspace, boards };
            }
            return workspace;
          }),
        })),
      moveCard: (
        sourceWorkspaceId: string,
        destWorkspaceId: string,
        sourceBoardId: string,
        destBoardId: string,
        sourceIndex: number,
        destIndex: number
      ) =>
        set((state) => {
          const sourceWorkspace = state.workspaces.find(
            (workspace) => workspace._id === sourceWorkspaceId
          );
          const destWorkspace = state.workspaces.find(
            (workspace) => workspace._id === destWorkspaceId
          );

          if (!sourceWorkspace || !destWorkspace) return state;

          const sourceBoard = sourceWorkspace.boards.find(
            (board) => board.id === sourceBoardId
          );
          const destBoard = destWorkspace.boards.find(
            (board) => board.id === destBoardId
          );

          if (!sourceBoard || !destBoard) return state;

          const [movedCard] = sourceBoard.cards.splice(sourceIndex, 1);
          destBoard.cards.splice(destIndex, 0, movedCard);

          return {
            workspaces: state.workspaces.map((workspace) => {
              if (workspace._id === sourceWorkspaceId) {
                return { ...workspace, boards: sourceWorkspace.boards };
              }
              if (workspace._id === destWorkspaceId) {
                return { ...workspace, boards: destWorkspace.boards };
              }
              return workspace;
            }),
          };
        }),
      deleteCard: (workspaceId: string, boardId: string, cardId: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace._id === workspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.map((board) =>
                    board.id === boardId
                      ? {
                          ...board,
                          cards: board.cards.filter(
                            (card) => card.id !== cardId
                          ),
                        }
                      : board
                  ),
                }
              : workspace
          ),
        })),
      editCard: (
        workspaceId: string,
        boardId: string,
        cardId: string,
        newTitle: string
      ) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace._id === workspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.map((board) =>
                    board.id === boardId
                      ? {
                          ...board,
                          cards: board.cards.map((card) =>
                            card.id === cardId
                              ? { ...card, title: newTitle }
                              : card
                          ),
                        }
                      : board
                  ),
                }
              : workspace
          ),
        })),
      addBoard: (workspaceId: string, boardName: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace._id === workspaceId
              ? {
                  ...workspace,
                  boards: [
                    ...workspace.boards,
                    {
                      id: generateUniqueId(),
                      name: boardName,
                      cards: [],
                      position: workspace.boards.length,
                    },
                  ],
                }
              : workspace
          ),
        })),
      addCard: (workspaceId: string, boardId: string, cardTitle: string) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace._id === workspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.map((board) =>
                    board.id === boardId
                      ? {
                          ...board,
                          cards: [
                            ...board.cards,
                            { id: generateUniqueId(), title: cardTitle },
                          ],
                        }
                      : board
                  ),
                }
              : workspace
          ),
        })),
    }),
    {
      name: "workspace-storage",
    }
  )
);
