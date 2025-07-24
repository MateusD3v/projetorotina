const admin = require('../config/firebase');
const db = admin.firestore();
const tasksRef = db.collection('tasks');

class Task {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.status = data.status;
    this.units = data.units;
    this.deadline = data.deadline;
    this.userId = data.userId;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static async create(taskData, userId) {
    try {
      const docRef = await tasksRef.add({
        ...taskData,
        userId: userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { id: docRef.id, ...taskData, userId };
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  }

  // Buscar todas as tarefas do usuário
  static async getAll(userId) {
    try {
      const snapshot = await tasksRef.where('userId', '==', userId).get();
      const tasks = [];
      
      snapshot.forEach(doc => {
        tasks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return tasks;
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      throw new Error('Falha ao buscar tarefas');
    }
  }

  // Buscar tarefa por ID (verificando propriedade do usuário)
  static async getById(id, userId) {
    try {
      const doc = await tasksRef.doc(id).get();
      
      if (!doc.exists) {
        throw new Error('Tarefa não encontrada');
      }
      
      const taskData = doc.data();
      
      // Verificar se a tarefa pertence ao usuário
      if (taskData.userId !== userId) {
        throw new Error('Acesso negado: tarefa não pertence ao usuário');
      }
      
      return { id: doc.id, ...taskData };
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      throw error;
    }
  }

  // Atualizar tarefa (verificando propriedade do usuário)
  static async update(id, updateData, userId) {
    try {
      // Primeiro verificar se a tarefa existe e pertence ao usuário
      const doc = await tasksRef.doc(id).get();
      
      if (!doc.exists) {
        throw new Error('Tarefa não encontrada');
      }
      
      const taskData = doc.data();
      
      if (taskData.userId !== userId) {
        throw new Error('Acesso negado: tarefa não pertence ao usuário');
      }
      
      // Atualizar a tarefa
      await tasksRef.doc(id).update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { id, ...updateData, userId };
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }

  // Excluir tarefa (verificando propriedade do usuário)
  static async delete(taskId, userId) {
    try {
      // Primeiro verificar se a tarefa existe e pertence ao usuário
      const doc = await tasksRef.doc(taskId).get();
      
      if (!doc.exists) {
        throw new Error('Tarefa não encontrada');
      }
      
      const taskData = doc.data();
      
      if (taskData.userId !== userId) {
        throw new Error('Acesso negado: tarefa não pertence ao usuário');
      }
      
      // Excluir a tarefa
      await tasksRef.doc(taskId).delete();
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw error;
    }
  }

  // Métodos adicionais
  static async getByStatus(status) {
    try {
      const snapshot = await tasksRef
        .where('status', '==', status)
        .orderBy('priority', 'desc')
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar tarefas por status:', error);
      throw error;
    }
  }
}

module.exports = Task;