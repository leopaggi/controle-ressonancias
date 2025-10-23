// Configuração do Firebase - USE SUAS CONFIGURAÇÕES AQUI!
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_AUTH_DOMAIN_AQUI", 
    projectId: "SEU_PROJECT_ID_AQUI",
    storageBucket: "SEU_STORAGE_BUCKET_AQUI",
    messagingSenderId: "SEU_SENDER_ID_AQUI",
    appId: "SEU_APP_ID_AQUI"
};

// Inicializar Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase conectado com sucesso!");
} catch (error) {
    console.error("❌ Erro ao conectar Firebase:", error);
}

// Referência do Firestore
const db = firebase.firestore();

// Agora você pode usar o Firebase sem login!
console.log("Firestore pronto para uso!");
