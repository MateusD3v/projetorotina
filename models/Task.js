// models/Task.js
const Parse = require('parse/node');

class Task {
    // Criar nova tarefa
    static async create(taskData) {
        try {
            const Task = Parse.Object.extend('Task');
            const task = new Task();

            // Definir os campos da tarefa
            task.set('title', taskData.title);
            task.set('description', taskData.description);
            task.set('priority', taskData.priority);
            task.set('status', taskData.status);
            task.set('units', taskData.units);
            task.set('deadline', taskData.deadline);

            // Salvar no Back4App
            const result = await task.save();
            
            return {
                id: result.id,
                ...taskData
            };
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            throw error;
        }
    }

    // Obter todas as tarefas
    static async getAll() {
        try {
            const Task = Parse.Object.extend('Task');
            const query = new Parse.Query(Task);
            
            // Ordenar por prioridade (Alta > Média > Baixa)
            query.descending('priority');
            
            const results = await query.find();
            
            return results.map(task => ({
                id: task.id,
                title: task.get('title'),
                description: task.get('description'),
                priority: task.get('priority'),
                status: task.get('status'),
                units: task.get('units'),
                deadline: task.get('deadline'),
                createdAt: task.get('createdAt'),
                updatedAt: task.get('updatedAt')
            }));
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            throw error;
        }
    }

    // Obter tarefa por ID
    static async getById(taskId) {
        try {
            const Task = Parse.Object.extend('Task');
            const query = new Parse.Query(Task);
            const task = await query.get(taskId);
            
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }
            
            return {
                id: task.id,
                title: task.get('title'),
                description: task.get('description'),
                priority: task.get('priority'),
                status: task.get('status'),
                units: task.get('units'),
                deadline: task.get('deadline'),
                createdAt: task.get('createdAt'),
                updatedAt: task.get('updatedAt')
            };
        } catch (error) {
            console.error('Erro ao buscar tarefa:', error);
            throw error;
        }
    }

    // Atualizar tarefa
    static async update(taskId, taskData) {
        try {
            const Task = Parse.Object.extend('Task');
            const query = new Parse.Query(Task);
            const task = await query.get(taskId);
            
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }
            
            // Atualizar campos
            task.set('title', taskData.title);
            task.set('description', taskData.description);
            task.set('priority', taskData.priority);
            task.set('status', taskData.status);
            task.set('units', taskData.units);
            task.set('deadline', taskData.deadline);
            
            const result = await task.save();
            
            return {
                id: result.id,
                ...taskData
            };
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            throw error;
        }
    }

    // Excluir tarefa
    static async delete(taskId) {
        try {
            const Task = Parse.Object.extend('Task');
            const query = new Parse.Query(Task);
            const task = await query.get(taskId);
            
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }
            
            await task.destroy();
            return { success: true };
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            throw error;
        }
    }

    // Métodos adicionais úteis

    // Obter tarefas por status
    static async getByStatus(status) {
        try {
            const Task = Parse.Object.extend('Task');
            const query = new Parse.Query(Task);
            query.equalTo('status', status);
            query.descending('priority');
            
            const results = await query.find();
            
            return results.map(task => ({
                id: task.id,
                title: task.get('title'),
                description: task.get('description'),
                priority: task.get('priority'),
                status: task.get('status'),
                units: task.get('units'),
                deadline: task.get('deadline')
            }));
        } catch (error) {
            console.error('Erro ao buscar tarefas por status:', error);
            throw error;
        }
    }

    // Obter tarefas por prioridade
    static async getByPriority(priority) {
        try {
            const Task = Parse.Object.extend('Task');
            const query = new Parse.Query(Task);
            query.equalTo('priority', priority);
            query.ascending('createdAt');
            
            const results = await query.find();
            
            return results.map(task => ({
                id: task.id,
                title: task.get('title'),
                description: task.get('description'),
                priority: task.get('priority'),
                status: task.get('status'),
                units: task.get('units'),
                deadline: task.get('deadline')
            }));
        } catch (error) {
            console.error('Erro ao buscar tarefas por prioridade:', error);
            throw error;
        }
    }

    // Obter contagem de tarefas por status
    static async getStatusCount() {
        try {
            const Task = Parse.Object.extend('Task');
            const query = new Parse.Query(Task);
            
            const results = await query.find();
            const count = {
                pending: 0,
                inProgress: 0,
                completed: 0
            };
            
            results.forEach(task => {
                const status = task.get('status');
                if (status === 'Pendente') count.pending++;
                if (status === 'Em Andamento') count.inProgress++;
                if (status === 'Concluído') count.completed++;
            });
            
            return count;
        } catch (error) {
            console.error('Erro ao contar tarefas por status:', error);
            throw error;
        }
    }
}

module.exports = Task;