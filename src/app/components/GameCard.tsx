// Game card component for displaying games in the library

import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, Heart, MoreVertical, Edit, Trash2, FileCode } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Game } from '../lib/types';
import { motion } from 'motion/react';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  onToggleFavorite: (gameId: string) => void;
  onEdit: (game: Game) => void;
  onDelete: (gameId: string) => void;
}

export function GameCard({ game, onPlay, onToggleFavorite, onEdit, onDelete }: GameCardProps) {
  // Default thumbnails based on category
  const defaultThumbnails = {
    action: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    puzzle: 'https://images.unsplash.com/photo-1660507224958-729c18ba1277?w=400',
    arcade: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400',
    adventure: 'https://images.unsplash.com/photo-1572756317709-fe9c15ced298?w=400',
    other: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400'
  };

  const thumbnail = game.thumbnail || defaultThumbnails[game.category as keyof typeof defaultThumbnails] || defaultThumbnails.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
    >
      <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <img
            src={thumbnail}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="lg"
              onClick={() => onPlay(game)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full shadow-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Play Now
            </Button>
          </div>

          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(game.id)}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all z-10"
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                game.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{game.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {game.description}
              </p>
            </div>
            
            {/* More options menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(game)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(game.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileCode className="h-3 w-3" />
              <span>{game.files.length} files</span>
            </div>
            <span className="capitalize px-2 py-1 rounded-full bg-accent">
              {game.category}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
