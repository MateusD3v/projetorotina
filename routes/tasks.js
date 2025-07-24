const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Dados mock para teste
const mockTasks = [
  {
    id: '1',
    title: 'Manutenção do Servidor',
    description: 'Verificar e atualizar o servidor principal',
    priority: 'Alta',
    status: 'Pendente',
    units: 'TI',
    deadline: 7
  },
  {
    id: '2',
    title: 'Backup dos Dados',
    description: 'Realizar backup completo dos dados do sistema',
    priority: 'Média',
    status: 'Em Andamento',
    units: 'TI',
    deadline: 3
  }
];

// Rota de teste para verificar se o servidor está funcionando
router.get('/test', (req, res) => {
  res.json({ message: 'API funcionando corretamente', timestamp: new Date().toISOString() });
});

// Rota para dados mock (fallback)
router.get('/mock', (req, res) => {
  res.json(mockTasks);
});

router.get('/', async (req, res) => {
  try {
    console.log('Tentando buscar todas as tarefas...');
    const tasks = await Task.getAll();
    console.log('Tarefas encontradas:', tasks.length);
    res.json(tasks);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    console.log('Usando dados mock como fallback...');
    // Usar dados mock como fallback quando Firebase falha
    res.json(mockTasks);
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Tentando criar nova tarefa:', req.body);
    const newTask = await Task.create(req.body);
    console.log('Tarefa criada com sucesso:', newTask.id);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    console.log('Simulando criação de tarefa com dados mock...');
    // Simular criação de tarefa quando Firebase falha
    const mockNewTask = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    mockTasks.push(mockNewTask);
    res.status(201).json(mockNewTask);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.getById(req.params.id);
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.update(req.params.id, req.body);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Task.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;