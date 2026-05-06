/**
 * Custom React Query hooks for game operations
 * Centralized data fetching with caching and optimization
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gameService } from '@/services/gameService';
import type { AIDifficulty, GameMode } from '@/types/game';

// Query key factory for organized, maintainable cache keys
export const gameKeys = {
  all: ['games'] as const,
  lists: () => [...gameKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...gameKeys.lists(), filters] as const,
  details: () => [...gameKeys.all, 'detail'] as const,
  detail: (id: string) => [...gameKeys.details(), id] as const,
};

/**
 * Fetch a single game by ID
 */
export function useGame(id: string | null) {
  return useQuery({
    queryKey: gameKeys.detail(id || ''),
    queryFn: () => (id ? gameService.getGame(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}

/**
 * Create a new game
 */
export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      mode: GameMode;
      difficulty?: AIDifficulty;
      opponentId?: string;
    }) => gameService.createGame(params),
    onSuccess: (newGame) => {
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() });
      // Add new game to cache
      queryClient.setQueryData(gameKeys.detail(newGame.id), newGame);
    },
  });
}

/**
 * Make a move in a game
 */
export function useMakeMove(gameId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (move: { from: string; to: string; promotion?: string }) =>
      gameService.makeMove(gameId, move),
    onSuccess: (updatedGame) => {
      // Update cache immediately
      queryClient.setQueryData(gameKeys.detail(gameId), updatedGame);
    },
    onError: (error) => {
      console.error('Failed to make move:', error);
    },
  });
}

/**
 * Resign from a game
 */
export function useResignGame(gameId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => gameService.resignGame(gameId),
    onSuccess: (updatedGame) => {
      queryClient.setQueryData(gameKeys.detail(gameId), updatedGame);
      queryClient.invalidateQueries({ queryKey: gameKeys.lists() });
    },
  });
}

/**
 * Undo last move
 */
export function useUndoMove(gameId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => gameService.undoMove(gameId),
    onSuccess: (updatedGame) => {
      queryClient.setQueryData(gameKeys.detail(gameId), updatedGame);
    },
  });
}
