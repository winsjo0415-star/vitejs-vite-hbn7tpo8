// Keyboard shortcuts handler

import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onNewGame?: () => void;
  onSearch?: () => void;
}

export function KeyboardShortcuts({ onNewGame, onSearch }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New game
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onNewGame?.();
      }

      // Ctrl/Cmd + K: Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onSearch?.();
      }

      // ESC: Close modals (handled by individual components)
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNewGame, onSearch]);

  return null;
}
