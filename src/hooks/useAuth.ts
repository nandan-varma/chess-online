/**
 * Authentication hooks with React Query
 * Handles user state, login, signup, and logout
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import type { User, LoginCredentials, SignupCredentials } from '@/types/auth'

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
}

/**
 * Get current authenticated user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authService.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: false,
  })
}

/**
 * Login with email and password
 */
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (user) => {
      // Update user cache
      queryClient.setQueryData(authKeys.user(), user)
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
  })
}

/**
 * Sign up with email and password
 */
export function useSignup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: SignupCredentials) =>
      authService.signup(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user(), user)
      queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
  })
}

/**
 * Logout current user
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth cache
      queryClient.setQueryData(authKeys.user(), null)
      queryClient.clear()
    },
  })
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<User>) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.user(), updatedUser)
    },
  })
}
