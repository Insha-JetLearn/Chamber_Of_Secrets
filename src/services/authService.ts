import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from './firebase.ts';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function formatAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Verify your parchment and try once more.';
    case 'auth/email-already-in-use':
      return 'A wizard has already claimed this email. Please sign in instead.';
    case 'auth/weak-password':
      return 'Your protective incantation (password) is too frail. Please use at least 6 characters.';
    case 'auth/invalid-email':
      return 'The email address format does not seem valid.';
    case 'auth/popup-closed-by-user':
      return 'The magical sign-in portal was closed before completion.';
    case 'auth/network-request-failed':
      return 'Network disturbance. Check your connection to the magical realm.';
    case 'auth/too-many-requests':
      return 'Access temporarily sealed due to repeated attempts. Please wait a moment.';
    default:
      return error?.message || 'A magical interruption prevented authentication.';
  }
}

export async function loginWithGoogle(): Promise<User> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}

export async function registerWithEmail(
  email: string,
  pass: string,
  displayName?: string
): Promise<User> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName && displayName.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    }
    return cred.user;
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (error: any) {
    throw new Error(formatAuthError(error));
  }
}
