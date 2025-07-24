const admin = require('firebase-admin');
const db = admin.firestore();
const tasksRef = db.collection('tasks');

class Task {
  static async create(taskData) {
    try {
      const docRef = await tasksRef.add({
        ...taskData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { id: docRef.id, ...taskData };
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const snapshot = await tasksRef.orderBy('priority', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      throw error;
    }
  }

  static async getById(taskId) {
    try {
      const doc = await tasksRef.doc(taskId).get();
      if (!doc.exists) throw new Error('Tarefa não encontrada');
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      throw error;
    }
  }

  static async update(taskId, taskData) {
    try {
      await tasksRef.doc(taskId).update({
        ...taskData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { id: taskId, ...taskData };
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }

  static async delete(taskId) {
    try {
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