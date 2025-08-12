// Configuração do Parse SDK
Parse.initialize(
  'xrkPQgeanlbyRGOOqaR9kChOXIrEMZnPhOo271qp', // Application ID
  'nQoYP0tnyrYOn1XoKTpjx777AWP4WhIL4aZL37S1'  // JavaScript Key
);
Parse.serverURL = 'https://parseapi.back4app.com';

// Definir a classe Task
const Task = Parse.Object.extend('Task');

// Definir a classe Image para armazenar imagens no Back4App
const ImageFile = Parse.Object.extend('ImageFile');

// Definir a classe Note para armazenar notas no Back4App
const Note = Parse.Object.extend('Note');

// Variáveis globais para notas
let selectedNoteColor = 'yellow';
let allNotes = [];

document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasksContainer');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const taskForm = document.getElementById('taskForm');
    
    // Elementos das abas
    const tasksTabBtn = document.getElementById('tasksTabBtn');
    const imagesTabBtn = document.getElementById('imagesTabBtn');
    const notesTabBtn = document.getElementById('notesTabBtn');
    const tasksTab = document.getElementById('tasksTab');
    const imagesTab = document.getElementById('imagesTab');
    const notesTab = document.getElementById('notesTab');
    
    // Elementos dos controles de tarefas
    const taskSearchInput = document.getElementById('taskSearchInput');
    const clearTaskSearch = document.getElementById('clearTaskSearch');
    const priorityFilter = document.getElementById('priorityFilter');
    // statusFilter removido - agora usando apenas prioridade
    const categoryFilter = document.getElementById('categoryFilter');
    const taskSortSelect = document.getElementById('taskSortSelect');
    
    // Elementos das estatísticas removidos
    
    // Elementos do upload de imagens (modal)
    const uploadModalBtn = document.getElementById('upload-modal-btn');
    const imageUploadModal = document.getElementById('imageUploadModal');
    const closeImageModalBtn = document.getElementById('closeImageModalBtn');
    const modalUploadArea = document.getElementById('modalUploadArea');
    const modalImageInput = document.getElementById('modalImageInput');
    const modalUploadImagesBtn = document.getElementById('modalUploadImagesBtn');
    const modalCancelUploadBtn = document.getElementById('modalCancelUploadBtn');
    const modalUploadPreview = document.getElementById('modalUploadPreview');
    const modalPreviewContainer = document.getElementById('modalPreviewContainer');
    const folderSelect = document.getElementById('folderSelect');
    
    // Elementos da galeria dinâmica
    const galleryContainer = document.getElementById('galleryContainer');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const sortSelect = document.getElementById('sortSelect');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const galleryLoading = document.getElementById('galleryLoading');
    const galleryPagination = document.getElementById('galleryPagination');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    const imageCount = document.getElementById('imageCount');
    
    // Elementos do modal de visualização de imagem
    const imageViewModal = document.getElementById('imageViewModal');
    const closeViewModalBtn = document.getElementById('closeViewModalBtn');
    const fullImage = document.getElementById('fullImage');
    const deleteImageBtn = document.getElementById('deleteImageBtn');
    const imageContainer = document.getElementById('imageContainer');
    const zoomBtn = document.getElementById('zoomBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const zoomIndicator = document.getElementById('zoomIndicator');
    const prevImageBtn = document.getElementById('prevImageBtn');
    const nextImageBtn = document.getElementById('nextImageBtn');
    const imageCounter = document.getElementById('imageCounter');
    
    // Elementos da aba de notas
    const addNoteBtn = document.getElementById('addNoteBtn');
    const noteModal = document.getElementById('noteModal');
    const closeNoteModalBtn = document.getElementById('closeNoteModalBtn');
    const cancelNoteBtn = document.getElementById('cancelNoteBtn');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const deleteNoteBtn = document.getElementById('deleteNoteBtn');
    const noteForm = document.getElementById('noteForm');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const noteReminder = document.getElementById('noteReminder');
    const editNoteId = document.getElementById('editNoteId');
    const noteModalTitle = document.getElementById('noteModalTitle');
    const notesContainer = document.getElementById('notesContainer');
    const noteSearchInput = document.getElementById('noteSearchInput');
    const clearNoteSearch = document.getElementById('clearNoteSearch');
    const noteColorFilter = document.getElementById('noteColorFilter');
    const noteSortSelect = document.getElementById('noteSortSelect');
    const notesViewToggle = document.getElementById('notesViewToggle');
    const colorOptions = document.querySelectorAll('.color-option');
    
    let currentTaskId = null;
    let selectedFiles = [];
    let currentImageId = null;
    let allImages = [];
    let filteredImages = [];
    let currentImageIndex = 0;
    let isZoomed = false;
    let zoomLevel = 1;
    let isDragging = false;
    let googleCalendarIntegration = null;
    let startX, startY, scrollLeft, scrollTop;
    
    // Configurações da galeria
    let currentView = 'grid'; // 'grid' ou 'list'
    let currentSort = 'newest';
    let currentSearch = '';
    let currentPage = 1;
    let itemsPerPage = 12;
    let totalPages = 1;
    let currentFolder = null; // pasta atual selecionada
    let showingFolders = true; // se está mostrando pastas ou imagens
    
    // Configurações das notas
    let currentNoteSearch = '';
    let currentNoteColorFilter = '';
    let currentNoteSort = 'newest';
    let currentNoteId = null;
    let notesViewMode = 'grid'; // 'grid' ou 'list'
    
    // Lista de pastas disponíveis
    const availableFolders = [
        'Alcindo Cacela',
        'Almirante Barroso', 
        'Augusto Montenegro',
        'Batista Campos',
        'Conselheiro Furtado',
        'Umarizal',
        'Três Corações',
        'Castanhal',
        'Macapá',
        'Canadense'
    ];
    
    // Configurações das tarefas
    let allTasks = [];
    let filteredTasks = [];
    let currentTaskSearch = '';
    let currentPriorityFilter = '';
    // currentStatusFilter removido - agora usando apenas prioridade
    let currentCategoryFilter = '';
    let currentTaskSort = 'newest';
    let isLoadingTasks = false;
    let loadTasksTimeout = null;
    
    // Configurações das notas (variáveis já declaradas anteriormente)
    let isLoadingNotes = false;
    let loadNotesTimeout = null;
    

    

    
    // Carregar tarefas
    loadTasks();
    
    // Event Listeners
    addTaskBtn.addEventListener('click', () => {
        openEditModal();
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveTask);
    deleteBtn.addEventListener('click', deleteTask);
    
    // Event listeners para controles de tarefas
    taskSearchInput.addEventListener('input', handleTaskSearch);
    clearTaskSearch.addEventListener('click', clearTaskSearchInput);
    priorityFilter.addEventListener('change', handleTaskFilters);
    // statusFilter event listener removido
    categoryFilter.addEventListener('change', handleTaskFilters);
    taskSortSelect.addEventListener('change', handleTaskSort);
    
    // Event listeners para Google Calendar
    const calendarAuthButton = document.getElementById('calendar-auth-button');
    if (calendarAuthButton) {
        calendarAuthButton.addEventListener('click', handleCalendarAuth);
    }
    
    // Escuta mudanças no status de autenticação do Google Calendar
    window.addEventListener('googleCalendarAuthChanged', handleCalendarAuthChanged);
    
    // Inicializa Google Calendar quando a página carrega (com delay para aguardar API)
    setTimeout(() => {
        initializeSimpleGoogleCalendar();
    }, 1000);
    


    // Event listeners para as abas
    if (tasksTabBtn) tasksTabBtn.addEventListener('click', () => switchTab('tasks'));
    if (imagesTabBtn) imagesTabBtn.addEventListener('click', () => switchTab('images'));
    if (notesTabBtn) notesTabBtn.addEventListener('click', () => switchTab('notes'));
    
    // Event listeners para o modal de upload
    if (uploadModalBtn) uploadModalBtn.addEventListener('click', openImageUploadModal);
    if (closeImageModalBtn) closeImageModalBtn.addEventListener('click', closeImageUploadModal);
    if (modalCancelUploadBtn) modalCancelUploadBtn.addEventListener('click', closeImageUploadModal);
    if (modalImageInput) modalImageInput.addEventListener('change', handleModalFileSelect);
    if (modalUploadImagesBtn) modalUploadImagesBtn.addEventListener('click', uploadModalImages);
    
    // Fechar modal clicando fora dele
    if (imageUploadModal) {
        imageUploadModal.addEventListener('click', (e) => {
            if (e.target === imageUploadModal) {
                closeImageUploadModal();
            }
        });
    }
    
    // Event listeners para controles da galeria
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    if (clearSearch) clearSearch.addEventListener('click', clearSearchInput);
    if (sortSelect) sortSelect.addEventListener('change', handleSort);
    if (gridViewBtn) gridViewBtn.addEventListener('click', () => setView('grid'));
    if (listViewBtn) listViewBtn.addEventListener('click', () => setView('list'));
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));
    
    if (closeViewModalBtn) closeViewModalBtn.addEventListener('click', closeImageViewModal);
    if (deleteImageBtn) deleteImageBtn.addEventListener('click', deleteImage);
    
    // Event Listeners para controles de imagem
    if (zoomBtn) zoomBtn.addEventListener('click', toggleZoom);
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    if (prevImageBtn) prevImageBtn.addEventListener('click', showPreviousImage);
    if (nextImageBtn) nextImageBtn.addEventListener('click', showNextImage);
    
    // Event Listeners para zoom com clique na imagem
    if (fullImage) fullImage.addEventListener('click', toggleZoom);
    
    // Event Listeners para arrastar imagem quando com zoom
    if (imageContainer) {
        imageContainer.addEventListener('mousedown', startDrag);
        imageContainer.addEventListener('mousemove', drag);
        imageContainer.addEventListener('mouseup', endDrag);
        imageContainer.addEventListener('mouseleave', endDrag);
    }
    
    // Event Listeners para navegação com teclado
    document.addEventListener('keydown', handleKeyNavigation);
    

    
    // Configurar drag and drop para upload de imagens no modal
    if (modalUploadArea) {
        modalUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            modalUploadArea.classList.add('dragover');
        });
        
        modalUploadArea.addEventListener('dragleave', () => {
            modalUploadArea.classList.remove('dragover');
        });
        
        modalUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            modalUploadArea.classList.remove('dragover');
            
            if (e.dataTransfer.files.length > 0) {
                handleModalFiles(e.dataTransfer.files);
            }
        });
    }
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeModal();
        }
        if (event.target === imageViewModal) {
            closeImageViewModal();
        }
        if (event.target === noteModal) {
            closeNoteModal();
        }
    });
    
    // Event listeners para a aba de notas
    if (addNoteBtn) addNoteBtn.addEventListener('click', () => openNoteModal());
    if (closeNoteModalBtn) closeNoteModalBtn.addEventListener('click', closeNoteModal);
    if (cancelNoteBtn) cancelNoteBtn.addEventListener('click', closeNoteModal);
    if (deleteNoteBtn) deleteNoteBtn.addEventListener('click', deleteNote);
    if (noteForm) noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveNote();
    });
    
    // Event listeners para controles de notas
    if (noteSearchInput) noteSearchInput.addEventListener('input', handleNoteSearch);
    if (clearNoteSearch) clearNoteSearch.addEventListener('click', clearNoteSearchInput);
    if (noteColorFilter) noteColorFilter.addEventListener('change', handleNoteFilters);
    if (noteSortSelect) noteSortSelect.addEventListener('change', handleNoteSort);
    if (notesViewToggle) notesViewToggle.addEventListener('click', toggleNotesView);
    
    // Event listeners para seleção de cores
    colorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            selectNoteColor(option.dataset.color);
        });
    });
    
    // Event listener para botões de exclusão de notas
    notesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('note-delete-btn')) {
            e.stopPropagation();
            const noteId = e.target.dataset.noteId;
            deleteNote(noteId);
        }
    });

    // Carregar notas
    loadNotes();
    
    // Carregar tarefas do Parse com debounce
    async function loadTasks() {
        // Evita múltiplas chamadas simultâneas
        if (isLoadingTasks) {
            return;
        }
        
        // Cancela timeout anterior se existir
        if (loadTasksTimeout) {
            clearTimeout(loadTasksTimeout);
        }
        
        // Debounce de 100ms para evitar chamadas excessivas
        loadTasksTimeout = setTimeout(async () => {
            isLoadingTasks = true;
            try {
                const query = new Parse.Query(Task);
                query.notEqualTo('status', 'Concluída'); // Filtrar tarefas concluídas
                query.descending('createdAt');
                const tasks = await query.find();
                
                allTasks = tasks.map(task => ({
                    id: task.id,
                    title: task.get('title'),
                    description: task.get('description'),
                    priority: task.get('priority'),
                    units: task.get('units'),

                    dueDate: task.get('dueDate'),
                    category: task.get('category') || 'Outros',
                    createdAt: task.get('createdAt')
                }));
                
                applyTaskFilters();
                // updateTaskStats removido
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error);
                showAlert('error', 'Erro ao carregar tarefas');
            } finally {
                isLoadingTasks = false;
            }
        }, 100);
    }
    
    // Criar card de tarefa
    function createTaskCard(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.dataset.id = task.id;
        
        // Sistema de cores baseado na prioridade
        let priorityClass = 'priority-baixa';
        let cardPriorityClass = 'priority-baixa';
        if (task.priority === 'Média') {
            priorityClass = 'priority-media';
            cardPriorityClass = 'priority-media';
        }
        if (task.priority === 'Alta') {
            priorityClass = 'priority-alta';
            cardPriorityClass = 'priority-alta';
        }
        
        // Adicionar classe de prioridade ao card para a linha colorida
        taskCard.classList.add(cardPriorityClass);
        

        
        // Indicador de prioridade
        taskCard.innerHTML = `
            <div class="task-header">
                <h3 class="task-title">
                    ${task.title}
                    <span class="category-badge">${task.category}</span>
                </h3>
                <span class="task-priority ${priorityClass}">${task.priority}</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-details">
                <div class="detail-item">
                    <span class="detail-label">Prioridade:</span>
                    <span class="detail-value">${task.priority}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Unidade:</span>
                    <span class="detail-value">${task.units}</span>
                </div>

                ${task.dueDate ? `
                <div class="detail-item">
                    <span class="detail-label">Vencimento:</span>
                    <span class="detail-value">${formatDate(task.dueDate)}</span>
                </div>
                ` : ''}
            </div>
            <div class="task-actions">
                <button class="complete-btn">✓ Concluído</button>
            </div>
        `;
        
        taskCard.querySelector('.complete-btn').addEventListener('click', () => {
            completeTask(task.id, taskCard);
        });
        
        return taskCard;
    }
    
    // Funções de filtro e busca de tarefas
    function handleTaskSearch() {
        currentTaskSearch = taskSearchInput.value.toLowerCase();
        clearTaskSearch.style.display = currentTaskSearch ? 'block' : 'none';
        applyTaskFilters();
    }
    
    function clearTaskSearchInput() {
        taskSearchInput.value = '';
        currentTaskSearch = '';
        clearTaskSearch.style.display = 'none';
        applyTaskFilters();
    }
    
    function handleTaskFilters() {
        currentPriorityFilter = priorityFilter.value;
        currentCategoryFilter = categoryFilter.value;
        applyTaskFilters();
    }
    
    function handleTaskSort() {
        currentTaskSort = taskSortSelect.value;
        applyTaskFilters();
    }
    
    function applyTaskFilters() {
        filteredTasks = allTasks.filter(task => {
            // Filtro de busca
            if (currentTaskSearch && 
                !task.title.toLowerCase().includes(currentTaskSearch) &&
                !task.description.toLowerCase().includes(currentTaskSearch)) {
                return false;
            }
            
            // Filtro de prioridade
            if (currentPriorityFilter && task.priority !== currentPriorityFilter) {
                return false;
            }
            
            // Filtro de status removido - agora usando apenas prioridade
            
            // Filtro de categoria
            if (currentCategoryFilter && task.category !== currentCategoryFilter) {
                return false;
            }
            
            return true;
        });
        
        // Ordenação
        sortTasks();
        renderTasks();
    }
    
    function sortTasks() {
        filteredTasks.sort((a, b) => {
            switch (currentTaskSort) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'priority':
                    const priorityOrder = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];

                // Ordenação por status removida
                default:
                    return 0;
            }
        });
    }
    
    function renderTasks() {
        tasksContainer.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            const noTasksMessage = document.createElement('div');
            noTasksMessage.className = 'no-tasks';
            
            let title, description;
            if (currentTaskSearch || currentPriorityFilter || currentCategoryFilter) {
                title = 'Nenhuma tarefa encontrada';
                description = 'Não há tarefas que correspondam aos filtros selecionados. Tente ajustar os filtros ou adicionar uma nova tarefa.';
            } else if (allTasks.length === 0) {
                title = 'Nenhuma tarefa encontrada';
                description = 'Clique em "Adicionar Nova Tarefa" para começar.';
            } else {
                title = 'Nenhuma tarefa encontrada';
                description = 'Tente ajustar os filtros aplicados.';
            }
            
            noTasksMessage.innerHTML = `
                <h3>${title}</h3>
                <p>${description}</p>
            `;
            tasksContainer.appendChild(noTasksMessage);
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskElement = createTaskCard(task);
            tasksContainer.appendChild(taskElement);
        });
    }
    
    // função updateTaskStats removida
    

    
    function isTaskOverdue(task) {
        // Verificação de status removida - agora baseado apenas no prazo
        
        if (task.dueDate) {
            const today = new Date();
            const dueDate = new Date(task.dueDate);
            return dueDate < today;
        }
        
        return false;
    }
    
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
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

                document.getElementById('editDueDate').value = task.get('dueDate') || '';
                document.getElementById('editCategory').value = task.get('category') || 'Outros';
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
        const dueDateValue = document.getElementById('editDueDate').value;
        const taskData = {
            title: document.getElementById('editTitle').value,
            description: document.getElementById('editDescription').value,
            priority: document.getElementById('editPriority').value,
            units: document.getElementById('editUnits').value,

            dueDate: dueDateValue ? new Date(dueDateValue) : null,
            category: document.getElementById('editCategory').value
        };
        
        const createCalendarEvent = document.getElementById('create-calendar-event')?.checked || false;
        
        try {
            let task;
            let isNewTask = false;
            
            if (currentTaskId) {
                // Atualizar tarefa existente
                const query = new Parse.Query(Task);
                task = await query.get(currentTaskId);
            } else {
                // Criar nova tarefa
                task = new Task();
                isNewTask = true;
            }
            
            // Definir todos os campos da tarefa
            task.set('title', taskData.title);
            task.set('description', taskData.description);
            task.set('priority', taskData.priority);
            task.set('status', taskData.status);
            task.set('units', taskData.units);

            if (taskData.dueDate) {
                task.set('dueDate', taskData.dueDate);
            }
            task.set('category', taskData.category);
            
            await task.save();
            
            // Criar evento no Google Calendar se solicitado
            if (createCalendarEvent && isNewTask && taskData.dueDate) {
                const calendarTaskData = {
                    id: task.id,
                    title: taskData.title,
                    description: taskData.description,
                    priority: taskData.priority,
                    dueDate: taskData.dueDate,
                    category: taskData.category
                };
                
                const calendarSuccess = await createCalendarEventForTask(calendarTaskData);
                if (calendarSuccess) {
                    showAlert('success', 'Tarefa salva e evento criado no Google Calendar!');
                } else if (googleCalendarIntegration && googleCalendarIntegration.isSignedIn) {
                    showAlert('warning', 'Tarefa salva, mas houve erro ao criar evento no Google Calendar.');
                } else {
                    showAlert('info', 'Tarefa salva! Para criar eventos no Google Calendar, conecte sua conta primeiro.');
                }
            } else {
                showAlert('success', currentTaskId ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!');
            }
            
            closeModal();
            // Otimização: recarregar apenas se necessário
            if (isNewTask) {
                loadTasks();
            } else {
                // Para edições, atualizar apenas o item específico
                const taskIndex = allTasks.findIndex(t => t.id === currentTaskId);
                if (taskIndex !== -1) {
                    allTasks[taskIndex] = {
                        id: currentTaskId,
                        title: taskData.title,
                        description: taskData.description,
                        priority: taskData.priority,
                        units: taskData.units,
                        dueDate: taskData.dueDate,
                        category: taskData.category,
                        createdAt: allTasks[taskIndex].createdAt
                    };
                    applyTaskFilters();
                } else {
                    loadTasks();
                }
            }
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
            // Otimização: remover da lista local em vez de recarregar tudo
            allTasks = allTasks.filter(t => t.id !== currentTaskId);
            applyTaskFilters();
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
    
    async function completeTask(taskId, taskCard) {
        try {
            // Buscar a tarefa no banco de dados
            const query = new Parse.Query(Task);
            const task = await query.get(taskId);
            
            // Marcar como concluída
            task.set('status', 'Concluída');
            await task.save();
            
            // Adicionar animação de fade out
            taskCard.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            taskCard.style.opacity = '0';
            taskCard.style.transform = 'translateX(100%)';
            
            // Remover o elemento após a animação
            setTimeout(() => {
                taskCard.remove();
                // Atualizar estatísticas removido
            }, 500);
            
            showAlert('success', 'Tarefa concluída!');
        } catch (error) {
            console.error('Erro ao concluir tarefa:', error);
            showAlert('error', 'Erro ao concluir tarefa');
        }
    }
    
    // Funções para gerenciamento de abas
    function switchTab(tabName) {
        // Remover classe active de todos os botões e conteúdos
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Adicionar classe active ao botão e conteúdo selecionado
        document.getElementById(tabName + 'TabBtn').classList.add('active');
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        // Carregar imagens se for a aba de imagens
        if (tabName === 'images') {
            loadImages();
        }
        
        // Carregar notas se for a aba de notas
        if (tabName === 'notes') {
            loadNotes();
        }
    }
    
    function switchToImagesTab() {
        switchTab('images');
    }
    
    // Funções para gerenciamento do modal de upload
    function openImageUploadModal() {
        imageUploadModal.style.display = 'flex';
        clearModalUpload();
    }
    
    function closeImageUploadModal() {
        imageUploadModal.style.display = 'none';
        clearModalUpload();
    }
    
    function clearModalUpload() {
        selectedFiles = [];
        modalImageInput.value = '';
        modalUploadPreview.style.display = 'none';
        modalPreviewContainer.innerHTML = '';
        modalUploadImagesBtn.disabled = true;
        if (folderSelect) folderSelect.value = '';
    }
    
    function handleModalFileSelect(e) {
        handleModalFiles(e.target.files);
    }
    
    function handleModalFiles(files) {
        if (files.length === 0) return;
        
        // Converter FileList para Array e filtrar apenas imagens
        const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (newFiles.length === 0) {
            showAlert('error', 'Por favor, selecione apenas arquivos de imagem.');
            return;
        }
        
        // Adicionar novos arquivos aos selecionados
        selectedFiles.push(...newFiles);
        
        // Atualizar preview
        updateModalPreview();
        
        // Habilitar botão de upload
        modalUploadImagesBtn.disabled = selectedFiles.length === 0;
    }
    
    function updateModalPreview() {
        modalPreviewContainer.innerHTML = '';
        
        if (selectedFiles.length === 0) {
            modalUploadPreview.style.display = 'none';
            return;
        }
        
        modalUploadPreview.style.display = 'block';
        
        selectedFiles.forEach((file, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            img.className = 'preview-image';
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            fileName.className = 'file-name';
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '×';
            removeBtn.className = 'remove-file-btn';
            removeBtn.onclick = () => removeModalFile(index);
            
            previewItem.appendChild(img);
            previewItem.appendChild(fileName);
            previewItem.appendChild(removeBtn);
            modalPreviewContainer.appendChild(previewItem);
        });
    }
    
    function removeModalFile(index) {
         selectedFiles.splice(index, 1);
         updateModalPreview();
         modalUploadImagesBtn.disabled = selectedFiles.length === 0;
     }
     
     // Função para sanitizar nomes de arquivo
     function sanitizeFileName(fileName) {
         // Remover caracteres especiais e acentos, manter apenas letras, números, pontos, hífens e underscores
         const name = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
         const sanitized = name.replace(/[^a-zA-Z0-9._-]/g, '_'); // Substitui caracteres especiais por underscore
         
         // Garantir que não comece ou termine com ponto
         return sanitized.replace(/^\.+|\.+$/g, '').replace(/_{2,}/g, '_'); // Remove pontos no início/fim e múltiplos underscores
     }
     
     async function uploadModalImages() {
         if (selectedFiles.length === 0) return;
         
         const selectedFolder = folderSelect ? folderSelect.value : '';
         if (!selectedFolder) {
             showAlert('error', 'Por favor, selecione uma pasta antes de fazer o upload.');
             return;
         }
         
         try {
             modalUploadImagesBtn.disabled = true;
             modalUploadImagesBtn.textContent = 'Enviando...';
             
             showAlert('info', 'Fazendo upload das imagens...');
             
             // Verificar se há usuário logado, senão criar usuário temporário
             let currentUser = Parse.User.current();
             if (!currentUser) {
                 try {
                     // Tentar login anônimo primeiro
                     currentUser = await Parse.User.logInWith('anonymous');
                     console.log('Usuário anônimo criado para upload');
                 } catch (authError) {
                     console.log('Login anônimo falhou, tentando criar usuário temporário:', authError);
                     try {
                         // Criar usuário temporário como fallback
                         const tempUser = new Parse.User();
                         const randomId = Math.random().toString(36).substring(7);
                         tempUser.set('username', `temp_${randomId}`);
                         tempUser.set('password', `temp_${randomId}_pass`);
                         currentUser = await tempUser.signUp();
                         console.log('Usuário temporário criado para upload');
                     } catch (signUpError) {
                         console.log('Erro ao criar usuário temporário:', signUpError);
                         showAlert('warning', 'Tentando upload sem autenticação. Se falhar, consulte CONFIGURAR_UPLOAD_BACK4APP.md');
                     }
                 }
             }
             
             for (const file of selectedFiles) {
                 // Sanitizar nome do arquivo para evitar caracteres inválidos
                 const sanitizedName = sanitizeFileName(file.name);
                 
                 // Fazer upload do arquivo
                 const parseFile = new Parse.File(sanitizedName, file);
                 await parseFile.save();
                 
                 const imageFile = new ImageFile();
                 imageFile.set('file', parseFile);
                 imageFile.set('name', sanitizedName);
                 imageFile.set('folder', selectedFolder);
                 
                 await imageFile.save();
             }
             
             showAlert('success', `${selectedFiles.length} ${selectedFiles.length === 1 ? 'imagem enviada' : 'imagens enviadas'} para a pasta "${selectedFolder}" com sucesso!`);
             closeImageUploadModal();
             
             // Recarregar imagens se estivermos na aba de imagens
             if (document.getElementById('imagesTab').classList.contains('active')) {
                 loadImages();
             }
         } catch (error) {
             console.error('Erro ao fazer upload das imagens:', error);
             showAlert('error', 'Erro ao fazer upload das imagens: ' + error.message);
         } finally {
             modalUploadImagesBtn.disabled = false;
             modalUploadImagesBtn.textContent = 'Fazer Upload';
         }
     }
    
    function handleFiles(files) {
        if (files.length === 0) return;
        
        // Converter FileList para Array e filtrar apenas imagens
        const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (newFiles.length === 0) {
            showAlert('error', 'Por favor, selecione apenas arquivos de imagem.');
            return;
        }
        
        // Adicionar novos arquivos à lista de selecionados
        selectedFiles = [...selectedFiles, ...newFiles];
        
        // Atualizar a visualização prévia
        updatePreview();
    }
    
    function updatePreview() {
        const previewContainer = document.getElementById('previewContainer');
        const uploadPreview = document.getElementById('uploadPreview');
        
        if (selectedFiles.length === 0) {
            uploadPreview.style.display = 'none';
            return;
        }
        
        uploadPreview.style.display = 'block';
        previewContainer.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'preview-remove';
            removeBtn.innerHTML = '&times;';
            removeBtn.style.cssText = 'position: absolute; top: 5px; right: 5px; background: rgba(255,0,0,0.8); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;';
            removeBtn.addEventListener('click', () => {
                selectedFiles.splice(index, 1);
                updatePreview();
            });
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            previewContainer.appendChild(previewItem);
        });
        
        // Habilitar/desabilitar botão de upload
        const uploadImagesBtn = document.getElementById('uploadImagesBtn');
        uploadImagesBtn.disabled = selectedFiles.length === 0;
    }
    
    async function uploadImages() {
        if (selectedFiles.length === 0) return;
        
        try {
            showAlert('info', 'Fazendo upload das imagens...');
            
            for (const file of selectedFiles) {
                // Fazer upload do arquivo
                const parseFile = new Parse.File(file.name, file);
                await parseFile.save();
                
                const imageFile = new ImageFile();
                imageFile.set('file', parseFile);
                imageFile.set('name', file.name);
                
                await imageFile.save();
            }
            
            showAlert('success', 'Imagens enviadas com sucesso!');
            selectedFiles = [];
            updatePreview();
            loadImages();
        } catch (error) {
            console.error('Erro ao fazer upload das imagens:', error);
            showAlert('error', 'Erro ao fazer upload das imagens: ' + error.message);
        }
    }
    
    async function loadImages() {
        try {
            showGalleryLoading(true);
            
            const query = new Parse.Query(ImageFile);
            query.descending('createdAt');
            
            const images = await query.find();
            
            // Limpar e popular o array de todas as imagens
            allImages = [];
            
            images.forEach((image) => {
                const imageData = {
                    id: image.id,
                    url: image.get('file').url(),
                    name: image.get('name'),
                    createdAt: image.get('createdAt'),
                    size: image.get('file')._source?.size || 0,
                    folder: image.get('folder') || 'Sem Pasta'
                };
                
                allImages.push(imageData);
            });
            
            // Inicializar mostrando as pastas se não estivermos em uma pasta específica
            if (!currentFolder) {
                showingFolders = true;
            }
            
            // Atualizar visibilidade dos controles de visualização
            updateViewControlsVisibility();
            
            // Aplicar filtros e renderizar
            applyFiltersAndRender();
            
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
            showAlert('error', 'Erro ao carregar imagens: ' + error.message);
        } finally {
            showGalleryLoading(false);
        }
    }
    
    function showGalleryLoading(show) {
        galleryLoading.style.display = show ? 'flex' : 'none';
    }
    
    function applyFiltersAndRender() {
        if (showingFolders) {
            renderGallery();
            updateGalleryStats();
            return;
        }
        
        // Filtrar por pasta atual
        let imagesToFilter = currentFolder ? 
            allImages.filter(image => image.folder === currentFolder) : 
            allImages;
        
        // Aplicar busca
        filteredImages = imagesToFilter.filter(image => {
            if (!currentSearch) return true;
            return image.name.toLowerCase().includes(currentSearch.toLowerCase());
        });
        
        // Aplicar ordenação
        filteredImages.sort((a, b) => {
            switch (currentSort) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
        
        // Calcular paginação
        totalPages = Math.ceil(filteredImages.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = 1;
        
        // Renderizar galeria
        renderGallery();
        updateGalleryStats();
        updatePagination();
    }
    
    function renderGallery() {
        galleryContainer.innerHTML = '';
        
        if (showingFolders) {
            renderFolders();
            return;
        }
        
        if (filteredImages.length === 0) {
            if (currentSearch.trim() !== '') {
                // Estado de busca sem resultados
                galleryContainer.innerHTML = `
                    <div class="gallery-empty">
                        <div class="empty-icon">🔍</div>
                        <h3 class="empty-title">Nenhuma imagem encontrada</h3>
                        <p class="empty-description">Tente ajustar sua busca ou filtros</p>
                        <button class="btn btn-secondary" onclick="backToFolders()">Voltar às Pastas</button>
                    </div>
                `;
            } else if (allImages.length === 0) {
                // Estado completamente vazio
                galleryContainer.innerHTML = `
                    <div class="gallery-empty">
                        <div class="empty-icon">📷</div>
                        <h3 class="empty-title">Esta pasta está vazia</h3>
                        <p class="empty-description">Faça upload de imagens para esta pasta</p>
                        <button class="btn btn-secondary" onclick="backToFolders()">Voltar às Pastas</button>
                    </div>
                `;
            } else {
                // Estado de filtro sem resultados
                galleryContainer.innerHTML = `
                    <div class="gallery-empty">
                        <div class="empty-icon">🎯</div>
                        <h3 class="empty-title">Nenhuma imagem corresponde aos filtros</h3>
                        <p class="empty-description">Tente alterar os critérios de ordenação</p>
                        <button class="btn btn-secondary" onclick="backToFolders()">Voltar às Pastas</button>
                    </div>
                `;
            }
            return;
        }
        
        // Aplicar classe de visualização
        galleryContainer.className = `gallery-container ${currentView === 'list' ? 'list-view' : ''}`;
        
        // Calcular itens da página atual
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageImages = filteredImages.slice(startIndex, endIndex);
        
        // Renderizar itens com delay para animação
        pageImages.forEach((image, index) => {
            setTimeout(() => {
                const galleryItem = createGalleryItem(image);
                // Adiciona delay de animação baseado no índice
                galleryItem.style.animationDelay = `${index * 0.05}s`;
                galleryContainer.appendChild(galleryItem);
            }, index * 50);
        });
    }
    
    function renderFolders() {
        galleryContainer.className = 'gallery-container';
        
        // Adicionar botão de voltar se necessário e título
        const headerDiv = document.createElement('div');
        headerDiv.className = 'folders-header';
        headerDiv.innerHTML = `
            <h3>Selecione uma Pasta</h3>
            <p>Escolha uma das pastas abaixo para visualizar as imagens</p>
        `;
        galleryContainer.appendChild(headerDiv);
        
        // Renderizar pastas
        availableFolders.forEach((folder, index) => {
            setTimeout(() => {
                const folderItem = createFolderItem(folder);
                folderItem.style.animationDelay = `${index * 0.1}s`;
                galleryContainer.appendChild(folderItem);
            }, index * 100);
        });
    }
    
    function createFolderItem(folderName) {
        const folderItem = document.createElement('div');
        folderItem.className = 'folder-item';
        folderItem.onclick = () => openFolder(folderName);
        
        // Contar imagens na pasta
        const imageCount = allImages.filter(img => img.folder === folderName).length;
        
        folderItem.innerHTML = `
            <div class="folder-icon">📁</div>
            <div class="folder-info">
                <div class="folder-name">${folderName}</div>
                <div class="folder-count">${imageCount} ${imageCount === 1 ? 'imagem' : 'imagens'}</div>
            </div>
        `;
        
        return folderItem;
    }
    
    function openFolder(folderName) {
        currentFolder = folderName;
        showingFolders = false;
        currentPage = 1;
        
        // Atualizar título da galeria
        const galleryHeader = document.querySelector('.gallery-header h3');
        if (galleryHeader) {
            galleryHeader.innerHTML = `
                <button class="back-btn" onclick="backToFolders()">Voltar</button>
                Pasta: ${folderName}
            `;
        }
        
        // Atualizar visibilidade dos controles de visualização
        updateViewControlsVisibility();
        
        applyFiltersAndRender();
    }
    
    function backToFolders() {
        currentFolder = null;
        showingFolders = true;
        currentPage = 1;
        currentSearch = '';
        
        // Limpar busca
        if (searchInput) searchInput.value = '';
        if (clearSearch) clearSearch.style.display = 'none';
        
        // Restaurar título da galeria
        const galleryHeader = document.querySelector('.gallery-header h3');
        if (galleryHeader) {
            galleryHeader.textContent = 'Galeria de Imagens';
        }
        
        // Atualizar visibilidade dos controles de visualização
        updateViewControlsVisibility();
        
        applyFiltersAndRender();
    }
    
    // Tornar a função global para uso nos botões
    window.backToFolders = backToFolders;
    
    function updateGalleryStats() {
        if (showingFolders) {
            const totalFolders = availableFolders.length;
            imageCount.textContent = `${totalFolders} ${totalFolders === 1 ? 'pasta' : 'pastas'}`;
            return;
        }
        
        const total = currentFolder ? 
            allImages.filter(img => img.folder === currentFolder).length : 
            allImages.length;
        const filtered = filteredImages.length;
        
        if (currentSearch && filtered !== total) {
            imageCount.textContent = `${filtered} de ${total} imagens`;
        } else {
            imageCount.textContent = `${total} ${total === 1 ? 'imagem' : 'imagens'}`;
        }
    }
    
    function updatePagination() {
        if (totalPages <= 1) {
            galleryPagination.style.display = 'none';
            return;
        }
        
        galleryPagination.style.display = 'flex';
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }
    
    function handleSearch(e) {
        currentSearch = e.target.value.trim();
        currentPage = 1;
        
        if (currentSearch) {
            clearSearch.style.display = 'block';
        } else {
            clearSearch.style.display = 'none';
        }
        
        // Debounce da busca
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            applyFiltersAndRender();
        }, 300);
    }
    
    function clearSearchInput() {
        searchInput.value = '';
        currentSearch = '';
        clearSearch.style.display = 'none';
        currentPage = 1;
        applyFiltersAndRender();
    }
    
    function handleSort(e) {
        currentSort = e.target.value;
        currentPage = 1;
        applyFiltersAndRender();
    }
    
    function setView(view) {
        currentView = view;
        
        // Atualizar botões
        gridViewBtn.classList.toggle('active', view === 'grid');
        listViewBtn.classList.toggle('active', view === 'list');
        
        // Ajustar itens por página baseado na visualização
        itemsPerPage = view === 'list' ? 8 : 12;
        currentPage = 1;
        
        applyFiltersAndRender();
    }
    
    function updateViewControlsVisibility() {
        const viewControls = document.querySelector('.view-controls');
        if (viewControls) {
            // Mostrar controles apenas quando estiver dentro de uma pasta (não mostrando pastas)
            viewControls.style.display = showingFolders ? 'none' : 'flex';
        }
    }
    
    function changePage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderGallery();
        updatePagination();
        
        // Scroll suave para o topo da galeria
        document.getElementById('imagesGallery').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    function createGalleryItem(image) {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${currentView === 'list' ? 'list-view' : ''}`;
        galleryItem.dataset.id = image.id;
        
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.name;
        img.loading = 'lazy'; // Lazy loading para melhor performance
        
        if (currentView === 'list') {
            // Visualização em lista
            const imageInfo = document.createElement('div');
            imageInfo.className = 'image-info';
            
            const imageName = document.createElement('div');
            imageName.className = 'image-name';
            imageName.textContent = image.name;
            
            const imageDate = document.createElement('div');
            imageDate.className = 'image-date';
            imageDate.textContent = formatDate(image.createdAt);
            
            imageInfo.appendChild(imageName);
            imageInfo.appendChild(imageDate);
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(imageInfo);
        } else {
            // Visualização em grade com overlay
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            
            const imageName = document.createElement('div');
            imageName.className = 'image-name';
            imageName.textContent = image.name;
            
            const imageDate = document.createElement('div');
            imageDate.className = 'image-date';
            imageDate.textContent = formatDate(image.createdAt);
            
            overlay.appendChild(imageName);
            overlay.appendChild(imageDate);
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(overlay);
        }
        
        galleryItem.addEventListener('click', () => {
            openImageViewModal(image);
        });
        
        return galleryItem;
    }
    
    function formatDate(date) {
        if (!date) return 'Data desconhecida';
        
        const now = new Date();
        const imageDate = new Date(date);
        const diffTime = Math.abs(now - imageDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Hoje';
        } else if (diffDays === 2) {
            return 'Ontem';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} dias atrás`;
        } else {
            return imageDate.toLocaleDateString('pt-BR');
        }
    }
    
    function openImageViewModal(image) {
        currentImageId = image.id;
        
        // Encontrar o índice da imagem atual no array
        currentImageIndex = allImages.findIndex(img => img.id === image.id);
        
        displayCurrentImage();
        updateNavigationButtons();
        updateImageCounter();
        resetZoom();
        
        imageViewModal.style.display = 'flex';
    }
    
    function closeImageViewModal() {
        imageViewModal.style.display = 'none';
        fullImage.src = '';
        currentImageId = null;
        resetZoom();
        exitFullscreen();
    }
    
    // Funções para controles de imagem
    function displayCurrentImage() {
        if (allImages.length > 0 && currentImageIndex >= 0 && currentImageIndex < allImages.length) {
            const currentImage = allImages[currentImageIndex];
            fullImage.src = currentImage.url;
            currentImageId = currentImage.id;
        }
    }
    
    function updateNavigationButtons() {
        prevImageBtn.disabled = currentImageIndex <= 0;
        nextImageBtn.disabled = currentImageIndex >= allImages.length - 1;
        
        // Esconder botões se há apenas uma imagem
        if (allImages.length <= 1) {
            prevImageBtn.style.display = 'none';
            nextImageBtn.style.display = 'none';
        } else {
            prevImageBtn.style.display = 'flex';
            nextImageBtn.style.display = 'flex';
        }
    }
    
    function updateImageCounter() {
        if (allImages.length > 0) {
            imageCounter.textContent = `${currentImageIndex + 1} de ${allImages.length}`;
        }
    }
    
    function showPreviousImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            displayCurrentImage();
            updateNavigationButtons();
            updateImageCounter();
            resetZoom();
        }
    }
    
    function showNextImage() {
        if (currentImageIndex < allImages.length - 1) {
            currentImageIndex++;
            displayCurrentImage();
            updateNavigationButtons();
            updateImageCounter();
            resetZoom();
        }
    }
    
    function toggleZoom() {
        if (isZoomed) {
            resetZoom();
        } else {
            zoomIn();
        }
    }
    
    function zoomIn() {
        isZoomed = true;
        zoomLevel = 2;
        fullImage.classList.add('zoomed');
        imageContainer.classList.add('zoomed');
        zoomBtn.innerHTML = '<i class="fas fa-search-minus"></i>';
        zoomBtn.title = 'Reduzir zoom';
        zoomIndicator.textContent = '200%';
        zoomIndicator.style.display = 'block';
    }
    
    function resetZoom() {
        isZoomed = false;
        zoomLevel = 1;
        fullImage.classList.remove('zoomed');
        imageContainer.classList.remove('zoomed');
        zoomBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
        zoomBtn.title = 'Zoom';
        zoomIndicator.style.display = 'none';
        imageContainer.scrollLeft = 0;
        imageContainer.scrollTop = 0;
        
        // Restaurar object-fit baseado no estado da tela cheia
        if (document.fullscreenElement) {
            fullImage.style.objectFit = 'cover';
        } else {
            fullImage.style.objectFit = 'contain';
        }
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            imageViewModal.requestFullscreen().catch(err => {
                console.log('Erro ao entrar em tela cheia:', err);
            });
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            fullscreenBtn.title = 'Sair da tela cheia';
            
            // Resetar zoom ao entrar em tela cheia para melhor visualização
            setTimeout(() => {
                resetZoom();
            }, 100);
        } else {
            document.exitFullscreen();
        }
    }
    
    function exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        fullscreenBtn.title = 'Tela cheia';
    }
    
    // Funções para arrastar imagem com zoom
    function startDrag(e) {
        if (!isZoomed) return;
        
        isDragging = true;
        startX = e.pageX - imageContainer.offsetLeft;
        startY = e.pageY - imageContainer.offsetTop;
        scrollLeft = imageContainer.scrollLeft;
        scrollTop = imageContainer.scrollTop;
        imageContainer.style.cursor = 'grabbing';
    }
    
    function drag(e) {
        if (!isDragging || !isZoomed) return;
        
        e.preventDefault();
        const x = e.pageX - imageContainer.offsetLeft;
        const y = e.pageY - imageContainer.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        imageContainer.scrollLeft = scrollLeft - walkX;
        imageContainer.scrollTop = scrollTop - walkY;
    }
    
    function endDrag() {
        isDragging = false;
        if (isZoomed) {
            imageContainer.style.cursor = 'zoom-out';
        }
    }
    
    // Navegação com teclado
    function handleKeyNavigation(e) {
        if (imageViewModal.style.display !== 'flex') return;
        
        switch(e.key) {
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
            case 'Escape':
                closeImageViewModal();
                break;
            case ' ':
                e.preventDefault();
                toggleZoom();
                break;
            case 'f':
            case 'F':
                toggleFullscreen();
                break;
        }
    }
    
    // Event listener para mudanças de tela cheia
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            fullscreenBtn.title = 'Tela cheia';
            
            // Resetar zoom ao sair da tela cheia
            setTimeout(() => {
                resetZoom();
            }, 100);
        } else {
            // Quando entrar em tela cheia, garantir que a imagem preencha a tela
            setTimeout(() => {
                resetZoom();
                fullImage.style.objectFit = 'cover';
            }, 100);
        }
    });
    
    async function deleteImage() {
        if (!currentImageId) return;
        
        if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;
        
        try {
            const query = new Parse.Query(ImageFile);
            const image = await query.get(currentImageId);
            
            await image.destroy();
            
            // Remover a imagem do array allImages
            allImages = allImages.filter(img => img.id !== currentImageId);
            
            showAlert('success', 'Imagem excluída com sucesso!');
            
            // Se ainda há imagens, navegar para a próxima ou anterior
            if (allImages.length > 0) {
                // Se estamos na última imagem, voltar uma posição
                if (currentImageIndex >= allImages.length) {
                    currentImageIndex = allImages.length - 1;
                }
                
                displayCurrentImage();
                updateNavigationButtons();
                updateImageCounter();
                resetZoom();
            } else {
                // Se não há mais imagens, fechar o modal
                closeImageViewModal();
            }
            
            // Recarregar a galeria para atualizar a visualização
            loadImages();
        } catch (error) {
            console.error('Erro ao excluir imagem:', error);
            showAlert('error', 'Erro ao excluir imagem: ' + error.message);
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
    
    // Funções do Google Calendar Simplificado
    async function initializeSimpleGoogleCalendar() {
        try {
            // Aguarda o carregamento da biblioteca Google Identity Services
            let retries = 0;
            const maxRetries = 10;
            
            while (typeof google === 'undefined' && retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 500));
                retries++;
            }
            
            if (typeof google === 'undefined') {
                updateCalendarStatus('Google Identity Services não carregada');
                return;
            }
            
            if (typeof SimpleGoogleCalendarIntegration !== 'undefined') {
                googleCalendarIntegration = new SimpleGoogleCalendarIntegration();
                
                // Verifica se o Client ID está configurado
                if (!googleCalendarIntegration.areCredentialsConfigured()) {
                    updateCalendarStatus('⚠️ Client ID não configurado - Clique para instruções');
                    return;
                }
                
                console.log('Google Calendar integração simplificada inicializada');
                updateCalendarStatus();
            } else {
                updateCalendarStatus('Classe SimpleGoogleCalendarIntegration não carregada');
            }
        } catch (error) {
            console.error('Erro ao inicializar Google Calendar Simplificado:', error);
            updateCalendarStatus('Erro na inicialização');
        }
    }
    
    function updateCalendarStatus(customMessage = null) {
        const statusElement = document.getElementById('calendar-status');
        const buttonElement = document.getElementById('calendar-auth-button');
        
        if (!statusElement || !buttonElement) return;
        
        if (customMessage) {
            statusElement.textContent = customMessage;
            statusElement.className = 'calendar-status error';
            buttonElement.textContent = '🔄 Tentar Novamente';
            buttonElement.style.backgroundColor = '#e74c3c';
            buttonElement.style.color = 'white';
            return;
        }
        
        if (googleCalendarIntegration) {
            // Usa o método getStatusText() da nova classe
            statusElement.textContent = googleCalendarIntegration.getStatusText();
            
            if (googleCalendarIntegration.isSignedIn) {
                statusElement.className = 'calendar-status connected';
                buttonElement.textContent = '🚪 Desconectar';
                buttonElement.style.backgroundColor = '#e74c3c';
                buttonElement.style.color = 'white';
            } else {
                statusElement.className = 'calendar-status';
                buttonElement.textContent = '📅 Conectar Google Calendar';
                buttonElement.style.backgroundColor = '#4285f4';
                buttonElement.style.color = 'white';
            }
        } else {
            statusElement.textContent = 'Carregando...';
            statusElement.className = 'calendar-status';
            buttonElement.textContent = '📅 Conectar Google Calendar';
            buttonElement.style.backgroundColor = '#4285f4';
            buttonElement.style.color = 'white';
        }
    }
    
    async function handleCalendarAuth() {
        if (!googleCalendarIntegration) {
            alert('Google Calendar não está disponível. Verifique sua conexão com a internet.');
            return;
        }
        
        // Verifica se as credenciais estão configuradas
        if (!googleCalendarIntegration.areCredentialsConfigured()) {
            alert('⚠️ Client ID do Google Calendar não configurado!\n\n' +
                  'Para usar a integração simplificada com Google Calendar, você precisa:\n\n' +
                  '1. Configurar um projeto no Google Cloud Console\n' +
                  '2. Ativar a API do Google Calendar\n' +
                  '3. Criar um Client ID OAuth 2.0\n' +
                  '4. Configurar o Client ID no arquivo google-calendar-config.js\n\n' +
                  'Após isso, os usuários poderão fazer login apenas com sua conta Google!');
            return;
        }
        
        try {
            // Para a versão simplificada, apenas alterna entre login/logout
            if (googleCalendarIntegration.isSignedIn) {
                await googleCalendarIntegration.signOut();
            } else {
                await googleCalendarIntegration.signIn();
            }
            updateCalendarStatus();
        } catch (error) {
            console.error('Erro na autenticação:', error);
            if (error.message.includes('AuthInstance não disponível')) {
                alert('⚠️ Erro de autenticação do Google Calendar\n\n' +
                      'Possíveis causas:\n' +
                      '• Credenciais inválidas ou mal configuradas\n' +
                      '• Domínio não autorizado (deve ser http://localhost:3000)\n' +
                      '• API do Google Calendar não habilitada\n\n' +
                      'Verifique o arquivo GOOGLE_CALENDAR_SETUP.md para mais detalhes.');
            } else {
                alert('Erro ao conectar com Google Calendar. Tente novamente.');
            }
        }
    }
    
    function handleCalendarAuthChanged(event) {
        updateCalendarStatus();
    }
    
    async function createCalendarEventForTask(task) {
        if (!googleCalendarIntegration || !googleCalendarIntegration.isSignedIn) {
            return false;
        }
        
        try {
            const success = await googleCalendarIntegration.createTaskEvent(task);
            if (success) {
                console.log('Evento criado no Google Calendar com sucesso');
                return true;
            }
        } catch (error) {
            console.error('Erro ao criar evento no Google Calendar:', error);
        }
        return false;
    }
    
    // Função para mostrar notificações elegantes
    function showNotification(message, type = 'info') {
        // Remove notificações existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;
        
        // Adiciona estilos inline para garantir que funcione
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            max-width: 500px;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease-out;
            font-family: inherit;
        `;
        
        // Define cores baseadas no tipo
        const colors = {
            success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
            warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
            error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
            info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' }
        };
        
        const color = colors[type] || colors.info;
        notification.style.backgroundColor = color.bg;
        notification.style.border = `1px solid ${color.border}`;
        notification.style.color = color.text;
        
        document.body.appendChild(notification);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // ===== FUNÇÕES PARA GERENCIAMENTO DE NOTAS =====
    
    // Carregar notas do Parse
    async function loadNotes() {
        // Implementar debounce para evitar múltiplas chamadas
        if (isLoadingNotes) {
            return;
        }
        
        if (loadNotesTimeout) {
            clearTimeout(loadNotesTimeout);
        }
        
        loadNotesTimeout = setTimeout(async () => {
            if (isLoadingNotes) {
                return;
            }
            
            isLoadingNotes = true;
            
            try {
                const query = new Parse.Query(Note);
                query.descending('createdAt');
                const notes = await query.find();
                
                allNotes = notes.map(note => ({
                    id: note.id,
                    title: note.get('title'),
                    content: note.get('content'),
                    color: note.get('color') || 'yellow',
                    reminder: note.get('reminder'),
                    createdAt: note.get('createdAt'),
                    updatedAt: note.get('updatedAt')
                }));
                
                applyNoteFilters();
            } catch (error) {
                console.error('Erro ao carregar notas:', error);
                showAlert('error', 'Erro ao carregar notas');
            } finally {
                isLoadingNotes = false;
            }
        }, 100);
    }
    
    // Aplicar filtros e busca nas notas
    function applyNoteFilters() {
        let filteredNotes = [...allNotes];
        
        // Aplicar busca
        if (currentNoteSearch) {
            filteredNotes = filteredNotes.filter(note => 
                note.title.toLowerCase().includes(currentNoteSearch.toLowerCase()) ||
                note.content.toLowerCase().includes(currentNoteSearch.toLowerCase())
            );
        }
        
        // Aplicar filtro de cor
        if (currentNoteColorFilter && currentNoteColorFilter !== 'all') {
            filteredNotes = filteredNotes.filter(note => note.color === currentNoteColorFilter);
        }
        
        // Aplicar ordenação
        switch (currentNoteSort) {
            case 'newest':
                filteredNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                filteredNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'title':
                filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'updated':
                filteredNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                break;
        }
        
        displayNotes(filteredNotes);
    }
    
    // Exibir notas na interface
    function displayNotes(notes) {
        if (!notesContainer) return;
        
        notesContainer.innerHTML = '';
        
        if (notes.length === 0) {
            notesContainer.innerHTML = `
                <div class="empty-state">
                    <p>Nenhuma nota encontrada</p>
                    <button onclick="openNoteModal()" class="btn btn-primary">Criar primeira nota</button>
                </div>
            `;
            return;
        }
        
        notes.forEach(note => {
            const noteCard = createNoteCard(note);
            notesContainer.appendChild(noteCard);
        });
    }
    
    // Criar card de nota
    function createNoteCard(note) {
        const noteCard = document.createElement('div');
        noteCard.className = `note-card ${note.color}`;
        noteCard.dataset.id = note.id;
        
        const formattedDate = new Date(note.createdAt).toLocaleDateString('pt-BR');
        const reminderHtml = note.reminder ? `<div class="note-reminder">🔔 ${new Date(note.reminder).toLocaleString('pt-BR')}</div>` : '';
        
        // Verificar se o conteúdo é longo o suficiente para precisar de preview
        const isLongContent = note.content.length > 100;
        const contentPreview = isLongContent ? note.content.substring(0, 100) + '...' : note.content;
        
        const expandButton = isLongContent ? `<button class="note-expand-btn" onclick="event.stopPropagation(); toggleNoteContent(this)">📖 Ver mais</button>` : '';
        
        noteCard.innerHTML = `
            <div class="note-title">${note.title}</div>
            <div class="note-content" style="display: ${isLongContent ? 'none' : 'block'};">${note.content.replace(/\n/g, '<br>')}</div>
            ${isLongContent ? `<div class="note-content-preview">${contentPreview.replace(/\n/g, '<br>')}</div>` : ''}
            <div class="note-footer">
                <div class="note-date">${formattedDate}</div>
                ${reminderHtml}
            </div>
            <div class="note-actions">
                ${expandButton}
                <button class="note-delete-btn" data-note-id="${note.id}">🗑️ Excluir</button>
            </div>
        `;
        
        return noteCard;
    }
    
    // Abrir modal de nota
    function openNoteModal(noteId = null) {
        currentNoteId = noteId;
        
        if (noteId) {
            // Editar nota existente
            const note = allNotes.find(n => n.id === noteId);
            if (note) {
                noteModalTitle.textContent = 'Editar Nota';
                noteTitle.value = note.title;
                noteContent.value = note.content;
                noteReminder.value = note.reminder ? new Date(note.reminder).toISOString().slice(0, 16) : '';
                selectNoteColor(note.color);
                deleteNoteBtn.style.display = 'inline-block';
            }
        } else {
            // Nova nota
            noteModalTitle.textContent = 'Nova Nota';
            noteForm.reset();
            selectNoteColor('yellow');
            deleteNoteBtn.style.display = 'none';
        }
        
        noteModal.style.display = 'flex';
        noteTitle.focus();
    }
    
    // Tornar openNoteModal acessível globalmente
    window.openNoteModal = openNoteModal;
    
    // Fechar modal de nota
    function closeNoteModal() {
        noteModal.style.display = 'none';
        currentNoteId = null;
        noteForm.reset();
        selectNoteColor('yellow');
    }
    
    // Editar nota - removida para escopo global
    
    // Salvar nota
    async function saveNote() {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        const reminder = noteReminder.value;
        
        if (!title) {
            showAlert('error', 'Título é obrigatório');
            return;
        }
        
        try {
            let note;
            
            if (currentNoteId) {
                // Editar nota existente
                const query = new Parse.Query(Note);
                note = await query.get(currentNoteId);
            } else {
                // Criar nova nota
                note = new Note();
            }
            
            note.set('title', title);
            note.set('content', content);
            note.set('color', selectedNoteColor);
            if (reminder) {
                note.set('reminder', new Date(reminder));
            } else {
                note.unset('reminder');
            }
            
            await note.save();
            
            const isNewNote = !currentNoteId;
            
            if (isNewNote) {
                // Para nova nota, recarregar todas as notas
                loadNotes();
            } else {
                // Para nota editada, atualizar localmente
                const noteIndex = allNotes.findIndex(n => n.id === currentNoteId);
                if (noteIndex !== -1) {
                    allNotes[noteIndex] = {
                        id: note.id,
                        title: note.get('title'),
                        content: note.get('content'),
                        color: note.get('color') || 'yellow',
                        reminder: note.get('reminder'),
                        createdAt: note.get('createdAt'),
                        updatedAt: note.get('updatedAt')
                    };
                    applyNoteFilters();
                }
            }
            
            showAlert('success', currentNoteId ? 'Nota atualizada com sucesso!' : 'Nota criada com sucesso!');
            closeNoteModal();
        } catch (error) {
            console.error('Erro ao salvar nota:', error);
            showAlert('error', 'Erro ao salvar nota');
        }
    }
    
    // Tornar saveNote acessível globalmente
    window.saveNote = saveNote;
    
    // Excluir nota
    async function deleteNote(noteId = null) {
        const idToDelete = noteId || currentNoteId;
        if (!idToDelete) return;
        
        if (!confirm('Tem certeza que deseja excluir esta nota?')) return;
        
        try {
            const query = new Parse.Query(Note);
            const note = await query.get(idToDelete);
            
            await note.destroy();
            
            // Remover nota localmente em vez de recarregar todas
            allNotes = allNotes.filter(n => n.id !== idToDelete);
            applyNoteFilters();
            
            showAlert('success', 'Nota excluída com sucesso!');
            
            // Fechar modal apenas se estivermos excluindo a nota atual do modal
            if (noteId === currentNoteId || !noteId) {
                closeNoteModal();
            }
        } catch (error) {
            console.error('Erro ao excluir nota:', error);
            showAlert('error', 'Erro ao excluir nota');
        }
    }
    
    // Tornar deleteNote acessível globalmente
    window.deleteNote = deleteNote;
    
    // Selecionar cor da nota
    function selectNoteColor(color) {
        selectedNoteColor = color;
        
        // Remover seleção anterior
        colorOptions.forEach(option => option.classList.remove('active'));
        
        // Adicionar seleção à cor escolhida
        const selectedOption = document.querySelector(`[data-color="${color}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
    }
    
    // Buscar notas
    function handleNoteSearch() {
        currentNoteSearch = noteSearchInput.value.trim();
        applyNoteFilters();
        
        // Mostrar/ocultar botão de limpar busca
        if (clearNoteSearch) {
            clearNoteSearch.style.display = currentNoteSearch ? 'block' : 'none';
        }
    }
    
    // Limpar busca de notas
    function clearNoteSearchInput() {
        noteSearchInput.value = '';
        currentNoteSearch = '';
        applyNoteFilters();
        if (clearNoteSearch) {
            clearNoteSearch.style.display = 'none';
        }
    }
    
    // Filtrar notas por cor
    function handleNoteFilters() {
        currentNoteColorFilter = noteColorFilter.value;
        applyNoteFilters();
    }
    
    // Ordenar notas
    function handleNoteSort() {
        currentNoteSort = noteSortSelect.value;
        applyNoteFilters();
    }
    
    // Alternar visualização das notas
    function toggleNotesView() {
        notesViewMode = notesViewMode === 'grid' ? 'list' : 'grid';
        
        if (notesContainer) {
            notesContainer.className = `notes-container ${notesViewMode}-view`;
        }
        
        // Atualizar ícone do botão
        if (notesViewToggle) {
            notesViewToggle.innerHTML = notesViewMode === 'grid' ? '📋' : '⊞';
            notesViewToggle.title = notesViewMode === 'grid' ? 'Visualização em lista' : 'Visualização em grade';
        }
    }
    
    // ===== FIM DAS FUNÇÕES DE NOTAS =====
    
    // Inicializar com a aba de tarefas ativa
    switchTab('tasks');
    
    // Carregar tarefas inicialmente
    loadTasks();
});

