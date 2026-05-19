// Modal component for launching and playing games

import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { X, Maximize2, Minimize2, Save, FolderOpen, Trash2 } from 'lucide-react';
import { Game, GameSaveState } from '../lib/types';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createSaveState, getGameSaveStates, deleteSaveState } from '../lib/storage';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';

interface GameLauncherProps {
  game: Game | null;
  open: boolean;
  onClose: () => void;
}

export function GameLauncher({ game, open, onClose }: GameLauncherProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saveStates, setSaveStates] = useState<GameSaveState[]>([]);

  useEffect(() => {
    if (open && game) {
      setIsLoading(true);
      setSaveStates(getGameSaveStates(game.id));
      // Simulate loading time
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [open, game]);

  useEffect(() => {
    if (open && game && !isLoading && iframeRef.current) {
      // Find the main HTML file
      const htmlFile = game.files.find(f => f.type === 'html');
      
      if (htmlFile) {
        // Create a blob URL with the HTML content
        const blob = new Blob([htmlFile.content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;

        return () => {
          URL.revokeObjectURL(url);
        };
      }
    }
  }, [game, open, isLoading]);

  const handleSaveGame = () => {
    if (!game) return;

    try {
      // Get current iframe localStorage data
      const iframeWindow = iframeRef.current?.contentWindow;
      if (!iframeWindow) {
        toast.error('Cannot access game state');
        return;
      }

      // Try to get localStorage data from iframe
      let gameData: any = {};
      try {
        // This will work if the iframe allows access
        gameData = { ...iframeWindow.localStorage };
      } catch (e) {
        // If blocked by same-origin policy, just save a timestamp
        gameData = { savedAt: Date.now() };
      }

      const saveName = `Save ${saveStates.length + 1}`;
      const newSave = createSaveState(game.id, saveName, gameData);
      setSaveStates([...saveStates, newSave]);

      toast.success(`Game saved: ${saveName}`);
    } catch (error) {
      console.error('Error saving game:', error);
      toast.error('Failed to save game');
    }
  };

  const handleLoadSave = (saveState: GameSaveState) => {
    if (!game) return;

    try {
      const iframeWindow = iframeRef.current?.contentWindow;
      if (!iframeWindow) {
        toast.error('Cannot access game');
        return;
      }

      // Try to restore localStorage data
      try {
        if (saveState.data && typeof saveState.data === 'object') {
          Object.keys(saveState.data).forEach(key => {
            iframeWindow.localStorage.setItem(key, saveState.data[key]);
          });
        }

        // Reload the iframe to apply the loaded state
        const currentSrc = iframeRef.current?.src;
        if (currentSrc && iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }

        toast.success(`Loaded: ${saveState.name}`);
      } catch (e) {
        toast.warning('Save loaded, but game may need manual refresh');
      }
    } catch (error) {
      console.error('Error loading save:', error);
      toast.error('Failed to load save');
    }
  };

  const handleDeleteSave = (saveId: string, saveName: string) => {
    if (confirm(`Delete save "${saveName}"?`)) {
      deleteSaveState(saveId);
      setSaveStates(saveStates.filter(s => s.id !== saveId));
      toast.success('Save deleted');
    }
  };

  if (!game) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`p-0 gap-0 ${
          isFullscreen ? 'max-w-full w-screen h-screen' : 'max-w-6xl w-full h-[85vh]'
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
          <div>
            <h2 className="font-semibold">{game.title}</h2>
            <p className="text-sm text-muted-foreground">{game.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Save Game Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveGame}
              disabled={isLoading}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>

            {/* Load Game Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isLoading || saveStates.length === 0}
                  className="gap-2"
                >
                  <FolderOpen className="h-4 w-4" />
                  Load
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Load Save State</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {saveStates.length === 0 ? (
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                    No saves available
                  </div>
                ) : (
                  saveStates.map(save => (
                    <DropdownMenuItem
                      key={save.id}
                      className="flex items-center justify-between gap-2 cursor-pointer"
                      onSelect={() => handleLoadSave(save)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{save.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(save.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSave(save.id, save.name);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-border" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Game container */}
        <div className="relative flex-1 bg-black">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm z-10"
              >
                <div className="text-center space-y-4">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Loading Game...</h3>
                    <p className="text-sm text-muted-foreground">Please wait</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title={game.title}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
