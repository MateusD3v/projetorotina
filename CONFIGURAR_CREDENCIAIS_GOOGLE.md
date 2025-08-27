# Como Configurar Credenciais do Google Calendar

Este guia te ajudará a criar uma conta Google (se necessário) e configurar as credenciais para integração com o Google Calendar.

## Opção 1: Usar Conta Google Existente

Se você já tem uma conta Google (Gmail, YouTube, etc.), pode usar ela diretamente.

## Opção 2: Criar Nova Conta Google

### Passo 1: Criar Conta Google
1. Acesse [accounts.google.com](https://accounts.google.com/signup)
2. Clique em "Criar conta" > "Para uso pessoal"
3. Preencha as informações:
   - Nome e sobrenome
   - Nome de usuário (será seu email @gmail.com)
   - Senha forte
4. Adicione número de telefone para verificação
5. Complete a verificação por SMS
6. Aceite os termos de serviço

### Passo 2: Configurar Projeto no Google Cloud Console

1. **Acessar Google Cloud Console**
   - Vá para [console.cloud.google.com](https://console.cloud.google.com/)
   - Faça login com sua conta Google

2. **Criar Novo Projeto**
   - Clique no seletor de projeto (topo da página)
   - Clique em "NOVO PROJETO"
   - Nome do projeto: `Sistema-Tarefas-[SeuNome]`
   - Clique em "CRIAR"
   - Aguarde a criação (pode levar alguns minutos)

3. **Selecionar o Projeto**
   - Certifique-se de que o projeto criado está selecionado
   - O nome deve aparecer no topo da página

### Passo 3: Habilitar API do Google Calendar

1. **Acessar Biblioteca de APIs**
   - No menu lateral ☰, vá em "APIs e serviços" > "Biblioteca"
   - Ou use a busca: "API Library"

2. **Encontrar e Habilitar a API**
   - Na barra de pesquisa, digite: `Google Calendar API`
   - Clique no resultado "Google Calendar API"
   - Clique no botão azul "ATIVAR"
   - Aguarde a ativação

### Passo 4: Configurar Tela de Consentimento OAuth

1. **Acessar Configuração OAuth**
   - Vá em "APIs e serviços" > "Tela de consentimento OAuth"

2. **Configurar Tipo de Usuário**
   - Selecione "Externo"
   - Clique em "CRIAR"

3. **Preencher Informações Obrigatórias**
   - **Nome do app**: `Sistema de Tarefas`
   - **Email de suporte do usuário**: seu email Google
   - **Logotipo do app**: (opcional, pode pular)
   - **Domínio do app**: (pode deixar em branco)
   - **Links**: (pode deixar em branco)
   - **Email do desenvolvedor**: seu email Google
   - Clique em "SALVAR E CONTINUAR"

4. **Configurar Escopos**
   - Clique em "SALVAR E CONTINUAR" (sem adicionar escopos)

5. **Usuários de Teste**
   - Adicione seu próprio email como usuário de teste
   - Clique em "SALVAR E CONTINUAR"

6. **Resumo**
   - Revise as informações
   - Clique em "VOLTAR AO PAINEL"

### Passo 5: Criar Credenciais OAuth 2.0

1. **Acessar Credenciais**
   - Vá em "APIs e serviços" > "Credenciais"

2. **Criar ID do Cliente OAuth**
   - Clique em "+ CRIAR CREDENCIAIS"
   - Selecione "ID do cliente OAuth"

3. **Configurar Aplicativo Web**
   - **Tipo de aplicativo**: Aplicativo da Web
   - **Nome**: `Cliente Web Sistema Tarefas`
   
4. **Configurar URLs Autorizadas**
   - **Origens JavaScript autorizadas**:
     - Clique em "+ ADICIONAR URI"
     - Digite: `http://localhost:3000`
   
   - **URIs de redirecionamento autorizados**:
     - Clique em "+ ADICIONAR URI"
     - Digite: `http://localhost:3000`

5. **Criar e Copiar CLIENT_ID**
   - Clique em "CRIAR"
   - Uma janela aparecerá com suas credenciais
   - **COPIE o CLIENT_ID** (algo como: `123456789-abc123.apps.googleusercontent.com`)
   - Guarde em local seguro
   - Clique em "OK"

### Passo 6: Criar API Key

1. **Criar Chave de API**
   - Na mesma página de credenciais
   - Clique em "+ CRIAR CREDENCIAIS"
   - Selecione "Chave de API"

2. **Copiar API Key**
   - **COPIE a API KEY** (algo como: `AIzaSyABC123def456GHI789jkl`)
   - Guarde em local seguro

3. **Restringir API Key (Recomendado)**
   - Clique em "RESTRINGIR CHAVE"
   - Em "Restrições de API":
     - Selecione "Restringir chave"
     - Marque apenas "Google Calendar API"
   - Clique em "SALVAR"

### Passo 7: Configurar no Código

1. **Abrir Arquivo de Configuração**
   - Navegue até: `public/js/google-calendar-config.js`

2. **Substituir Credenciais**
   ```javascript
   const GOOGLE_CALENDAR_CONFIG = {
       CLIENT_ID: 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com',
       API_KEY: 'SUA_API_KEY_AQUI'
   };
   ```

   **Substitua por suas credenciais reais:**
   ```javascript
   const GOOGLE_CALENDAR_CONFIG = {
       CLIENT_ID: '123456789-abc123.apps.googleusercontent.com',
       API_KEY: 'AIzaSyABC123def456GHI789jkl'
   };
   ```

3. **Salvar o Arquivo**
   - Salve as alterações (Ctrl+S)

### Passo 8: Testar a Integração

1. **Iniciar o Servidor**
   - Certifique-se de que o servidor está rodando em `http://localhost:3000`

2. **Testar Conexão**
   - Abra o navegador em `http://localhost:3000`
   - Vá para a aba de tarefas
   - Clique no botão "📅 Conectar Google Calendar"
   - Uma janela do Google deve abrir
   - Faça login com sua conta
   - Autorize o aplicativo
   - O status deve mudar para "Conectado ✓"

## Solução de Problemas

### ❌ "Credenciais não configuradas"
- Verifique se você copiou corretamente o CLIENT_ID e API_KEY
- Certifique-se de que não há espaços extras
- Verifique se as aspas estão corretas

### ❌ "Erro de autenticação"
- Verifique se `http://localhost:3000` está nas URLs autorizadas
- Certifique-se de que a API do Google Calendar está habilitada
- Tente aguardar alguns minutos (propagação das configurações)

### ❌ "API não carregada"
- Verifique sua conexão com a internet
- Tente recarregar a página
- Verifique se não há bloqueadores de anúncios interferindo

## Segurança

⚠️ **IMPORTANTE**:
- **NUNCA** compartilhe suas credenciais publicamente
- **NÃO** faça commit das credenciais no Git
- Para produção, use domínios HTTPS
- Mantenha suas credenciais em local seguro

## Próximos Passos

Após configurar com sucesso:
1. Teste criando uma tarefa com data de vencimento
2. Marque "📅 Criar notificação no Google Calendar"
3. Verifique se o evento aparece no seu Google Calendar

---

**✅ Pronto! Agora você tem sua própria integração com Google Calendar funcionando!**