import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD7YxtVPzVAbPIFVmuM_8fHe0Av7CViPRs",
  authDomain: "loto-facil-oracle.firebaseapp.com",
  projectId: "loto-facil-oracle",
  storageBucket: "loto-facil-oracle.firebasestorage.app",
  messagingSenderId: "271154412939",
  appId: "1:271154412939:web:8d511e2033680b3bacc38e",
  measurementId: "G-01VSQ7M9H6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const saveUserProfile = async (user: User) => {
  try {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0],
      photoURL: user.photoURL,
      lastLogin: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserProfile(result.user);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider);
    } else {
      console.error("Login error:", error);
      throw error;
    }
  }
};

export const logout = () => signOut(auth);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Email/Password auth helpers
export { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail };
