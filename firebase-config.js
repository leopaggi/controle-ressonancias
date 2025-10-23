// Configuração do Firebase - USE SUAS CONFIGURAÇÕES
const firebaseConfig = {
    apiKey: "AIzaSyDy_fCZtSVLPFZCJ16Tcxuy1zTWWUugw",
    authDomain: "controle-ressonancias.firebaseapp.com",
    projectId: "controle-ressonancias",
    storageBucket: "controle-ressonancias.firebasestorage.app",
    messagingSenderId: "524319674926",
    appId: "1:524319674926:web:baba3dc9d1428e4c858ad3"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("✅ Firebase configurado!");
