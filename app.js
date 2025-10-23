// Array para armazenar os exames
let exams = [];
let editingIndex = -1;

// Função para renderizar a tabela
function renderTable(filteredExams = null) {
    const dataToRender = filteredExams || exams;
    const examsTableBody = document.getElementById('examsTableBody');
    
    if (!examsTableBody) {
        console.log("Aguardando tabela carregar...");
        return;
    }
    
    examsTableBody.innerHTML = '';
    
    if (dataToRender.length === 0) {
        examsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Nenhum estudo registrado</td></tr>';
        return;
    }
    
    dataToRender.forEach((exam, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(exam.examDate)}</td>
            <td>${formatDate(exam.studyDate)}</td>
            <td>${exam.patientName}</td>
            <td>${exam.examType}</td>
            <td>${exam.diagnosis}</td>
            <td>${exam.observations || '-'}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editExam(${index})">Editar</button>
                <button class="btn-delete" onclick="deleteExam(${index})">Excluir</button>
            </td>
        `;
        examsTableBody.appendChild(row);
    });
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para atualizar dashboard
function updateDashboard() {
    console.log("Dashboard atualizado com", exams.length, "exames");
}

// Carregar exames do Firebase
function loadExamsFromFirebase() {
    if (typeof db === 'undefined') {
        console.error("Firebase não está disponível");
        return;
    }
    
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

// Inicializar quando o Firebase estiver pronto
if (typeof db !== 'undefined') {
    loadExamsFromFirebase();
} else {
    console.log("Aguardando Firebase carregar...");
}
