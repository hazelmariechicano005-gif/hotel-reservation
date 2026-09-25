import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyA0I75zEv3emlIWoFivlpgLtYD5bFncBqA',
  authDomain: 'hotel-system-b3ee6.firebaseapp.com',
  projectId: 'hotel-system-b3ee6',
  storageBucket: 'hotel-system-b3ee6.firebasestorage.app',
  messagingSenderId: '960934258523',
  appId: '1:960934258523:web:b9e1dccae4a80500eedc7e',
  measurementId: 'G-JSDRG31MXP'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
export const db = getFirestore(app)
