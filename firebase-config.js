// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDy_fCZtSVLPFZCJ16Tcxuy1zTWWUugw",
    authDomain: "controle-ressonancias.firebaseapp.com",
    projectId: "controle-ressonancias",
    storageBucket: "controle-ressonancias.firebasestorage.app",
    messagingSenderId: "524319674926",
    appId: "1:524319674926:web:baba3dc9d1428e4c858ad3"
};

// Verificar se Firebase já foi carregado
if (typeof firebase !== 'undefined') {
    try {
        // Tentar usar app existente ou criar novo
        let app;
        try {
            app = firebase.app();
            console.log("✅ Firebase já inicializado");
        } catch (e) {
            app = firebase.initializeApp(firebaseConfig);
            console.log("✅ Firebase inicializado agora");
        }
        
        const db = firebase.firestore();
        console.log("✅ Firestore pronto!");
        
        // Testar conexão
        db.collection("teste").add({
            teste: new Date().toISOString()
        }).then(docRef => {
            console.log("✅ Teste de escrita OK:", docRef.id);
        }).catch(error => {
            console.error("❌ Erro no teste:", error);
        });
        
    } catch (error) {
        console.error("❌ Erro na configuração:", error);
    }
} else {
    console.error("❌ Firebase não carregado");
}
