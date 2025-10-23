// Sistema COMPLETO de Controle de Ressonâncias - Versão Local com Feedback
let exams = JSON.parse(localStorage.getItem('resonanceStudies')) || [];
let editingIndex = -1;

// Elementos do DOM
const examForm = document.getElementById('examForm');
const examsTableBody = document.getElementById('examsTableBody');
const searchInput = document.getElementById('searchInput');

// Função para mostrar/ocultar campo de diagnóstico correto
function toggleCorrectDiagnosis() {
    const accuracy = document.getElementById('diagnosisAccuracy').value;
    const correctDiagnosisGroup = document.getElementById('correctDiagnosisGroup');
    const learningPointsGroup = document.getElementById('learningPointsGroup');
    
    if (accuracy === 'incorrect' || accuracy === 'partial') {
        correctDiagnosisGroup.style.display = 'block';
        learningPointsGroup.style.display = 'block';
    } else {
        correctDiagnosisGroup.style.display = 'none';
        learningPointsGroup.style.display = 'none';
    }
}

// Função para salvar dados
function saveExams() {
    localStorage.setItem('resonanceStudies', JSON.stringify(exams));
}

// Função para renderizar a tabela
function renderTable(filteredExams = null) {
    const dataToRender = filteredExams || exams;
    
    if (!examsTableBody) return;
    
    examsTableBody.innerHTML = '';
    
    if (dataToRender.length === 0) {
        examsTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Nenhum estudo registrado</td></tr>';
        return;
    }
    
    dataToRender.forEach((exam, index) => {
        const accuracyBadge = getAccuracyBadge(exam.diagnosisAccuracy);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(exam.examDate)}</td>
            <td>${formatDate(exam.studyDate)}</td>
            <td>${exam.patientName}</td>
            <td>${exam.examType}</td>
            <td>
                ${exam.diagnosis}
                ${exam.correctDiagnosis ? `<br><small><strong>Correto:</strong> ${exam.correctDiagnosis}</small>` : ''}
                ${exam.learningPoints ? `<br><small><strong>Aprendizado:</strong> ${exam.learningPoints}</small>` : ''}
            </td>
            <td>${accuracyBadge}</td>
            <td>${exam.observations || '-'}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editExam(${index})">Editar</button>
                <button class="btn-delete" onclick="deleteExam(${index})">Excluir</button>
            </td>
        `;
        examsTableBody.appendChild(row);
    });
}

// Função para obter badge de acerto
function getAccuracyBadge(accuracy) {
    const badges = {
        'correct': '<span class="accuracy-badge accuracy-correct">✅ Acertou</span>',
        'partial': '<span class="accuracy-badge accuracy-partial">⚠️ Parcial</span>',
        'incorrect': '<span class="accuracy-badge accuracy-incorrect">❌ Errou</span>'
    };
    return badges[accuracy] || '<span style="color: #6c757d;">Não informado</span>';
}

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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

// Função para atualizar o dashboard
function updateDashboard() {
    updateGeneralStats();
    updateAccuracyStats();
    updateExamTypeStats();
    updatePerformanceStats();
    updateDiagnosisStats();
    updateDailySummary();
    updateLearningPoints();
}

// Função para estatísticas gerais
function updateGeneralStats() {
    const totalExams = exams.length;
    const uniquePatients = new Set(exams.map(exam => exam.patientName)).size;
    const examTypes = new Set(exams.map(exam => exam.examType)).size;
    const uniqueDiagnoses = new Set(exams.map(exam => exam.diagnosis)).size;
    
    const today = new Date().toISOString().split('T')[0];
    const examsToday = exams.filter(exam => exam.studyDate === today).length;
    
    const generalStats = document.getElementById('generalStats');
    if (generalStats) {
        generalStats.innerHTML = `
            <div class="stat-item">
                <div class="stat-number">${totalExams}</div>
                <div class="stat-label">Total de Exames</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${uniquePatients}</div>
                <div class="stat-label">Pacientes Únicos</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${examTypes}</div>
                <div class="stat-label">Tipos de Exame</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${examsToday}</div>
                <div class="stat-label">Exames Hoje</div>
            </div>
        `;
    }
}

// Função para calcular estatísticas de acertos
function updateAccuracyStats() {
    const totalExams = exams.length;
    const correctDiagnoses = exams.filter(exam => exam.diagnosisAccuracy === 'correct').length;
    const partialDiagnoses = exams.filter(exam => exam.diagnosisAccuracy === 'partial').length;
    const incorrectDiagnoses = exams.filter(exam => exam.diagnosisAccuracy === 'incorrect').length;
    const noFeedback = exams.filter(exam => !exam.diagnosisAccuracy).length;
    
    const accuracyRate = totalExams > 0 ? ((correctDiagnoses + partialDiagnoses * 0.5) / totalExams * 100).toFixed(1) : 0;
    
    const accuracyStats = document.getElementById('accuracyStats');
    if (accuracyStats) {
        accuracyStats.innerHTML = `
            <div class="stat-item">
                <div class="stat-number">${accuracyRate}%</div>
                <div class="stat-label">Taxa de Acerto</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${correctDiagnoses}</div>
                <div class="stat-label">✅ Acertos</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${partialDiagnoses}</div>
                <div class="stat-label">⚠️ Parciais</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${incorrectDiagnoses}</div>
                <div class="stat-label">❌ Erros</div>
            </div>
        `;
    }
}

// Função para estatísticas por tipo de exame
function updateExamTypeStats() {
    const typeCount = {};
    exams.forEach(exam => {
        typeCount[exam.examType] = (typeCount[exam.examType] || 0) + 1;
    });
    
    const examTypeStats = document.getElementById('examTypeStats');
    if (examTypeStats) {
        let html = '';
        Object.entries(typeCount)
            .sort((a, b) => b[1] - a[1])
            .forEach(([type, count]) => {
                html += `
                    <div class="diagnosis-item">
                        <span>${type}</span>
                        <span style="font-weight: bold; color: #007bff;">${count}</span>
                    </div>
                `;
            });
        
        examTypeStats.innerHTML = html || '<p>Nenhum exame registrado</p>';
    }
}

// Função para performance por tipo de exame
function updatePerformanceStats() {
    const typePerformance = {};
    
    exams.forEach(exam => {
        if (!exam.diagnosisAccuracy) return;
        
        if (!typePerformance[exam.examType]) {
            typePerformance[exam.examType] = { total: 0, correct: 0, partial: 0, incorrect: 0 };
        }
        
        typePerformance[exam.examType].total++;
        if (exam.diagnosisAccuracy === 'correct') typePerformance[exam.examType].correct++;
        if (exam.diagnosisAccuracy === 'partial') typePerformance[exam.examType].partial++;
        if (exam.diagnosisAccuracy === 'incorrect') typePerformance[exam.examType].incorrect++;
    });
    
    const performanceStats = document.getElementById('performanceStats');
    if (performanceStats) {
        let html = '';
        Object.entries(typePerformance)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 8)
            .forEach(([type, data]) => {
                const accuracyRate = data.total > 0 ? 
                    ((data.correct + data.partial * 0.5) / data.total * 100).toFixed(1) : 0;
                
                html += `
                    <div class="diagnosis-item">
                        <div>
                            <strong>${type}</strong><br>
                            <small>${data.total} exames | ${accuracyRate}% acerto</small>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: #28a745;">✅ ${data.correct}</div>
                            <div style="color: #ffc107;">⚠️ ${data.partial}</div>
                            <div style="color: #dc3545;">❌ ${data.incorrect}</div>
                        </div>
                    </div>
                `;
            });
        
        performanceStats.innerHTML = html || '<p>Sem dados de performance</p>';
    }
}

// Função para estatísticas de diagnósticos
function updateDiagnosisStats() {
    const diagnosisCount = {};
    exams.forEach(exam => {
        const diagnosis = exam.diagnosis.trim().toLowerCase();
        diagnosisCount[diagnosis] = (diagnosisCount[diagnosis] || 0) + 1;
    });
    
    const diagnosisStats = document.getElementById('diagnosisStats');
    if (diagnosisStats) {
        let html = '';
        Object.entries(diagnosisCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15)
            .forEach(([diagnosis, count]) => {
                html += `
                    <div class="diagnosis-item">
                        <span>${capitalizeFirstLetter(diagnosis)}</span>
                        <span style="font-weight: bold; color: #dc3545;">${count}</span>
                    </div>
                `;
            });
        
        diagnosisStats.innerHTML = html || '<p>Nenhum diagnóstico registrado</p>';
    }
}

// Função para capitalizar a primeira letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Função para resumo diário
function updateDailySummary() {
    const dailyGroups = {};
    
    exams.forEach(exam => {
        if (!dailyGroups[exam.studyDate]) {
            dailyGroups[exam.studyDate] = {
                types: {},
                total: 0,
                correct: 0,
                partial: 0,
                incorrect: 0
            };
        }
        
        dailyGroups[exam.studyDate].types[exam.examType] = 
            (dailyGroups[exam.studyDate].types[exam.examType] || 0) + 1;
        dailyGroups[exam.studyDate].total++;
        
        if (exam.diagnosisAccuracy === 'correct') dailyGroups[exam.studyDate].correct++;
        if (exam.diagnosisAccuracy === 'partial') dailyGroups[exam.studyDate].partial++;
        if (exam.diagnosisAccuracy === 'incorrect') dailyGroups[exam.studyDate].incorrect++;
    });
    
    const dailySummary = document.getElementById('dailySummary');
    if (dailySummary) {
        let html = '';
        
        Object.entries(dailyGroups)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .slice(0, 10)
            .forEach(([date, data]) => {
                const accuracyRate = data.total > 0 ? 
                    ((data.correct + data.partial * 0.5) / data.total * 100).toFixed(1) : 0;
                
                const examTypesHtml = Object.entries(data.types)
                    .map(([type, count]) => 
                        `<span class="exam-type-badge">${type}: ${count}</span>`
                    ).join('');
                
                html += `
                    <div class="day-group">
                        <div class="day-header">
                            ${formatDate(date)} - ${data.total} exame(s) | ${accuracyRate}% de acerto
                            <div style="font-size: 12px; color: #666; margin-top: 5px;">
                                ✅ ${data.correct} | ⚠️ ${data.partial} | ❌ ${data.incorrect}
                            </div>
                        </div>
                        <div class="exam-types">
                            ${examTypesHtml}
                        </div>
                    </div>
                `;
            });
        
        dailySummary.innerHTML = html || '<p>Nenhum estudo registrado</p>';
    }
}

// Função para listar pontos de aprendizado
function updateLearningPoints() {
    const learningPoints = exams
        .filter(exam => exam.learningPoints && exam.learningPoints.trim() !== '')
        .map(exam => ({
            point: exam.learningPoints,
            date: exam.studyDate,
            diagnosis: exam.diagnosis,
            accuracy: exam.diagnosisAccuracy
        }));
    
    const learningPointsList = document.getElementById('learningPointsList');
    if (learningPointsList) {
        let html = '';
        
        if (learningPoints.length === 0) {
            html = '<p>Nenhum ponto de aprendizado registrado</p>';
        } else {
            learningPoints.forEach((item, index) => {
                const accuracyBadge = getAccuracyBadge(item.accuracy);
                html += `
                    <div class="diagnosis-item">
                        <div>
                            <strong>${item.point}</strong>
                            <br><small>Data: ${formatDate(item.date)} | Diagnóstico: ${item.diagnosis} ${accuracyBadge}</small>
                        </div>
                    </div>
                `;
            });
        }
        
        learningPointsList.innerHTML = html;
    }
}

// Função para exportar relatório
function exportReport() {
    const month = prompt("Digite o mês e ano para exportar (MM/AAAA):", 
                        new Date().toLocaleDateString('pt-BR').slice(3));
    
    if (!month) return;
    
    const [inputMonth, inputYear] = month.split('/');
    const filteredExams = exams.filter(exam => {
        const examDate = new Date(exam.studyDate);
        return examDate.getMonth() + 1 == inputMonth && 
               examDate.getFullYear() == inputYear;
    });
    
    if (filteredExams.length === 0) {
        alert('Nenhum exame encontrado para este período!');
        return;
    }
    
    let report = `RELATÓRIO MENSAL - ${month}\n\n`;
    report += `Total de exames: ${filteredExams.length}\n\n`;
    
    // Estatísticas por tipo
    const typeCount = {};
    filteredExams.forEach(exam => {
        typeCount[exam.examType] = (typeCount[exam.examType] || 0) + 1;
    });
    
    report += "DISTRIBUIÇÃO POR TIPO:\n";
    Object.entries(typeCount)
        .sort((a, b) => b[1] - a[1])
        .forEach(([type, count]) => {
            report += `${type}: ${count}\n`;
        });
    
    // Estatísticas de acerto
    const correct = filteredExams.filter(exam => exam.diagnosisAccuracy === 'correct').length;
    const partial = filteredExams.filter(exam => exam.diagnosisAccuracy === 'partial').length;
    const incorrect = filteredExams.filter(exam => exam.diagnosisAccuracy === 'incorrect').length;
    const accuracyRate = filteredExams.length > 0 ? 
        ((correct + partial * 0.5) / filteredExams.length * 100).toFixed(1) : 0;
    
    report += `\nPERFORMANCE:\n`;
    report += `Taxa de acerto: ${accuracyRate}%\n`;
    report += `Acertos: ${correct}\n`;
    report += `Parciais: ${partial}\n`;
    report += `Erros: ${incorrect}\n`;
    
    report += "\nDIAGNÓSTICOS MAIS FREQUENTES:\n";
    const diagnosisCount = {};
    filteredExams.forEach(exam => {
        diagnosisCount[exam.diagnosis] = (diagnosisCount[exam.diagnosis] || 0) + 1;
    });
    
    Object.entries(diagnosisCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([diagnosis, count]) => {
            report += `${diagnosis}: ${count}\n`;
        });
    
    // Pontos de aprendizado
    const learningPoints = filteredExams
        .filter(exam => exam.learningPoints && exam.learningPoints.trim() !== '');
    
    if (learningPoints.length > 0) {
        report += `\nPONTOS DE APRENDIZADO (${learningPoints.length}):\n`;
        learningPoints.forEach((exam, index) => {
            report += `${index + 1}. ${exam.learningPoints}\n`;
        });
    }
    
    // Criar e baixar arquivo
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_ressonancia_${month.replace('/', '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Configurar formulário
examForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const examData = {
        patientName: document.getElementById('patientName').value,
        examType: document.getElementById('examType').value,
        examDate: document.getElementById('examDate').value,
        studyDate: document.getElementById('studyDate').value,
        diagnosis: document.getElementById('diagnosis').value,
        diagnosisAccuracy: document.getElementById('diagnosisAccuracy').value,
        correctDiagnosis: document.getElementById('correctDiagnosis').value,
        learningPoints: document.getElementById('learningPoints').value,
        observations: document.getElementById('observations').value,
        id: editingIndex === -1 ? Date.now().toString() : exams[editingIndex].id,
        createdAt: editingIndex === -1 ? new Date().toISOString() : exams[editingIndex].createdAt,
        updatedAt: new Date().toISOString()
    };
    
    if (editingIndex === -1) {
        exams.push(examData);
    } else {
        exams[editingIndex] = examData;
        editingIndex = -1;
        document.querySelector('button[type="submit"]').textContent = 'Adicionar Estudo';
    }
    
    saveExams();
    renderTable();
    updateDashboard();
    examForm.reset();
    
    // Resetar campos condicionais
    document.getElementById('correctDiagnosisGroup').style.display = 'none';
    document.getElementById('learningPointsGroup').style.display = 'none';
});

// Função para limpar formulário
document.getElementById('clearForm').addEventListener('click', function() {
    examForm.reset();
    editingIndex = -1;
    document.querySelector('button[type="submit"]').textContent = 'Adicionar Estudo';
    document.getElementById('correctDiagnosisGroup').style.display = 'none';
    document.getElementById('learningPointsGroup').style.display = 'none';
});

// Função para editar exame
function editExam(index) {
    const exam = exams[index];
    
    document.getElementById('patientName').value = exam.patientName;
    document.getElementById('examType').value = exam.examType;
    document.getElementById('examDate').value = exam.examDate;
    document.getElementById('studyDate').value = exam.studyDate;
    document.getElementById('diagnosis').value = exam.diagnosis;
    document.getElementById('diagnosisAccuracy').value = exam.diagnosisAccuracy || '';
    document.getElementById('correctDiagnosis').value = exam.correctDiagnosis || '';
    document.getElementById('learningPoints').value = exam.learningPoints || '';
    document.getElementById('observations').value = exam.observations || '';
    
    editingIndex = index;
    document.querySelector('button[type="submit"]').textContent = 'Atualizar Estudo';
    
    // Mostrar/ocultar campos condicionais
    toggleCorrectDiagnosis();
    
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    switchTab('form');
}

// Função para excluir exame
function deleteExam(index) {
    if (confirm('Tem certeza que deseja excluir este estudo?')) {
        exams.splice(index, 1);
        saveExams();
        renderTable();
        updateDashboard();
    }
}

// Função de busca
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    if (searchTerm === '') {
        renderTable();
        return;
    }
    
    const filteredExams = exams.filter(exam => 
        exam.patientName.toLowerCase().includes(searchTerm) ||
        exam.diagnosis.toLowerCase().includes(searchTerm) ||
        exam.examType.toLowerCase().includes(searchTerm) ||
        (exam.correctDiagnosis && exam.correctDiagnosis.toLowerCase().includes(searchTerm)) ||
        (exam.learningPoints && exam.learningPoints.toLowerCase().includes(searchTerm)) ||
        (exam.observations && exam.observations.toLowerCase().includes(searchTerm))
    );
    
    renderTable(filteredExams);
});

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    updateDashboard();
    document.getElementById('studyDate').valueAsDate = new Date();
    
    // Focar no primeiro campo
    document.getElementById('patientName').focus();
});

console.log("✅ Sistema de Controle de Ressonâncias carregado!");
