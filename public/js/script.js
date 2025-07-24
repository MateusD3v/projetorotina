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
    
    // Carregar tarefas ao iniciar
    loadTasks();
    
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
    
    // Carregar tarefas do servidor
    async function loadTasks() {
        try {
            const response = await fetch('/tasks');
            
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
                const response = await fetch(`/tasks/${taskId}`);
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
            if (currentTaskId) {
                // Atualizar tarefa existente
                await fetch(`/tasks/${currentTaskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });
                showAlert('success', 'Tarefa atualizada com sucesso!');
            } else {
                // Criar nova tarefa
                await fetch('/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });
                showAlert('success', 'Tarefa criada com sucesso!');
            }
            
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
            await fetch(`/tasks/${currentTaskId}`, {
                method: 'DELETE'
            });
            
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