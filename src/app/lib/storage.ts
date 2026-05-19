// LocalStorage utilities for game library

import { Game, GameFile, GameSaveState } from './types';

const STORAGE_KEY = 'game-library-data';
const SAVE_STATE_KEY = 'game-save-states';

// Get all games from localStorage
export function getGames(): Game[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading games from storage:', error);
    return [];
  }
}

// Save games to localStorage
export function saveGames(games: Game[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (error) {
    console.error('Error saving games to storage:', error);
  }
}

// Add a new game
export function addGame(game: Game): void {
  const games = getGames();
  games.push(game);
  saveGames(games);
}

// Update an existing game
export function updateGame(gameId: string, updates: Partial<Game>): void {
  const games = getGames();
  const index = games.findIndex(g => g.id === gameId);
  if (index !== -1) {
    games[index] = { ...games[index], ...updates };
    saveGames(games);
  }
}

// Delete a game
export function deleteGame(gameId: string): void {
  const games = getGames();
  const filtered = games.filter(g => g.id !== gameId);
  saveGames(filtered);
}

// Toggle favorite status
export function toggleFavorite(gameId: string): void {
  const games = getGames();
  const index = games.findIndex(g => g.id === gameId);
  if (index !== -1) {
    games[index].isFavorite = !games[index].isFavorite;
    saveGames(games);
  }
}

// Update last played timestamp
export function updateLastPlayed(gameId: string): void {
  updateGame(gameId, { lastPlayed: Date.now() });
}

// Generate a unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Read file as text
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Get all save states from localStorage
export function getSaveStates(): GameSaveState[] {
  try {
    const data = localStorage.getItem(SAVE_STATE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading save states from storage:', error);
    return [];
  }
}

// Save save states to localStorage
function saveSaveStates(saveStates: GameSaveState[]): void {
  try {
    localStorage.setItem(SAVE_STATE_KEY, JSON.stringify(saveStates));
  } catch (error) {
    console.error('Error saving save states to storage:', error);
  }
}

// Get save states for a specific game
export function getGameSaveStates(gameId: string): GameSaveState[] {
  const allSaves = getSaveStates();
  return allSaves.filter(save => save.gameId === gameId);
}

// Create a new save state
export function createSaveState(gameId: string, name: string, data: any): GameSaveState {
  const saveState: GameSaveState = {
    id: generateId(),
    gameId,
    name,
    timestamp: Date.now(),
    data,
  };

  const saveStates = getSaveStates();
  saveStates.push(saveState);
  saveSaveStates(saveStates);

  return saveState;
}

// Delete a save state
export function deleteSaveState(saveId: string): void {
  const saveStates = getSaveStates();
  const filtered = saveStates.filter(s => s.id !== saveId);
  saveSaveStates(filtered);
}

// Update a save state
export function updateSaveState(saveId: string, updates: Partial<GameSaveState>): void {
  const saveStates = getSaveStates();
  const index = saveStates.findIndex(s => s.id === saveId);
  if (index !== -1) {
    saveStates[index] = { ...saveStates[index], ...updates };
    saveSaveStates(saveStates);
  }
}
