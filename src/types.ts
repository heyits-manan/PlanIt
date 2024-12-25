export interface Card {
  id: string;
  title: string;
}

export interface Board {
  id: string;
  name: string;
  cards: Card[];
}

export interface Workspace {
  id: string;
  name: string;
  boards: Board[];
  user: string;
}
