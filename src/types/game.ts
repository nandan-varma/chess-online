export type PlayerColor = 'w' | 'b';

export interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

export interface GameData {
  id: string;
  FEN: string;
  createdBy: string;
  opponent: string | null;
}
