// Array para armazenar os exames
let exams = [];
let editingIndex = -1;

// Carregar exames do Firebase
function loadExamsFromFirebase() {
    db.collection('exams')
        .orderBy('studyDate', 'desc')
        .onSnapshot((snapshot) => {
            exams = [];
            snapshot.forEach((doc) => {
                const examData = doc.data();
                examData.id = doc.id;
                exams.push(examData);
            });
            renderTable();
            updateDashboard();
            console.log('Exames carregados:', exams.length);
        }, (error) => {
            console.error('Erro ao carregar exames:', error);
        });
}

// Função para salvar no Firebase
function saveExamToFirebase(examData) {
    examData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    return db.collection('exams').add(examData);
}

// Função para atualizar exame no Firebase
function updateExamInFirebase(examId, examData) {
    examData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    return db.collection('exams').doc(examId).update(examData);
}

// Função para excluir exame do Firebase
function deleteExamFromFirebase(examId) {
    return db.collection('exams').doc(examId).delete();
}

// Função para trocar de aba
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (tabName === 'dashboard') {
        updateDashboard();
    }
}

// [RESTANTE DO CÓDIGO MANTÉM IGUAL - todas as funções de dashboard, estatísticas, etc.]
// ... (coloque aqui todo o resto do código do app.js que eu te enviei anteriormente)

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', function() {
    loadExamsFromFirebase();
    document.getElementById('studyDate').valueAsDate = new Date();
});