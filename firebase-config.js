// Configuração do Firebase - USE ESTAS CREDENCIAIS
const firebaseConfig = {
    apiKey: "AIzaSyDsDJ5w4yLYRGqZAmibjbwvwYnOusELPzI",
    authDomain: "controle-ressonancias-leo.firebaseapp.com",
    projectId: "controle-ressonancias-leo",
    storageBucket: "controle-ressonancias-leo.firebasestorage.app",
    messagingSenderId: "938712929681",
    appId: "1:938712929681:web:fb4d415ae39ef48862b630"
};

// Inicializar Firebase
try {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log("✅ NOVO FIREBASE CONFIGURADO COM SUCESSO!");
} catch (error) {
    console.error("❌ Erro:", error);
}
