/**
 * Firebase configuration and initialization
 * Handles Firebase setup with proper error handling and singleton pattern
 */

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
} as const;

/**
 * Validate that all required Firebase config values are present
 */
const validateFirebaseConfig = (): void => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;

  for (const key of requiredKeys) {
    if (!firebaseConfig[key]) {
      console.warn(`Missing Firebase config: ${key}`);
    }
  }
};

// Validate on module load
validateFirebaseConfig();

/**
 * Initialize Firebase app (singleton pattern)
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Firebase Auth instance
 */
const auth = getAuth(app);

/**
 * Firebase Realtime Database instance
 */
const database = getDatabase(app);

export { app, auth, database };
