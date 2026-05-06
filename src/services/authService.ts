/**
 * Auth Service - Authentication business logic
 * Handles Firebase authentication and user management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, database } from '@/lib/firebase'
import { ref, set, get } from 'firebase/database'
import type { User, LoginCredentials, SignupCredentials } from '@/types/auth'

class AuthService {
  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          unsubscribe()
          if (!firebaseUser) {
            resolve(null)
            return
          }

          try {
            const userDoc = await this.getUserFromDatabase(firebaseUser.uid)
            resolve(userDoc)
          } catch (error) {
            reject(error)
          }
        },
        reject
      )
    })
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const { user: firebaseUser } = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )

    return this.getUserFromDatabase(firebaseUser.uid)
  }

  /**
   * Sign up with email and password
   */
  async signup(credentials: SignupCredentials): Promise<User> {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )

    // Create user profile in Realtime Database
    const userData: User = {
      id: firebaseUser.uid,
      email: credentials.email,
      displayName: credentials.displayName || null,
      photoURL: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await set(ref(database, `users/${firebaseUser.uid}`), userData)

    // Update Firebase Auth profile
    if (credentials.displayName) {
      await updateProfile(firebaseUser, {
        displayName: credentials.displayName,
      })
    }

    return userData
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await signOut(auth)
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) {
      throw new Error('No authenticated user')
    }

    const userRef = ref(database, `users/${firebaseUser.uid}`)
    const updatedData = {
      ...data,
      updatedAt: new Date(),
    }

    await set(userRef, updatedData)

    // Update Firebase Auth profile if display name changed
    if (data.displayName && data.displayName !== firebaseUser.displayName) {
      await updateProfile(firebaseUser, {
        displayName: data.displayName,
      })
    }

    return this.getUserFromDatabase(firebaseUser.uid)
  }

  /**
   * Helper: Get user from Realtime Database
   */
  private async getUserFromDatabase(uid: string): Promise<User> {
    const snapshot = await get(ref(database, `users/${uid}`))
    if (!snapshot.exists()) {
      throw new Error('User not found')
    }
    return snapshot.val() as User
  }
}

export const authService = new AuthService()
