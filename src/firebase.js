import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Public Firebase config. Using a default sandbox config if not configured.
// Note: Google OAuth client secret for the auth console is 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
const firebaseConfig = {
  apiKey: "AIzaSyAs-eNvyProjectSampleKeyGoIAGigBR",
  authDomain: "event-uk-brazil.firebaseapp.com",
  projectId: "event-uk-brazil",
  storageBucket: "event-uk-brazil.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
