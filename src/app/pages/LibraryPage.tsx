// Main library page with game management

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Grid3x3, List, SlidersHorizontal, Heart, Clock, Keyboard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { GameCard } from '../components/GameCard';
import { GameLauncher } from '../components/GameLauncher';
import { CreateGameDialog } from '../components/CreateGameDialog';
import { ThemeToggle } from '../components/ThemeToggle';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { KeyboardShortcuts } from '../components/KeyboardShortcuts';
import { ShortcutsDialog } from '../components/ShortcutsDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Game, SortOption, CategoryFilter } from '../lib/types';
import { getGames, addGame, updateGame, deleteGame, toggleFavorite, updateLastPlayed } from '../lib/storage';
import { initializeDemoGames } from '../lib/demoGames';
import { toast } from 'sonner';
import { Link } from 'react-router';

export function LibraryPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isGameLauncherOpen, setIsGameLauncherOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Load games from storage and initialize demo games if needed
  useEffect(() => {
    initializeDemoGames();
    setGames(getGames());
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' || e.key === '/') {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Filtered and sorted games
  const filteredGames = useMemo(() => {
    let filtered = games;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(game => game.category === categoryFilter);
    }

    // Tab filter
    if (activeTab === 'favorites') {
      filtered = filtered.filter(game => game.isFavorite);
    } else if (activeTab === 'recent') {
      filtered = filtered.filter(game => game.lastPlayed).sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        case 'recently-played':
          return (b.lastPlayed || 0) - (a.lastPlayed || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [games, searchQuery, sortBy, categoryFilter, activeTab]);

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setIsGameLauncherOpen(true);
    updateLastPlayed(game.id);
    setGames(getGames());
  };

  const handleToggleFavorite = (gameId: string) => {
    toggleFavorite(gameId);
    setGames(getGames());
  };

  const handleDeleteGame = (gameId: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      deleteGame(gameId);
      setGames(getGames());
      toast.success('Game deleted successfully');
    }
  };

  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setIsCreateDialogOpen(true);
  };

  const handleCreateGame = (game: Game) => {
    if (editingGame) {
      updateGame(game.id, game);
      toast.success('Game updated successfully');
    } else {
      addGame(game);
      toast.success('Game created successfully');
    }
    setGames(getGames());
    setEditingGame(null);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingGame(null);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </motion.div>
              </div>
              <div>
                <h1 className="font-bold text-lg">GameVault</h1>
                <p className="text-xs text-muted-foreground">Your Game Library</p>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Game
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-8">
          <TabsList className="bg-accent/50 backdrop-blur-sm">
            <TabsTrigger value="all" className="gap-2">
              <Grid3x3 className="h-4 w-4" />
              All Games
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Clock className="h-4 w-4" />
              Recently Played
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-accent/50 backdrop-blur-sm border-border/50"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
              <SelectTrigger className="w-full md:w-48 bg-accent/50 backdrop-blur-sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="puzzle">Puzzle</SelectItem>
                <SelectItem value="arcade">Arcade</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full md:w-48 bg-accent/50 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="a-z">A to Z</SelectItem>
                <SelectItem value="z-a">Z to A</SelectItem>
                <SelectItem value="recently-played">Recently Played</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-1 bg-accent/50 rounded-md p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Game Grid */}
        {filteredGames.length > 0 ? (
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={handlePlayGame}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleEditGame}
                  onDelete={handleDeleteGame}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex p-6 rounded-full bg-accent/50 mb-4">
              <Grid3x3 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No games found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start by adding your first game'}
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Game
            </Button>
          </motion.div>
        )}
      </div>

      {/* Game Launcher Modal */}
      <GameLauncher
        game={selectedGame}
        open={isGameLauncherOpen}
        onClose={() => setIsGameLauncherOpen(false)}
      />

      {/* Create/Edit Game Dialog */}
      <CreateGameDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onCreateGame={handleCreateGame}
        editGame={editingGame}
      />

      {/* Keyboard Shortcuts Dialog */}
      <ShortcutsDialog
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Floating help button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="icon"
          onClick={() => setShowShortcuts(true)}
          className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all"
        >
          <Keyboard className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}