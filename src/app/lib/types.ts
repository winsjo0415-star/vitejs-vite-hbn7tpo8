// Type definitions for the game library

export interface GameFile {
  id: string;
  name: string;
  type: 'html' | 'js' | 'json';
  content: string;
  size: number;
  uploadedAt: number;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  files: GameFile[];
  isFavorite: boolean;
  createdAt: number;
  lastPlayed?: number;
}

export interface GameSaveState {
  id: string;
  gameId: string;
  name: string;
  timestamp: number;
  data: any;
}

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a' | 'recently-played';
export type CategoryFilter = 'all' | 'action' | 'puzzle' | 'arcade' | 'adventure' | 'other';
