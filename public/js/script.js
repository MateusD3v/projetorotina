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
    
    // Elementos do DOM
const floatingMenuBtn = document.getElementById('floatingMenuBtn');
const popupMenu = document.getElementById('popupMenu');
const popupOverlay = document.getElementById('popupOverlay');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const myProfileMenu = document.getElementById('myProfileMenu');
    
    // Elementos do modal de upload de imagens
    const openImageUploadBtn = document.getElementById('openImageUploadBtn');
    const imageUploadModal = document.getElementById('imageUploadModal');
    const closeImageModalBtn = document.getElementById('closeImageModalBtn');
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('previewContainer');
    
    // Elementos de autenticação
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
    const loginTabBtn = document.getElementById('loginTabBtn');
    const signupTabBtn = document.getElementById('signupTabBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const submitLoginBtn = document.getElementById('submitLoginBtn');
    const submitSignupBtn = document.getElementById('submitSignupBtn');
    const uploadImagesBtn = document.getElementById('uploadImagesBtn');
    const galleryContainer = document.getElementById('galleryContainer');
    
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
    
    // Funções de autenticação
    function openAuthModal() {
        authModal.style.display = 'flex';
    }

    // Event listeners para o pop-up menu
    floatingMenuBtn.addEventListener('click', function() {
        popupMenu.classList.add('active');
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeMenuBtn.addEventListener('click', function() {
        closePopupMenu();
    });

    popupOverlay.addEventListener('click', function() {
        closePopupMenu();
    });

    // Função para fechar o pop-up menu
    function closePopupMenu() {
        popupMenu.classList.remove('active');
        popupOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Fechar menu com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupMenu.classList.contains('active')) {
            closePopupMenu();
        }
    });

    // Fechar menu ao clicar em um item
    const menuItems = document.querySelectorAll('.popup-menu-list li a');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            closePopupMenu();
        });
    });
    
    function closeAuthModal() {
        authModal.style.display = 'none';
    }
    
    async function login() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
            showAlert('warning', 'Preencha todos os campos');
            return;
        }
        
        try {
            showAlert('info', 'Fazendo login...');
            const user = await Parse.User.logIn(username, password);
            showAlert('success', 'Login realizado com sucesso!');
            closeAuthModal();
            
            // Restaurar a visibilidade da aba "Meu", mas mantê-la oculta até que o menu seja clicado
            myProfileMenu.style.display = '';
            myProfileMenu.classList.add('menu-item-hidden');
            
            updateUserUI();
            loadImages(); // Recarregar imagens para mostrar apenas as do usuário atual
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            showAlert('error', 'Erro ao fazer login: ' + error.message);
        }
    }
    
    async function signup() {
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        if (!username || !email || !password) {
            showAlert('warning', 'Preencha todos os campos');
            return;
        }
        
        try {
            showAlert('info', 'Criando conta...');
            
            const user = new Parse.User();
            user.set('username', username);
            user.set('email', email);
            user.set('password', password);
            
            await user.signUp();
            
            showAlert('success', 'Conta criada com sucesso!');
            closeAuthModal();
            updateUserUI();
        } catch (error) {
            console.error('Erro ao criar conta:', error);
            showAlert('error', 'Erro ao criar conta: ' + error.message);
        }
    }
    
    async function logout() {
        try {
            await Parse.User.logOut();
            showAlert('success', 'Logout realizado com sucesso!');
            
            // Ocultar completamente a aba "Meu" quando o usuário faz logout
            myProfileMenu.style.display = 'none';
            
            updateUserUI();
            loadImages(); // Recarregar imagens para mostrar a mensagem de login
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            showAlert('error', 'Erro ao fazer logout: ' + error.message);
        }
    }
    
    function updateUserUI() {
        const currentUser = Parse.User.current();
        const loginBtn = document.getElementById('loginBtn');
        
        if (currentUser) {
            // Usuário está logado
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.get('username')} <i class="fas fa-sign-out-alt" id="logoutIcon"></i>`;
            
            // Adicionar evento de logout ao ícone
            const logoutIcon = document.getElementById('logoutIcon');
            if (logoutIcon) {
                logoutIcon.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evitar que o clique propague para o botão de login
                    logout();
                });
            }
            
            // Garantir que a aba "Meu" esteja oculta por padrão, mas disponível para ser mostrada
            myProfileMenu.classList.add('menu-item-hidden');
        } else {
            // Usuário não está logado
            loginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
            
            // Ocultar completamente a aba "Meu" quando o usuário não estiver logado
            myProfileMenu.style.display = 'none';
        }
    }
    

    
    // Carregar tarefas
    loadTasks();
    updateUserUI();
    
    // Event Listeners
    addTaskBtn.addEventListener('click', () => {
        openEditModal();
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveTask);
    deleteBtn.addEventListener('click', deleteTask);
    
    openImageUploadBtn.addEventListener('click', () => {
        if (Parse.User.current()) {
            openImageUploadModal();
        } else {
            showAlert('warning', 'Você precisa fazer login para acessar as imagens');
            openAuthModal();
        }
    });
    closeImageModalBtn.addEventListener('click', closeImageUploadModal);
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
    
    // Event Listeners para autenticação
    loginBtn.addEventListener('click', openAuthModal);
    closeAuthModalBtn.addEventListener('click', closeAuthModal);
    
    loginTabBtn.addEventListener('click', () => {
        loginTabBtn.classList.add('active');
        signupTabBtn.classList.remove('active');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    });
    
    signupTabBtn.addEventListener('click', () => {
        signupTabBtn.classList.add('active');
        loginTabBtn.classList.remove('active');
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    });
    
    submitLoginBtn.addEventListener('click', login);
    submitSignupBtn.addEventListener('click', signup);
    
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
        if (event.target === imageUploadModal) {
            closeImageUploadModal();
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
    
    // Funções para gerenciamento de imagens
    function openImageUploadModal() {
        imageUploadModal.style.display = 'flex';
        loadImages();
    }
    
    function closeImageUploadModal() {
        imageUploadModal.style.display = 'none';
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
            removeBtn.addEventListener('click', () => {
                selectedFiles.splice(index, 1);
                updatePreview();
            });
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            previewContainer.appendChild(previewItem);
        });
        
        // Habilitar/desabilitar botão de upload
        uploadImagesBtn.disabled = selectedFiles.length === 0;
    }
    
    async function uploadImages() {
        if (selectedFiles.length === 0) return;
        
        // Verificar se o usuário está logado
        const currentUser = Parse.User.current();
        if (!currentUser) {
            showAlert('warning', 'Você precisa fazer login para fazer upload de imagens');
            closeImageUploadModal();
            openAuthModal();
            return;
        }
        
        try {
            showAlert('info', 'Fazendo upload das imagens...');
            
            for (const file of selectedFiles) {
                // Fazer upload do arquivo
                const parseFile = new Parse.File(file.name, file);
                await parseFile.save();
                
                const imageFile = new ImageFile();
                imageFile.set('file', parseFile);
                imageFile.set('name', file.name);
                imageFile.set('user', currentUser); // Associar a imagem ao usuário
                
                // Configurar ACL para permitir acesso ao usuário atual
                const acl = new Parse.ACL(currentUser);
                acl.setPublicReadAccess(true); // Opcional: permitir leitura pública
                imageFile.setACL(acl);
                
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
            const currentUser = Parse.User.current();
            if (!currentUser) {
                galleryContainer.innerHTML = '<p>Faça login para ver suas imagens</p>';
                return;
            }
            
            const query = new Parse.Query(ImageFile);
            query.equalTo('user', currentUser); // Filtrar imagens do usuário atual
            query.descending('createdAt');
            
            const images = await query.find();
            
            galleryContainer.innerHTML = '';
            
            if (images.length === 0) {
                galleryContainer.innerHTML = '<p>Você ainda não tem imagens. Faça upload de algumas!</p>';
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
        
        const currentUser = Parse.User.current();
        if (!currentUser) {
            showAlert('warning', 'Você precisa estar logado para excluir imagens');
            closeImageViewModal();
            openAuthModal();
            return;
        }
        
        try {
            const query = new Parse.Query(ImageFile);
            const image = await query.get(currentImageId);
            
            // Verificar se o usuário atual é o proprietário da imagem
            const imageUser = image.get('user');
            if (imageUser && imageUser.id !== currentUser.id) {
                showAlert('error', 'Você não tem permissão para excluir esta imagem');
                return;
            }
            
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
    
    // Carregar tarefas e imagens inicialmente
    loadImages();
});