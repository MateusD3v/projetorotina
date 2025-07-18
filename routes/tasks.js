const express = require('express');
const router = express.Router();
const Parse = require('parse/node');

// Listar todas as tarefas
router.get('/', async (req, res) => {
  try {
    const Task = Parse.Object.extend('Task');
    const query = new Parse.Query(Task);
    const results = await query.find();
    
    const tasks = results.map(task => ({
      id: task.id,
      title: task.get('title'),
      description: task.get('description'),
      priority: task.get('priority'),
      status: task.get('status'),
      units: task.get('units'),
      deadline: task.get('deadline')
    }));
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar nova tarefa
router.post('/', async (req, res) => {
  try {
    const Task = Parse.Object.extend('Task');
    const task = new Task();
    
    task.set('title', req.body.title);
    task.set('description', req.body.description);
    task.set('priority', req.body.priority);
    task.set('status', req.body.status);
    task.set('units', req.body.units);
    task.set('deadline', req.body.deadline);
    
    const result = await task.save();
    res.json({
      id: result.id,
      ...req.body
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar tarefa
router.put('/:id', async (req, res) => {
  try {
    const Task = Parse.Object.extend('Task');
    const query = new Parse.Query(Task);
    const task = await query.get(req.params.id);
    
    task.set('title', req.body.title);
    task.set('description', req.body.description);
    task.set('priority', req.body.priority);
    task.set('status', req.body.status);
    task.set('units', req.body.units);
    task.set('deadline', req.body.deadline);
    
    const result = await task.save();
    res.json({
      id: result.id,
      ...req.body
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Excluir tarefa
router.delete('/:id', async (req, res) => {
  try {
    const Task = Parse.Object.extend('Task');
    const query = new Parse.Query(Task);
    const task = await query.get(req.params.id);
    
    await task.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;