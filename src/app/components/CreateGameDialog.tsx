// Dialog for creating a new game from uploaded files

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GameFile, Game } from '../lib/types';
import { useState } from 'react';
import { generateId } from '../lib/storage';
import { UploadZone } from './UploadZone';
import { FileCode, FileJson, FileType, X } from 'lucide-react';
import { toast } from 'sonner';

interface CreateGameDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateGame: (game: Game) => void;
  editGame?: Game | null;
}

export function CreateGameDialog({ open, onClose, onCreateGame, editGame }: CreateGameDialogProps) {
  const [title, setTitle] = useState(editGame?.title || '');
  const [description, setDescription] = useState(editGame?.description || '');
  const [category, setCategory] = useState(editGame?.category || 'other');
  const [files, setFiles] = useState<GameFile[]>(editGame?.files || []);

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Please enter a game title');
      return;
    }

    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    // Check if at least one HTML file exists
    const hasHtml = files.some(f => f.type === 'html');
    if (!hasHtml) {
      toast.error('Please upload at least one HTML file');
      return;
    }

    const game: Game = {
      id: editGame?.id || generateId(),
      title: title.trim(),
      description: description.trim(),
      category,
      files,
      isFavorite: editGame?.isFavorite || false,
      createdAt: editGame?.createdAt || Date.now(),
      lastPlayed: editGame?.lastPlayed
    };

    onCreateGame(game);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('other');
    setFiles([]);
    onClose();
  };

  const handleFilesUploaded = (newFiles: GameFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'html': return <FileType className="h-4 w-4 text-orange-500" />;
      case 'js': return <FileCode className="h-4 w-4 text-yellow-500" />;
      case 'json': return <FileJson className="h-4 w-4 text-green-500" />;
      default: return <FileCode className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editGame ? 'Edit Game' : 'Create New Game'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Game Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Game"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A fun and exciting game..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="puzzle">Puzzle</SelectItem>
                <SelectItem value="arcade">Arcade</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Game Files *</Label>
            <UploadZone onFilesUploaded={handleFilesUploaded} />
          </div>

          {/* Uploaded files list */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files ({files.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                      className="h-8 w-8 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {editGame ? 'Update Game' : 'Create Game'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
