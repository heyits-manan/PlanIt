export interface Card {
  id: number;
  title: string;
  description: string;
  boardId: number;
  position: number;
  createdAt: string;
}

export interface Board {
  id: number;
  name: string;
  workspaceId: number;
  position: number;
  createdAt: string;
  cards?: Card[];
}

export interface Workspace {
  id: number;
  name: string;
  ownerId: string;
  createdAt: string;
}
