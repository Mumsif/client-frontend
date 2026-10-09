/**
 * ============================================================================
 * TRIMLY / GLOWSLOT - FIREBASE CLIENT CONFIGURATION
 * ============================================================================
 * Mirroring the Spring Boot Backend Firebase Configuration:
 * -> com.glowslot.config.FirebaseConfig.java
 *
 * In the Trimly architecture:
 * - Spring Boot initializes the Firebase Admin SDK using firebase-service-account.json
 * - React client uses Firebase Client SDK for real-time Firestore onSnapshot listeners
 *   and phone auth token verification.
 * ============================================================================
 */

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyMockKeyForDevTrimlyGlowSlot2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'trimly-glowslot.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'trimly-glowslot',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'trimly-glowslot.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
};

/**
 * Checks whether Firebase credentials are provided or running in reactive mock mode
 */
export const isLiveFirebaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};