// Configuração SIMPLES do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDsDJ5w4yLYRGqZAmibjbwvwYnOusELPzI",
    authDomain: "controle-ressonancias-leo.firebaseapp.com",
    projectId: "controle-ressonancias-leo",
    storageBucket: "controle-ressonancias-leo.firebasestorage.app",
    messagingSenderId: "938712929681",
    appId: "1:938712929681:web:fb4d415ae39ef48862b630"
};

// Verificar se já existe app
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // usar app existente
}

const db = firebase.firestore();
console.log("✅ Firebase configurado. ProjectID:", firebaseConfig.projectId);
