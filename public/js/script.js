// Importar Firebase (usando CDN)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// IMPORTANTE: Substitua pela configuração do seu projeto Firebase
const firebaseConfig = {
    apiKey: "sua-api-key-aqui",
    authDomain: "projetorotinha.firebaseapp.com",
    projectId: "projetorotinha",
    storageBucket: "projetorotinha.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser = null;
let authToken = null;

document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasksContainer');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const taskForm = document.getElementById('taskForm');
    
    let currentTaskId = null;
    
    // Verificar autenticação
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            authToken = await user.getIdToken();
            console.log('Usuário autenticado:', user.email);
            
            // Mostrar informações do usuário
            showUserInfo(user);
            
            // Carregar tarefas
            loadTasks();
        } else {
            // Usuário não autenticado, redirecionar para login
            window.location.href = '/login.html';
        }
    });
    
    // Event Listeners
    addTaskBtn.addEventListener('click', () => openEditModal(null));
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveTask);
    deleteBtn.addEventListener('click', deleteTask);
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeModal();
        }
    });
    
    // Função para obter headers com autenticação
    function getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        };
    }
    
    // Mostrar informações do usuário
    function showUserInfo(user) {
        // Adicionar informações do usuário no header se não existir
        let userInfo = document.getElementById('userInfo');
        if (!userInfo) {
            userInfo = document.createElement('div');
            userInfo.id = 'userInfo';
            userInfo.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: white;
                padding: 10px 15px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            
            userInfo.innerHTML = `
                <span>Olá, ${user.email}</span>
                <button id="logoutBtn" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 12px;
                ">Sair</button>
            `;
            
            document.body.appendChild(userInfo);
            
            // Event listener para logout
            document.getElementById('logoutBtn').addEventListener('click', async () => {
                try {
                    await signOut(auth);
                    window.location.href = '/login.html';
                } catch (error) {
                    console.error('Erro ao fazer logout:', error);
                    showAlert('error', 'Erro ao fazer logout');
                }
            });
        }
    }

    // Carregar tarefas do servidor
    async function loadTasks() {
        try {
            const response = await fetch('/tasks', {
                headers: getAuthHeaders()
            });
            
            if (response.status === 401) {
                // Token expirado ou inválido
                await signOut(auth);
                window.location.href = '/login.html';
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const tasks = await response.json();
            
            tasksContainer.innerHTML = '';
            
            // Verificar se tasks é um array
            if (Array.isArray(tasks)) {
                tasks.forEach((task) => {
                    const taskCard = createTaskCard(task);
                    tasksContainer.appendChild(taskCard);
                });
            } else {
                console.warn('Resposta da API não é um array:', tasks);
                showAlert('warning', 'Formato de dados inesperado');
            }
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            showAlert('error', 'Erro ao carregar tarefas');
        }
    }
    
    // Criar card de tarefa
    function createTaskCard(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.dataset.id = task.id;
        
        let statusClass = 'status-pending';
        if (task.status === 'Em Andamento') statusClass = 'status-in-progress';
        if (task.status === 'Concluído') statusClass = 'status-completed';
        
        taskCard.innerHTML = `
            <div class="task-header">
                <h3 class="task-title">${task.title}</h3>
                <span class="task-status ${statusClass}">${task.status}</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-details">
                <div class="detail-item">
                    <span class="detail-label">Prioridade:</span>
                    <span class="detail-value">${task.priority}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Unidades:</span>
                    <span class="detail-value">${task.units}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Prazo:</span>
                    <span class="detail-value">${task.deadline} dias</span>
                </div>
            </div>
            <button class="edit-btn">Editar Tarefa</button>
        `;
        
        taskCard.querySelector('.edit-btn').addEventListener('click', () => {
            openEditModal(task.id);
        });
        
        return taskCard;
    }
    
    // Abrir modal de edição
    async function openEditModal(taskId) {
        currentTaskId = taskId;
        
        if (taskId) {
            // Modo edição
            document.getElementById('modalTitle').textContent = 'Editar Tarefa';
            deleteBtn.style.display = 'block';
            
            try {
                const response = await fetch(`/tasks/${taskId}`, {
                    headers: getAuthHeaders()
                });
                
                if (response.status === 401) {
                    await signOut(auth);
                    window.location.href = '/login.html';
                    return;
                }
                
                const task = await response.json();
                
                document.getElementById('editId').value = task.id;
                document.getElementById('editTitle').value = task.title;
                document.getElementById('editDescription').value = task.description;
                document.getElementById('editPriority').value = task.priority;
                document.getElementById('editStatus').value = task.status;
                document.getElementById('editUnits').value = task.units;
                document.getElementById('editDeadline').value = task.deadline;
            } catch (error) {
                console.error('Erro ao carregar tarefa:', error);
                showAlert('error', 'Erro ao carregar tarefa');
            }
        } else {
            // Modo adição
            document.getElementById('modalTitle').textContent = 'Adicionar Tarefa';
            deleteBtn.style.display = 'none';
            taskForm.reset();
        }
        
        editModal.style.display = 'flex';
    }
    
    // Fechar modal
    function closeModal() {
        editModal.style.display = 'none';
    }
    
    // Salvar tarefa
    async function saveTask() {
        const taskData = {
            title: document.getElementById('editTitle').value,
            description: document.getElementById('editDescription').value,
            priority: document.getElementById('editPriority').value,
            status: document.getElementById('editStatus').value,
            units: document.getElementById('editUnits').value,
            deadline: document.getElementById('editDeadline').value
        };
        
        try {
            let response;
            
            if (currentTaskId) {
                // Atualizar tarefa existente
                response = await fetch(`/tasks/${currentTaskId}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(taskData)
                });
            } else {
                // Criar nova tarefa
                response = await fetch('/tasks', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(taskData)
                });
            }
            
            if (response.status === 401) {
                await signOut(auth);
                window.location.href = '/login.html';
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            showAlert('success', currentTaskId ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!');
            closeModal();
            loadTasks();
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error);
            showAlert('error', 'Erro ao salvar tarefa');
        }
    }
    
    // Excluir tarefa
    async function deleteTask() {
        if (!currentTaskId) return;
        
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
        
        try {
            const response = await fetch(`/tasks/${currentTaskId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            
            if (response.status === 401) {
                await signOut(auth);
                window.location.href = '/login.html';
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            showAlert('success', 'Tarefa excluída com sucesso!');
            closeModal();
            loadTasks();
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            showAlert('error', 'Erro ao excluir tarefa');
        }
    }
    
    // Mostrar alerta
    function showAlert(type, message) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
});