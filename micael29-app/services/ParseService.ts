// Configuração do Back4App
const BACK4APP_CONFIG = {
  applicationId: 'xrkPQgeanlbyRGOOqaR9kChOXIrEMZnPhOo271qp',
  javascriptKey: 'nQoYP0tnyrYOn1XoKTpjx777AWP4WhIL4aZL37S1',
  serverURL: 'https://parseapi.back4app.com'
};

export interface TaskData {
  id?: string;
  title: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  units: string;
  deadline: number;
}

export interface ImageData {
  id?: string;
  name: string;
  url: string;
}

export class ParseService {
  private static getHeaders() {
    return {
      'X-Parse-Application-Id': BACK4APP_CONFIG.applicationId,
      'X-Parse-JavaScript-Key': BACK4APP_CONFIG.javascriptKey,
      'Content-Type': 'application/json'
    };
  }

  // Métodos para Tarefas
  static async getTasks(): Promise<TaskData[]> {
    try {
      const response = await fetch(`${BACK4APP_CONFIG.serverURL}/classes/Task?order=-createdAt`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return data.results.map((task: any) => ({
        id: task.objectId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        units: task.units,
        deadline: task.deadline
      }));
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      throw error;
    }
  }

  static async saveTask(taskData: TaskData): Promise<TaskData> {
    try {
      let response;
      const taskPayload = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        units: taskData.units,
        deadline: taskData.deadline
      };

      if (taskData.id) {
        // Atualizar tarefa existente
        response = await fetch(`${BACK4APP_CONFIG.serverURL}/classes/Task/${taskData.id}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(taskPayload)
        });
      } else {
        // Criar nova tarefa
        response = await fetch(`${BACK4APP_CONFIG.serverURL}/classes/Task`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(taskPayload)
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        id: result.objectId || taskData.id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        units: taskData.units,
        deadline: taskData.deadline
      };
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${BACK4APP_CONFIG.serverURL}/classes/Task/${taskId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw error;
    }
  }

  // Métodos para Imagens
  static async getImages(): Promise<ImageData[]> {
    try {
      const response = await fetch(`${BACK4APP_CONFIG.serverURL}/classes/ImageFile?order=-createdAt`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return data.results.map((image: any) => ({
        id: image.objectId,
        name: image.name,
        url: image.file?.url || ''
      }));
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      throw error;
    }
  }

  static async uploadImage(imageUri: string, imageName: string): Promise<ImageData> {
    try {
      // Primeiro, fazer upload do arquivo
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: imageName
      } as any);

      const fileResponse = await fetch(`${BACK4APP_CONFIG.serverURL}/files/${imageName}`, {
        method: 'POST',
        headers: {
          'X-Parse-Application-Id': BACK4APP_CONFIG.applicationId,
          'X-Parse-JavaScript-Key': BACK4APP_CONFIG.javascriptKey
        },
        body: formData
      });

      if (!fileResponse.ok) {
        throw new Error(`HTTP error! status: ${fileResponse.status}`);
      }

      const fileResult = await fileResponse.json();

      // Depois, criar o objeto ImageFile
      const imageResponse = await fetch(`${BACK4APP_CONFIG.serverURL}/classes/ImageFile`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          name: imageName,
          file: {
            __type: 'File',
            name: fileResult.name,
            url: fileResult.url
          }
        })
      });

      if (!imageResponse.ok) {
        throw new Error(`HTTP error! status: ${imageResponse.status}`);
      }

      const imageResult = await imageResponse.json();

      return {
        id: imageResult.objectId,
        name: imageName,
        url: fileResult.url
      };
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  static async deleteImage(imageId: string): Promise<void> {
    try {
      const response = await fetch(`${BACK4APP_CONFIG.serverURL}/classes/ImageFile/${imageId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      throw error;
    }
  }
}

export default ParseService;