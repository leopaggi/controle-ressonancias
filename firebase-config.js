// Sistema de armazenamento LOCAL (funciona agora!)
let exams = JSON.parse(localStorage.getItem('resonanceStudies')) || [];

const db = {
    collection: (name) => ({
        orderBy: () => ({
            onSnapshot: (callback) => {
                // Carregar dados iniciais
                callback({
                    forEach: (fn) => exams.forEach(exam => fn({
                        data: () => exam,
                        id: exam.id || Math.random().toString(36).substr(2, 9)
                    }))
                });
                
                // Observar mudanças
                const checkForChanges = () => {
                    const currentData = JSON.parse(localStorage.getItem('resonanceStudies')) || [];
                    if (JSON.stringify(currentData) !== JSON.stringify(exams)) {
                        exams = currentData;
                        callback({
                            forEach: (fn) => exams.forEach(exam => fn({
                                data: () => exam,
                                id: exam.id
                            }))
                        });
                    }
                };
                
                setInterval(checkForChanges, 1000);
            }
        }),
        add: (data) => {
            return new Promise((resolve) => {
                const newExam = {
                    ...data,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString()
                };
                exams.push(newExam);
                localStorage.setItem('resonanceStudies', JSON.stringify(exams));
                console.log("✅ Exame salvo localmente:", newExam);
                resolve({ id: newExam.id });
            });
        },
        doc: (id) => ({
            update: (data) => {
                return new Promise((resolve) => {
                    const index = exams.findIndex(exam => exam.id === id);
                    if (index !== -1) {
                        exams[index] = { ...exams[index], ...data, updatedAt: new Date().toISOString() };
                        localStorage.setItem('resonanceStudies', JSON.stringify(exams));
                    }
                    resolve();
                });
            },
            delete: () => {
                return new Promise((resolve) => {
                    exams = exams.filter(exam => exam.id !== id);
                    localStorage.setItem('resonanceStudies', JSON.stringify(exams));
                    resolve();
                });
            }
        })
    })
};

console.log("✅ Sistema LOCAL ativado - dados salvos no navegador");

// Para o app.js funcionar
window.db = db;
window.firebase = { firestore: () => db }; // Compatibilidade
