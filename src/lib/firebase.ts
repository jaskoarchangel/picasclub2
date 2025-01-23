import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';


// Configuração do Firebase, substitua pelos seus dados
const firebaseConfig = {
  apiKey: "AIzaSyArVI2fHIJy3Ep_DGCdUp1rH2XPtnL4Rek",
  authDomain: "picasclub-2.firebaseapp.com",
  projectId: "picasclub-2",
  storageBucket: "picasclub-2.firebasestorage.app",
  messagingSenderId: "522779742874",
  appId: "1:522779742874:web:042ce0579d50b7b5170523",
  measurementId: "G-RFX7EFHHXX",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore e o Auth
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { db, auth };
