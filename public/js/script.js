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
    const tasksTab = document.getElementById('tasksTab');
    const imagesTab = document.getElementById('imagesTab');
    
    // Elementos dos controles de tarefas
    const taskSearchInput = document.getElementById('taskSearchInput');
    const clearTaskSearch = document.getElementById('clearTaskSearch');
    const priorityFilter = document.getElementById('priorityFilter');
    // statusFilter removido - agora usando apenas prioridade
    const categoryFilter = document.getElementById('categoryFilter');
    const taskSortSelect = document.getElementById('taskSortSelect');
    
    // Elementos das estatísticas removidos
    
    // Elementos do upload de imagens
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const uploadImagesBtn = document.getElementById('uploadImagesBtn');
    
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
    
    // Configurações das tarefas
    let allTasks = [];
    let filteredTasks = [];
    let currentTaskSearch = '';
    let currentPriorityFilter = '';
    // currentStatusFilter removido - agora usando apenas prioridade
    let currentCategoryFilter = '';
    let currentTaskSort = 'newest';
    

    

    
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
        initializeGoogleCalendar();
    }, 1000);
    


    // Event listeners para as abas
    tasksTabBtn.addEventListener('click', () => switchTab('tasks'));
    imagesTabBtn.addEventListener('click', () => switchTab('images'));
    imageInput.addEventListener('change', handleFileSelect);
    uploadImagesBtn.addEventListener('click', uploadImages);
    
    // Event listeners para controles da galeria
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', clearSearchInput);
    sortSelect.addEventListener('change', handleSort);
    gridViewBtn.addEventListener('click', () => setView('grid'));
    listViewBtn.addEventListener('click', () => setView('list'));
    prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));
    
    closeViewModalBtn.addEventListener('click', closeImageViewModal);
    deleteImageBtn.addEventListener('click', deleteImage);
    
    // Event Listeners para controles de imagem
    zoomBtn.addEventListener('click', toggleZoom);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    prevImageBtn.addEventListener('click', showPreviousImage);
    nextImageBtn.addEventListener('click', showNextImage);
    
    // Event Listeners para zoom com clique na imagem
    fullImage.addEventListener('click', toggleZoom);
    
    // Event Listeners para arrastar imagem quando com zoom
    imageContainer.addEventListener('mousedown', startDrag);
    imageContainer.addEventListener('mousemove', drag);
    imageContainer.addEventListener('mouseup', endDrag);
    imageContainer.addEventListener('mouseleave', endDrag);
    
    // Event Listeners para navegação com teclado
    document.addEventListener('keydown', handleKeyNavigation);
    

    
    // Configurar drag and drop para upload de imagens
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeModal();
        }
        if (event.target === imageViewModal) {
            closeImageViewModal();
        }
    });
    
    // Carregar tarefas do Parse
    async function loadTasks() {
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
        }
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
    }
    
    function switchToImagesTab() {
        switchTab('images');
    }
    
    // Funções para gerenciamento de imagens (mantidas para compatibilidade)
    function openImageUploadModal() {
        switchToImagesTab();
    }
    
    function closeImageUploadModal() {
        switchTab('tasks');
    }
    
    function handleFileSelect(e) {
        handleFiles(e.target.files);
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
                    size: image.get('file')._source?.size || 0
                };
                
                allImages.push(imageData);
            });
            
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
        // Aplicar busca
        filteredImages = allImages.filter(image => {
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
        
        if (filteredImages.length === 0) {
            if (currentSearch.trim() !== '') {
                // Estado de busca sem resultados
                galleryContainer.innerHTML = `
                    <div class="gallery-empty">
                        <div class="empty-icon">🔍</div>
                        <h3 class="empty-title">Nenhuma imagem encontrada</h3>
                        <p class="empty-description">Tente ajustar sua busca ou filtros</p>
                    </div>
                `;
            } else if (allImages.length === 0) {
                // Estado completamente vazio
                galleryContainer.innerHTML = `
                    <div class="gallery-empty">
                        <div class="empty-icon">📷</div>
                        <h3 class="empty-title">Sua galeria está vazia</h3>
                        <p class="empty-description">Comece fazendo upload de suas primeiras imagens</p>
                    </div>
                `;
            } else {
                // Estado de filtro sem resultados
                galleryContainer.innerHTML = `
                    <div class="gallery-empty">
                        <div class="empty-icon">🎯</div>
                        <h3 class="empty-title">Nenhuma imagem corresponde aos filtros</h3>
                        <p class="empty-description">Tente alterar os critérios de ordenação</p>
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
    
    function updateGalleryStats() {
        const total = allImages.length;
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
    
    // Funções do Google Calendar
    async function initializeGoogleCalendar() {
        try {
            // Aguarda o carregamento da API do Google com retry
            let retries = 0;
            const maxRetries = 10;
            
            while (typeof gapi === 'undefined' && retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 500));
                retries++;
            }
            
            if (typeof gapi === 'undefined') {
                updateCalendarStatus('API não carregada');
                return;
            }
            
            if (typeof GoogleCalendarIntegration !== 'undefined') {
                googleCalendarIntegration = new GoogleCalendarIntegration();
                
                // Verifica se as credenciais estão configuradas
                if (!googleCalendarIntegration.areCredentialsConfigured()) {
                    updateCalendarStatus('Credenciais não configuradas');
                    return;
                }
                
                const success = await googleCalendarIntegration.initialize();
                if (success) {
                    console.log('Google Calendar integração inicializada com sucesso');
                } else {
                    console.log('Falha ao inicializar Google Calendar');
                }
                updateCalendarStatus();
            } else {
                updateCalendarStatus('Classe não carregada');
            }
        } catch (error) {
            console.error('Erro ao inicializar Google Calendar:', error);
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
        
        if (googleCalendarIntegration && googleCalendarIntegration.isSignedIn) {
            statusElement.textContent = 'Conectado ✓';
            statusElement.className = 'calendar-status connected';
            buttonElement.textContent = '🚪 Desconectar';
            buttonElement.style.backgroundColor = '#e74c3c';
            buttonElement.style.color = 'white';
        } else {
            statusElement.textContent = 'Não conectado';
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
        
        try {
            // Verifica se a API foi inicializada, se não, tenta inicializar
            if (!googleCalendarIntegration.gapi) {
                console.log('API não inicializada, tentando inicializar...');
                const success = await googleCalendarIntegration.initialize();
                if (!success) {
                    alert('Erro ao inicializar Google Calendar. Verifique suas credenciais.');
                    return;
                }
            }
            
            if (googleCalendarIntegration.isSignedIn) {
                await googleCalendarIntegration.signOut();
            } else {
                await googleCalendarIntegration.signIn();
            }
            updateCalendarStatus();
        } catch (error) {
            console.error('Erro na autenticação:', error);
            alert('Erro ao conectar com Google Calendar. Tente novamente.');
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

    // Inicializar com a aba de tarefas ativa
    switchTab('tasks');
    
    // Carregar tarefas inicialmente
    loadTasks();
});