<<<<<<< HEAD
<<<<<<< Updated upstream
=======
>>>>>>> parent of fc5f65a (v19)
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
=======
// Inicialização do Parse
Parse.initialize('xrkPQgeanlbyRGOOqaR9kChOXIrEMZnPhOo271qp', 'nQoYP0tnyrYOn1XoKTpjx777AWP4WhIL4aZL37S1');
Parse.serverURL = 'https://parseapi.back4app.com/';

// Definir classes Parse
const Task = Parse.Object.extend('Task');
const Note = Parse.Object.extend('Note');
const ImageFile = Parse.Object.extend('ImageFile');

// Variáveis globais
let currentTasks = [];
let currentNotes = [];
let currentImages = [];
let currentTab = 'tasks';
let editingTaskId = null;
let editingNoteId = null;

// Classe para gerenciar acessibilidade
class AccessibilityManager {
    constructor() {
        this.settings = {
            darkMode: false,
            fontSize: 16,
            largeButtons: false,
            keyboardNav: false,
            textToSpeech: false,
            libras: false,
            imageDesc: false
        };
        
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.applySettings();
    }
    
    setupEventListeners() {
        // Verificar se os elementos existem antes de adicionar event listeners
        const accessibilityToggle = document.getElementById('accessibilityToggle');
        if (accessibilityToggle) {
            accessibilityToggle.addEventListener('click', () => {
                this.togglePanel();
            });
        }
        
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }
        
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                this.setFontSize(parseInt(e.target.value));
            });
        }
        
        const decreaseFontBtn = document.getElementById('decreaseFontBtn');
        if (decreaseFontBtn) {
            decreaseFontBtn.addEventListener('click', () => {
                this.setFontSize(Math.max(12, this.settings.fontSize - 2));
            });
        }
        
        const increaseFontBtn = document.getElementById('increaseFontBtn');
        if (increaseFontBtn) {
            increaseFontBtn.addEventListener('click', () => {
                this.setFontSize(Math.min(24, this.settings.fontSize + 2));
            });
        }
        
        const largeBtnsToggle = document.getElementById('largeBtnsToggle');
        if (largeBtnsToggle) {
            largeBtnsToggle.addEventListener('click', () => {
                this.toggleLargeButtons();
            });
        }
        
        const keyboardNavToggle = document.getElementById('keyboardNavToggle');
        if (keyboardNavToggle) {
            keyboardNavToggle.addEventListener('click', () => {
                this.toggleKeyboardNav();
            });
        }
        
        const textToSpeechToggle = document.getElementById('textToSpeechToggle');
        if (textToSpeechToggle) {
            textToSpeechToggle.addEventListener('click', () => {
                this.toggleTextToSpeech();
            });
        }
        
        const librasToggle = document.getElementById('librasToggle');
        if (librasToggle) {
            librasToggle.addEventListener('click', () => {
                this.toggleLibras();
            });
        }
        
        const imageDescToggle = document.getElementById('imageDescToggle');
        if (imageDescToggle) {
            imageDescToggle.addEventListener('click', () => {
                this.toggleImageDesc();
            });
        }
        
        const resetAccessibility = document.getElementById('resetAccessibility');
        if (resetAccessibility) {
            resetAccessibility.addEventListener('click', () => {
                this.resetSettings();
            });
        }
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (this.settings.keyboardNav) {
                this.handleKeyboardNavigation(e);
            }
        });
    }
    
    togglePanel() {
        const controls = document.getElementById('accessibilityControls');
        if (controls) {
            const isVisible = controls.style.display !== 'none';
            controls.style.display = isVisible ? 'none' : 'block';
        }
    }
    
    toggleDarkMode() {
        this.settings.darkMode = !this.settings.darkMode;
        document.body.classList.toggle('dark-mode', this.settings.darkMode);
        this.updateButtonState('darkModeToggle', this.settings.darkMode);
        this.saveSettings();
    }
    
    setFontSize(size) {
        this.settings.fontSize = size;
        document.documentElement.style.setProperty('--font-size', `${size}px`);
        
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        const fontSizeDisplay = document.getElementById('fontSizeDisplay');
        
        if (fontSizeSlider) fontSizeSlider.value = size;
        if (fontSizeDisplay) fontSizeDisplay.textContent = `${size}px`;
        
        this.saveSettings();
    }
    
    toggleLargeButtons() {
        this.settings.largeButtons = !this.settings.largeButtons;
        document.body.classList.toggle('large-buttons', this.settings.largeButtons);
        this.updateButtonState('largeBtnsToggle', this.settings.largeButtons);
        this.saveSettings();
    }
    
    toggleKeyboardNav() {
        this.settings.keyboardNav = !this.settings.keyboardNav;
        this.updateButtonState('keyboardNavToggle', this.settings.keyboardNav);
        this.saveSettings();
        
        if (this.settings.keyboardNav) {
            this.speak('Navegação por teclado ativada. Use Tab para navegar e Enter para selecionar.');
        }
    }
    
    toggleTextToSpeech() {
        this.settings.textToSpeech = !this.settings.textToSpeech;
        this.updateButtonState('textToSpeechToggle', this.settings.textToSpeech);
        this.saveSettings();
        
        if (this.settings.textToSpeech) {
            this.speak('Leitura de voz ativada');
        } else {
            this.stopSpeech();
        }
    }
    
    speak(text) {
        if (!this.settings.textToSpeech || !this.synth) return;
        
        this.stopSpeech();
        
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.lang = 'pt-BR';
        this.currentUtterance.rate = 0.8;
        this.currentUtterance.pitch = 1;
        
        this.synth.speak(this.currentUtterance);
    }
    
    stopSpeech() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
    
    toggleLibras() {
        this.settings.libras = !this.settings.libras;
        this.updateButtonState('librasToggle', this.settings.libras);
        this.saveSettings();
        
        if (this.settings.libras) {
            alert('Funcionalidade de tradução em Libras ativada (demonstração)');
        }
    }
    
    toggleImageDesc() {
        this.settings.imageDesc = !this.settings.imageDesc;
        this.updateButtonState('imageDescToggle', this.settings.imageDesc);
        
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (this.settings.imageDesc) {
                if (!img.alt) img.alt = 'Imagem sem descrição';
                img.title = img.alt;
            } else {
                img.removeAttribute('title');
            }
        });
        
        this.saveSettings();
    }
    
    handleKeyboardNavigation(e) {
        if (e.key === 'Tab') {
            const focusableElements = document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
                let nextIndex;
                
                if (e.shiftKey) {
                    nextIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
                } else {
                    nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
                }
                
                focusableElements[nextIndex].focus();
                e.preventDefault();
            }
        }
    }
    
    updateButtonState(buttonId, isActive) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive.toString());
        }
    }
    
    resetSettings() {
        this.settings = {
            darkMode: false,
            fontSize: 16,
            largeButtons: false,
            keyboardNav: false,
            textToSpeech: false,
            libras: false,
            imageDesc: false
        };
        
        this.applySettings();
        this.saveSettings();
        
        alert('Configurações de acessibilidade restauradas para o padrão');
    }
    
    applySettings() {
        // Aplicar modo escuro
        document.body.classList.toggle('dark-mode', this.settings.darkMode);
        this.updateButtonState('darkModeToggle', this.settings.darkMode);
        
        // Aplicar tamanho da fonte
        this.setFontSize(this.settings.fontSize);
        
        // Aplicar botões grandes
        document.body.classList.toggle('large-buttons', this.settings.largeButtons);
        this.updateButtonState('largeBtnsToggle', this.settings.largeButtons);
        
        // Aplicar outros estados
        this.updateButtonState('keyboardNavToggle', this.settings.keyboardNav);
        this.updateButtonState('textToSpeechToggle', this.settings.textToSpeech);
        this.updateButtonState('librasToggle', this.settings.libras);
        this.updateButtonState('imageDescToggle', this.settings.imageDesc);
        
        // Aplicar descrição de imagens
        if (this.settings.imageDesc) {
            this.toggleImageDesc();
        }
    }
    
    saveSettings() {
        localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('accessibilitySettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }
}

// ===== FUNÇÕES DE CARREGAMENTO DE DADOS =====

// Carregar tarefas do Parse
async function loadTasks() {
    try {
        const query = new Parse.Query(Task);
        query.descending('createdAt');
        const tasks = await query.find();
        
        currentTasks = tasks.map(task => ({
            id: task.id,
            title: task.get('title'),
            description: task.get('description'),
            priority: task.get('priority'),
            category: task.get('category'),
            dueDate: task.get('dueDate'),
            location: task.get('location'),
            completed: task.get('completed') || false,
            createdAt: task.get('createdAt')
        }));
        
        displayTasks(currentTasks);
        console.log(`${currentTasks.length} tarefas carregadas`);
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        showNotification('Erro ao carregar tarefas', 'error');
    }
}

// Carregar notas do Parse
async function loadNotes() {
    try {
        const query = new Parse.Query(Note);
        query.descending('createdAt');
        const notes = await query.find();
        
        currentNotes = notes.map(note => ({
            id: note.id,
            title: note.get('title'),
            content: note.get('content'),
            color: note.get('color') || '#ffeb3b',
            category: note.get('category'),
            reminder: note.get('reminder'),
            createdAt: note.get('createdAt')
        }));
        
        displayNotes(currentNotes);
        console.log(`${currentNotes.length} notas carregadas`);
    } catch (error) {
        console.error('Erro ao carregar notas:', error);
        showNotification('Erro ao carregar notas', 'error');
    }
}

// Carregar imagens do Parse
async function loadImages() {
    try {
        const query = new Parse.Query(ImageFile);
        query.descending('createdAt');
        const images = await query.find();
        
        currentImages = images.map(image => ({
            id: image.id,
            name: image.get('name'),
            url: image.get('file') ? image.get('file').url() : '',
            folder: image.get('folder'),
            size: image.get('size'),
            createdAt: image.get('createdAt')
        }));
        
        displayImages(currentImages);
        updateImageCount();
        console.log(`${currentImages.length} imagens carregadas`);
    } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        showNotification('Erro ao carregar imagens', 'error');
    }
}