// Função global para alternar conteúdo da nota
function toggleNoteContent(button) {
    const noteCard = button.closest('.note-card');
    const fullContent = noteCard.querySelector('.note-content');
    const preview = noteCard.querySelector('.note-content-preview');
    const expandBtn = noteCard.querySelector('.note-expand-btn');
    
    if (fullContent.style.display === 'none') {
        // Mostrar conteúdo completo
        fullContent.style.display = 'block';
        preview.style.display = 'none';
        expandBtn.innerHTML = '📖 Ver menos';
    } else {
        // Mostrar preview
        fullContent.style.display = 'none';
        preview.style.display = 'block';
        expandBtn.innerHTML = '📖 Ver mais';
    }
}



// Função editNote no escopo global
function editNote(noteId) {
    // Acessar elementos DOM diretamente
    const noteModal = document.getElementById('noteModal');
    const noteModalTitle = document.getElementById('noteModalTitle');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const noteReminder = document.getElementById('noteReminder');
    const deleteNoteBtn = document.getElementById('deleteNoteBtn');
    const noteForm = document.getElementById('noteForm');
    
    if (!noteModal) return;
    
    // Buscar a nota nos dados armazenados localmente (allNotes) ou no Parse
    // Primeiro tentar encontrar na variável global allNotes se existir
    let note = null;
    if (typeof allNotes !== 'undefined' && allNotes.length > 0) {
        note = allNotes.find(n => n.id === noteId);
    }
    
    if (note) {
        // Editar nota existente
        noteModalTitle.textContent = 'Editar Nota';
        noteTitle.value = note.title;
        noteContent.value = note.content;
        noteReminder.value = note.reminder ? new Date(note.reminder).toISOString().slice(0, 16) : '';
        
        // Atualizar a variável selectedNoteColor
        if (typeof selectedNoteColor !== 'undefined') {
            selectedNoteColor = note.color;
        }
        
        // Selecionar cor da nota
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.color === note.color) {
                option.classList.add('active');
            }
        });
        
        deleteNoteBtn.style.display = 'inline-block';
        
        // Definir ID da nota atual
        document.getElementById('editNoteId').value = noteId;
    }
    
    noteModal.style.display = 'flex';
    noteTitle.focus();
}