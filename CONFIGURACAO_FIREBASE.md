# Como Configurar o Firebase - Guia Passo a Passo

## 🔥 Configuração Completa do Firebase

### 1. Acessar o Console Firebase

1. Acesse [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Faça login com sua conta Google
3. Localize o projeto **"projetorotinha"** ou crie um novo

### 2. Habilitar o Firestore Database

#### Passo a Passo:
1. No painel do projeto, clique em **"Firestore Database"** no menu lateral
2. Clique em **"Criar banco de dados"**
3. Escolha o modo:
   - **Modo de teste** (para desenvolvimento) - permite leitura/escrita por 30 dias
   - **Modo de produção** (para produção) - requer regras de segurança
4. Selecione a localização:
   - Recomendado: **southamerica-east1 (São Paulo)**
5. Clique em **"Concluído"**

### 3. Configurar Regras do Firestore

#### Para Desenvolvimento (Temporário):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Para Produção (Recomendado):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if true; // Ajuste conforme necessário
    }
  }
}
```

### 4. Verificar/Gerar Chave do Service Account

1. Vá em **Configurações do Projeto** (ícone de engrenagem)
2. Clique na aba **"Contas de serviço"**
3. Selecione **"Node.js"**
4. Clique em **"Gerar nova chave privada"**
5. Baixe o arquivo JSON
6. Renomeie para: `projetorotinha-firebase-adminsdk-fbsvc-c76ecbddbf.json`
7. Substitua o arquivo existente no projeto

### 5. Verificar Configurações do Projeto

#### Arquivo: `config/firebase.js`
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../projetorotinha-firebase-adminsdk-fbsvc-c76ecbddbf.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID || 'projetorotinha'
});

const db = admin.firestore();
module.exports = { admin, db };
```

#### Arquivo: `.env`
```env
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID=projetorotinha
APP_NAME=Sistema de Rotina de Manutenção TI
APP_VERSION=1.0.0
```

### 6. Testar a Configuração

#### Método 1: Usar as rotas de teste
```bash
# Testar API
curl http://localhost:3000/tasks/test

# Testar dados mock
curl http://localhost:3000/tasks/mock

# Testar Firebase (deve funcionar após configuração)
curl http://localhost:3000/tasks
```

#### Método 2: Verificar logs do servidor
- Inicie o servidor: `node app.js`
- Acesse a aplicação no navegador
- Verifique o console para mensagens de erro

### 7. Estrutura de Dados no Firestore

O Firestore criará automaticamente a coleção `tasks` com documentos no formato:

```json
{
  "title": "Nome da Tarefa",
  "description": "Descrição detalhada",
  "priority": "Alta|Média|Baixa",
  "status": "Pendente|Em Andamento|Concluída",
  "units": "TI|Manutenção|Geral",
  "deadline": 7,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 8. Solução de Problemas Comuns

#### Erro: "Invalid authentication credentials"
**Solução:**
1. Verifique se o Firestore está habilitado
2. Gere uma nova chave do service account
3. Verifique se o arquivo JSON está no local correto
4. Confirme se o `projectId` está correto

#### Erro: "Permission denied"
**Solução:**
1. Verifique as regras do Firestore
2. Use regras de teste temporariamente
3. Verifique se a coleção existe

#### Erro: "Project not found"
**Solução:**
1. Confirme o nome do projeto no Console Firebase
2. Verifique o `project_id` no arquivo JSON
3. Atualize o `.env` com o ID correto

### 9. Checklist de Verificação

- [ ] Projeto Firebase criado/acessível
- [ ] Firestore Database habilitado
- [ ] Regras do Firestore configuradas
- [ ] Chave do service account baixada
- [ ] Arquivo JSON no local correto
- [ ] Variáveis de ambiente configuradas
- [ ] Servidor reiniciado
- [ ] Testes realizados

### 10. Comandos Úteis

```bash
# Iniciar servidor
node app.js

# Verificar se está funcionando
curl http://localhost:3000/tasks/test

# Ver logs em tempo real
# (os logs aparecem no terminal onde o servidor está rodando)
```

---

## 🚀 Após a Configuração

Quando o Firebase estiver funcionando:
1. O sistema parará de usar dados mock
2. As tarefas serão salvas no Firestore
3. Os dados persistirão entre reinicializações
4. Você poderá ver os dados no Console Firebase

## 📞 Suporte

Se ainda houver problemas:
1. Verifique os logs do servidor
2. Consulte a documentação do Firebase
3. Verifique se todas as etapas foram seguidas

**Status Atual**: O sistema funciona com dados mock como fallback, garantindo que a aplicação continue operacional durante a configuração do Firebase.