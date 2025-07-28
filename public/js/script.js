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
    
    // Elementos do upload de imagens
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const uploadImagesBtn = document.getElementById('uploadImagesBtn');
    
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
    let currentImageIndex = 0;
    let isZoomed = false;
    let zoomLevel = 1;
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    

    

    
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
    


    // Event listeners para as abas
    tasksTabBtn.addEventListener('click', () => switchTab('tasks'));
    imagesTabBtn.addEventListener('click', () => switchTab('images'));
    imageInput.addEventListener('change', handleFileSelect);
    uploadImagesBtn.addEventListener('click', uploadImages);
    
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
            const query = new Parse.Query(ImageFile);
            query.descending('createdAt');
            
            const images = await query.find();
            
            galleryContainer.innerHTML = '';
            
            if (images.length === 0) {
                galleryContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666; padding: 2rem;">Nenhuma imagem encontrada. Faça upload de suas primeiras imagens!</p>';
                return;
            }
            
            // Limpar e popular o array de todas as imagens
            allImages = [];
            
            images.forEach((image) => {
                const imageData = {
                    id: image.id,
                    url: image.get('file').url(),
                    name: image.get('name')
                };
                
                // Adicionar ao array de todas as imagens
                allImages.push(imageData);
                
                const galleryItem = createGalleryItem(imageData);
                galleryContainer.appendChild(galleryItem);
            });
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
            showAlert('error', 'Erro ao carregar imagens: ' + error.message);
        }
    }
    
    function createGalleryItem(image) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.id = image.id;
        
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.name;
        
        galleryItem.appendChild(img);
        
        galleryItem.addEventListener('click', () => {
            openImageViewModal(image);
        });
        
        return galleryItem;
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
    
    // Inicializar com a aba de tarefas ativa
    switchTab('tasks');
    
    // Carregar tarefas inicialmente
    loadTasks();
});