// ===== FUNÇÕES DE EXIBIÇÃO =====

// Exibir tarefas
function displayTasks(tasks) {
    const container = document.getElementById('tasksContainer');
    if (!container) return;
>>>>>>> Stashed changes
    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="no-tasks">Nenhuma tarefa encontrada. Clique em "Adicionar Nova Tarefa" para começar.</div>';
        return;
    }
    
<<<<<<< Updated upstream
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
=======
    container.innerHTML = tasks.map(task => `
        <div class="task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
>>>>>>> Stashed changes
            <div class="task-header">
                <h3 class="task-title">${task.title}</h3>
                <span class="task-priority priority-${task.priority?.toLowerCase() || 'baixa'}">${task.priority || 'Baixa'}</span>
            </div>
            <p class="task-description">${task.description || 'Sem descrição'}</p>
            <div class="task-details">
                <div class="detail-item">
                    <i class="fas fa-tag"></i>
                    <span>${task.category || 'Sem categoria'}</span>
                </div>
                ${task.dueDate ? `
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                ` : ''}
                ${task.location ? `
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${task.location}</span>
                    </div>
                ` : ''}
            </div>
            <div class="task-actions">
                <button class="btn btn-sm btn-secondary" onclick="editTask('${task.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm ${task.completed ? 'btn-warning' : 'btn-success'}" onclick="toggleTaskComplete('${task.id}')">
                    <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i> ${task.completed ? 'Reabrir' : 'Concluir'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join('');
}

// Exibir notas
function displayNotes(notes) {
    const container = document.getElementById('notesContainer');
    if (!container) return;
    
    if (notes.length === 0) {
        container.innerHTML = '<div class="no-notes">Nenhuma nota encontrada. Clique em "Adicionar Nova Nota" para começar.</div>';
        return;
    }
    
    container.innerHTML = notes.map(note => `
        <div class="note-card" data-note-id="${note.id}" style="background-color: ${note.color}">
            <div class="note-header">
                <h3 class="note-title">${note.title}</h3>
                <div class="note-actions">
                    <button class="note-btn" onclick="editNote('${note.id}')" title="Editar nota">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="note-btn note-delete-btn" onclick="deleteNote('${note.id}')" title="Excluir nota" aria-label="Excluir nota">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
<<<<<<< Updated upstream
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
=======
            <div class="note-content">${note.content}</div>
            ${note.category ? `<div class="note-category">${note.category}</div>` : ''}
            ${note.reminder ? `<div class="note-reminder"><i class="fas fa-bell"></i> ${new Date(note.reminder).toLocaleString('pt-BR')}</div>` : ''}
            <div class="note-date">${new Date(note.createdAt).toLocaleDateString('pt-BR')}</div>
        </div>
    `).join('');
}
>>>>>>> Stashed changes

// Exibir imagens
function displayImages(images) {
    const container = document.getElementById('galleryContainer');
    if (!container) return;
    
    if (images.length === 0) {
        container.innerHTML = '<div class="no-images">Nenhuma imagem encontrada. Faça upload de algumas imagens para começar.</div>';
        return;
    }
    
    container.innerHTML = images.map(image => `
        <div class="gallery-item" data-image-id="${image.id}">
            <div class="image-container">
                <img src="${image.url}" alt="${image.name}" loading="lazy" onclick="openImageModal('${image.url}', '${image.name}')">
                <div class="image-overlay">
                    <button class="image-action-btn" onclick="downloadImage('${image.url}', '${image.name}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="image-action-btn delete-btn" onclick="deleteImage('${image.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="image-info">
                <div class="image-name">${image.name}</div>
                <div class="image-details">
                    <span class="image-folder">${image.folder || 'Sem pasta'}</span>
                    <span class="image-date">${new Date(image.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Atualizar contador de imagens
function updateImageCount() {
    const imageCount = document.getElementById('imageCount');
    if (imageCount) {
        imageCount.textContent = `${currentImages.length} ${currentImages.length === 1 ? 'imagem' : 'imagens'}`;
    }
}

// ===== FUNÇÕES DE MANIPULAÇÃO DE DADOS =====

// Salvar tarefa
async function saveTask(taskData) {
    try {
        let task;
        if (editingTaskId) {
            const query = new Parse.Query(Task);
            task = await query.get(editingTaskId);
        } else {
            task = new Task();
        }
        
        task.set('title', taskData.title);
        task.set('description', taskData.description);
        task.set('priority', taskData.priority);
        task.set('category', taskData.category);
        task.set('dueDate', taskData.dueDate ? new Date(taskData.dueDate) : null);
        task.set('location', taskData.location);
        task.set('completed', taskData.completed || false);
        
        await task.save();
        
        showNotification(editingTaskId ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!', 'success');
        loadTasks();
        closeModal();
        editingTaskId = null;
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
        showNotification('Erro ao salvar tarefa', 'error');
    }
}

// Salvar nota
async function saveNote(noteData) {
    try {
        let note;
        if (editingNoteId) {
            const query = new Parse.Query(Note);
            note = await query.get(editingNoteId);
        } else {
            note = new Note();
        }
        
        note.set('title', noteData.title);
        note.set('content', noteData.content);
        note.set('color', noteData.color);
        note.set('category', noteData.category);
        note.set('reminder', noteData.reminder ? new Date(noteData.reminder) : null);
        
        await note.save();
        
        showNotification(editingNoteId ? 'Nota atualizada com sucesso!' : 'Nota criada com sucesso!', 'success');
        loadNotes();
        closeNoteModal();
        editingNoteId = null;
    } catch (error) {
        console.error('Erro ao salvar nota:', error);
        showNotification('Erro ao salvar nota', 'error');
    }
}

// Excluir tarefa
async function deleteTask(taskId) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    try {
        const query = new Parse.Query(Task);
        const task = await query.get(taskId);
        await task.destroy();
        
        showNotification('Tarefa excluída com sucesso!', 'success');
        loadTasks();
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        showNotification('Erro ao excluir tarefa', 'error');
    }
}

// Excluir nota
async function deleteNote(noteId) {
    if (!confirm('Tem certeza que deseja excluir esta nota?')) return;
    
    try {
        const query = new Parse.Query(Note);
        const note = await query.get(noteId);
        await note.destroy();
        
        showNotification('Nota excluída com sucesso!', 'success');
        loadNotes();
    } catch (error) {
        console.error('Erro ao excluir nota:', error);
        showNotification('Erro ao excluir nota', 'error');
    }
}

// Excluir imagem
async function deleteImage(imageId) {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;
    
    try {
        const query = new Parse.Query(ImageFile);
        const image = await query.get(imageId);
        await image.destroy();
        
        showNotification('Imagem excluída com sucesso!', 'success');
        loadImages();
    } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        showNotification('Erro ao excluir imagem', 'error');
    }
}

// Alternar status de conclusão da tarefa
async function toggleTaskComplete(taskId) {
    try {
        const query = new Parse.Query(Task);
        const task = await query.get(taskId);
        const currentStatus = task.get('completed') || false;
        
        task.set('completed', !currentStatus);
        await task.save();
        
        showNotification(`Tarefa ${!currentStatus ? 'concluída' : 'reaberta'} com sucesso!`, 'success');
        loadTasks();
    } catch (error) {
        console.error('Erro ao atualizar status da tarefa:', error);
        showNotification('Erro ao atualizar tarefa', 'error');
    }
}

// ===== FUNÇÕES DE INTERFACE =====

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('taskModal');
    if (modal) {
        modal.style.display = 'none';
    }
    editingTaskId = null;
}

// Fechar modal de nota
function closeNoteModal() {
    const modal = document.getElementById('noteModal');
    if (modal) {
        modal.style.display = 'none';
    }
    editingNoteId = null;
}

// Editar tarefa
function editTask(taskId) {
    const task = currentTasks.find(t => t.id === taskId);
    if (!task) return;
    
    editingTaskId = taskId;
    
    // Preencher formulário com dados da tarefa
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskPriority').value = task.priority || 'Baixa';
    document.getElementById('taskCategory').value = task.category || '';
    document.getElementById('taskLocation').value = task.location || '';
    
    if (task.dueDate) {
        const date = new Date(task.dueDate);
        document.getElementById('taskDueDate').value = date.toISOString().slice(0, 16);
    }
    
    // Mostrar modal
    document.getElementById('taskModal').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Editar Tarefa';
    document.getElementById('deleteBtn').style.display = 'block';
}

// Editar nota
function editNote(noteId) {
    const note = currentNotes.find(n => n.id === noteId);
    if (!note) return;
    
    editingNoteId = noteId;
    
    // Preencher formulário com dados da nota
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('noteColor').value = note.color || '#ffeb3b';
    document.getElementById('noteCategory').value = note.category || '';
    
    if (note.reminder) {
        const date = new Date(note.reminder);
        document.getElementById('noteReminder').value = date.toISOString().slice(0, 16);
    }
    
    // Mostrar modal
    document.getElementById('noteModal').style.display = 'block';
    document.getElementById('noteModalTitle').textContent = 'Editar Nota';
    document.getElementById('deleteNoteBtn').style.display = 'block';
}

// ===== INICIALIZAÇÃO =====

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar se Parse está disponível
    if (typeof Parse === 'undefined') {
        console.error('Parse SDK não está disponível');
        showNotification('Erro: Parse SDK não carregado', 'error');
        return;
    }
    
    try {
        // Inicializar gerenciador de acessibilidade
        window.accessibilityManager = new AccessibilityManager();
        
        // Carregar dados iniciais
        await loadTasks();
        await loadNotes();
        await loadImages();
        
        // Configurar navegação por abas
        setupTabNavigation();
        
        // Configurar event listeners
        setupEventListeners();
        
        console.log('Aplicação inicializada com sucesso');
        showNotification('Aplicação carregada com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        showNotification('Erro ao carregar aplicação', 'error');
    }
});

// Configurar navegação por abas
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remover classe active de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar classe active ao botão e conteúdo selecionados
            button.classList.add('active');
            document.getElementById(tabId + 'Tab').classList.add('active');
            
            currentTab = tabId;
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botões de adicionar
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            editingTaskId = null;
            document.getElementById('taskForm').reset();
            document.getElementById('taskModal').style.display = 'block';
            document.getElementById('modalTitle').textContent = 'Nova Tarefa';
            document.getElementById('deleteBtn').style.display = 'none';
        });
    }
    
    // Formulários
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(taskForm);
            const taskData = {
                title: formData.get('title'),
                description: formData.get('description'),
                priority: formData.get('priority'),
                category: formData.get('category'),
                location: formData.get('location'),
                dueDate: formData.get('dueDate')
            };
            saveTask(taskData);
        });
    }
    
    // Botões de fechar modal
    const closeButtons = document.querySelectorAll('.close-btn, #cancelBtn, #cancelNoteBtn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal();
            closeNoteModal();
        });
    });
}

// Sistema experimental de exclusão (mantido do código original)
class ExperimentalDeletion {
    static markAsDeleted(objectId, objectType) {
        console.log(`Marcando ${objectType} ${objectId} como deletado`);
    }
    
    static batchDelete(objectIds, objectType) {
        console.log(`Deletando em lote ${objectIds.length} ${objectType}s`);
    }
    
    static deleteViaCloudFunction(objectId, objectType) {
        console.log(`Deletando ${objectType} ${objectId} via cloud function`);
    }
}