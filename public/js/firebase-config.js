// Configuração do Firebase para o frontend
// IMPORTANTE: Substitua pelos valores do seu projeto Firebase
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "projetorotinha.firebaseapp.com",
  projectId: "projetorotinha",
  storageBucket: "projetorotinha.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };