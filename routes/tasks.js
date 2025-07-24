const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { verifyToken } = require('../middleware/auth');

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

// Buscar todas as tarefas do usuário autenticado
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log(`Buscando tarefas para usuário: ${req.user.email}`);
    const tasks = await Task.getAll(req.user.uid);
    console.log('Tarefas encontradas:', tasks.length);
    res.json(tasks);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar tarefas',
      details: error.message 
    });
  }
});

// Criar nova tarefa para o usuário autenticado
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log(`Criando tarefa para usuário: ${req.user.email}`);
    const newTask = await Task.create(req.body, req.user.uid);
    console.log('Tarefa criada com sucesso:', newTask.id);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ 
      error: 'Erro ao criar tarefa',
      details: error.message 
    });
  }
});

// Buscar tarefa específica do usuário autenticado
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.getById(req.params.id, req.user.uid);
    res.json(task);
  } catch (error) {
    const statusCode = error.message.includes('não encontrada') ? 404 : 
                      error.message.includes('Acesso negado') ? 403 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

// Atualizar tarefa do usuário autenticado
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedTask = await Task.update(req.params.id, req.body, req.user.uid);
    res.json(updatedTask);
  } catch (error) {
    const statusCode = error.message.includes('não encontrada') ? 404 : 
                      error.message.includes('Acesso negado') ? 403 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

// Excluir tarefa do usuário autenticado
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await Task.delete(req.params.id, req.user.uid);
    res.json(result);
  } catch (error) {
    const statusCode = error.message.includes('não encontrada') ? 404 : 
                      error.message.includes('Acesso negado') ? 403 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

module.exports = router;