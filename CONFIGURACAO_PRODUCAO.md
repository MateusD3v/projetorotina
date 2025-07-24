# 🔒 Configuração para Modo de Produção

## ✅ Pré-requisitos Concluídos

- ✅ Firestore Database criado em modo de produção
- ✅ Chave de serviço configurada
- ✅ Código preparado para autenticação

## 🛠️ Próximos Passos Obrigatórios

### 1. 🔥 Configurar Regras de Segurança do Firestore

**No Console Firebase:**
1. Acesse "Firestore Database"
2. Clique na aba "**Regras**" (Rules)
3. Substitua as regras padrão por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso apenas a tarefas do próprio usuário
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
                        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                   request.auth.uid == request.resource.data.userId;
    }
  }
}
```

4. Clique em "**Publicar**" (Publish)

### 2. 🔑 Configurar Firebase Authentication

**No Console Firebase:**
1. Acesse "**Authentication**"
2. Clique na aba "**Método de login**"
3. Ative "**Email/senha**"
4. Configure domínios autorizados se necessário

### 3. 🌐 Obter Configuração do Firebase Web

**No Console Firebase:**
1. Acesse "**Configurações do projeto**" (ícone de engrenagem)
2. Role até "**Seus aplicativos**"
3. Clique em "**Adicionar app**" → "**Web**" (se não tiver)
4. Copie a configuração `firebaseConfig`

### 4. 📝 Atualizar Configuração nos Arquivos

**Substitua a configuração em:**

#### `public/js/script.js` (linha 6-12):
```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

#### `public/views/login.html` (linha 118-124):
```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 5. 🧪 Testar a Configuração

1. **Reinicie o servidor:**
   ```bash
   node app.js
   ```

2. **Acesse:** `http://localhost:3000`

3. **Você será redirecionado para:** `http://localhost:3000/login.html`

4. **Crie uma conta de teste:**
   - Email: `teste@exemplo.com`
   - Senha: `123456` (mínimo 6 caracteres)

5. **Teste o Firebase:**
   ```bash
   node test-firebase.js
   ```

## 🔐 Como Funciona a Segurança

### **Autenticação (Frontend)**
- Usuários fazem login com email/senha
- Firebase gera um token JWT
- Token é enviado em todas as requisições

### **Autorização (Backend)**
- Middleware verifica token em cada requisição
- Extrai `userId` do token
- Operações só acessam dados do usuário logado

### **Firestore (Database)**
- Regras verificam se `request.auth.uid == resource.data.userId`
- Cada tarefa tem um campo `userId`
- Usuários só veem suas próprias tarefas

## 🚨 Regras de Segurança Explicadas

```javascript
// Permitir leitura/escrita apenas se:
// 1. Usuário está autenticado (request.auth != null)
// 2. UID do usuário == userId da tarefa
allow read, write: if request.auth != null && 
                  request.auth.uid == resource.data.userId;

// Permitir criação apenas se:
// 1. Usuário está autenticado
// 2. UID do usuário == userId que está sendo criado
allow create: if request.auth != null && 
             request.auth.uid == request.resource.data.userId;
```

## ✅ Verificação Final

**Após configurar tudo, verifique:**

1. ✅ Login funciona
2. ✅ Tarefas são criadas com `userId`
3. ✅ Usuários só veem suas tarefas
4. ✅ `node test-firebase.js` funciona
5. ✅ Logout funciona

## 🆘 Solução de Problemas

### **Erro: "Token inválido"**
- Verifique se a configuração `firebaseConfig` está correta
- Confirme se Authentication está ativado

### **Erro: "Acesso negado"**
- Verifique se as regras do Firestore foram publicadas
- Confirme se o `userId` está sendo salvo nas tarefas

### **Erro: "CORS"**
- Adicione seu domínio nos domínios autorizados do Firebase

## 📚 Arquivos Modificados

- ✅ `middleware/auth.js` - Verificação de tokens
- ✅ `models/Task.js` - Filtros por usuário
- ✅ `routes/tasks.js` - Autenticação obrigatória
- ✅ `public/js/script.js` - Login/logout frontend
- ✅ `public/views/login.html` - Página de login
- ✅ `public/views/index.ejs` - Script como módulo
- ✅ `app.js` - Rota para login

**Sua aplicação agora está pronta para produção com segurança completa! 🎉**