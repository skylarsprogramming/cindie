import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  reload,
  sendPasswordResetEmail,
  updatePassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.useDeviceLanguage();

export async function registerEmailPassword(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function loginEmailPassword(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  await signOut(auth);
}

export async function getIdToken(forceRefresh = false) {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken(forceRefresh);
}

export { onAuthStateChanged };

// Google sign-in
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return await signInWithPopup(auth, provider);
}

// Email verification helpers
export async function sendVerificationEmail() {
  if (!auth.currentUser) throw new Error('No current user');
  return await sendEmailVerification(auth.currentUser);
}

export async function reloadUser() {
  if (!auth.currentUser) return null;
  await reload(auth.currentUser);
  return auth.currentUser;
}

export function isEmailVerified() {
  return !!auth.currentUser?.emailVerified;
}

export async function resetPasswordEmail(email) {
  return await sendPasswordResetEmail(auth, email);
}

export async function updateCurrentUserPassword(newPassword) {
  if (!auth.currentUser) throw new Error('No current user');
  return await updatePassword(auth.currentUser, newPassword);
}

export async function setRememberPersistence(remember) {
  const persistence = remember ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);
}


