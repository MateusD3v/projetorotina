// Configuração do Parse SDK
Parse.initialize(
  'xrkPQgeanlbyRGOOqaR9kChOXIrEMZnPhOo271qp', // Application ID
  'nQoYP0tnyrYOn1XoKTpjx777AWP4WhIL4aZL37S1'  // JavaScript Key
);
Parse.serverURL = 'https://parseapi.back4app.com';

// Definir a classe Task
const Task = Parse.Object.extend('Task');

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
    
    // Carregar tarefas
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
    
    // Carregar tarefas do Parse
    async function loadTasks() {
        try {
            const query = new Parse.Query(Task);
            query.descending('createdAt');
            
            const tasks = await query.find();
            
            tasksContainer.innerHTML = '';
            
            tasks.forEach((task) => {
                const taskData = {
                    id: task.id,
                    title: task.get('title'),
                    description: task.get('description'),
                    priority: task.get('priority'),
                    status: task.get('status'),
                    units: task.get('units'),
                    deadline: task.get('deadline')
                };
                
                const taskCard = createTaskCard(taskData);
                tasksContainer.appendChild(taskCard);
            });
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
        let cardStatusClass = 'status-pending';
        if (task.status === 'Em Andamento') {
            statusClass = 'status-in-progress';
            cardStatusClass = 'status-in-progress';
        }
        if (task.status === 'Concluído') {
            statusClass = 'status-completed';
            cardStatusClass = 'status-completed';
        }
        
        // Adicionar classe de status ao card para a linha colorida
        taskCard.classList.add(cardStatusClass);
        
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
            <div class="task-actions">
                <button class="edit-btn">✏️ Editar</button>
                <button class="delete-btn">🗑️ Excluir</button>
            </div>
        `;
        
        taskCard.querySelector('.edit-btn').addEventListener('click', () => {
            openEditModal(task.id);
        });
        
        taskCard.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTaskDirectly(task.id);
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
                const query = new Parse.Query(Task);
                const task = await query.get(taskId);
                
                document.getElementById('editId').value = task.id;
                document.getElementById('editTitle').value = task.get('title');
                document.getElementById('editDescription').value = task.get('description');
                document.getElementById('editPriority').value = task.get('priority');
                document.getElementById('editStatus').value = task.get('status');
                document.getElementById('editUnits').value = task.get('units');
                document.getElementById('editDeadline').value = task.get('deadline');
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
            let task;
            
            if (currentTaskId) {
                // Atualizar tarefa existente
                const query = new Parse.Query(Task);
                task = await query.get(currentTaskId);
                
                task.set('title', taskData.title);
                task.set('description', taskData.description);
                task.set('priority', taskData.priority);
                task.set('status', taskData.status);
                task.set('units', taskData.units);
                task.set('deadline', taskData.deadline);
            } else {
                // Criar nova tarefa
                task = new Task();
                
                task.set('title', taskData.title);
                task.set('description', taskData.description);
                task.set('priority', taskData.priority);
                task.set('status', taskData.status);
                task.set('units', taskData.units);
                task.set('deadline', taskData.deadline);
            }
            
            await task.save();
            
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
            const query = new Parse.Query(Task);
            const task = await query.get(currentTaskId);
            
            await task.destroy();
            
            showAlert('success', 'Tarefa excluída com sucesso!');
            closeModal();
            loadTasks();
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            showAlert('error', 'Erro ao excluir tarefa');
        }
    }
    
    // Excluir tarefa diretamente do card
    async function deleteTaskDirectly(taskId) {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
        
        try {
            const query = new Parse.Query(Task);
            const task = await query.get(taskId);
            
            await task.destroy();
            
            showAlert('success', 'Tarefa excluída com sucesso!');
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