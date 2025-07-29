# Configuração da Integração com Google Calendar

Este guia explica como configurar a integração com o Google Calendar para criar notificações automáticas das suas tarefas.

## Pré-requisitos

- Conta Google ativa
- Acesso ao Google Cloud Console
- Projeto rodando em `http://localhost:3001`

## Passo a Passo

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Selecionar projeto" no topo da página
3. Clique em "NOVO PROJETO"
4. Digite um nome para o projeto (ex: "Sistema de Tarefas")
5. Clique em "CRIAR"

### 2. Habilitar a API do Google Calendar

1. No menu lateral, vá em "APIs e serviços" > "Biblioteca"
2. Pesquise por "Google Calendar API"
3. Clique na API do Google Calendar
4. Clique em "ATIVAR"

### 3. Configurar OAuth 2.0

1. No menu lateral, vá em "APIs e serviços" > "Credenciais"
2. Clique em "+ CRIAR CREDENCIAIS" > "ID do cliente OAuth"
3. Se solicitado, configure a tela de consentimento OAuth:
   - Escolha "Externo" como tipo de usuário
   - Preencha as informações obrigatórias:
     - Nome do app: "Sistema de Tarefas"
     - Email de suporte: seu email
     - Email do desenvolvedor: seu email
   - Clique em "SALVAR E CONTINUAR" até finalizar

4. Volte para "Credenciais" e clique em "+ CRIAR CREDENCIAIS" > "ID do cliente OAuth"
5. Selecione "Aplicativo da Web"
6. Configure:
   - Nome: "Cliente Web Sistema de Tarefas"
   - Origens JavaScript autorizadas: `http://localhost:3001`
   - URIs de redirecionamento autorizados: `http://localhost:3001`
7. Clique em "CRIAR"

### 4. Obter API Key

1. Na página de credenciais, clique em "+ CRIAR CREDENCIAIS" > "Chave de API"
2. Copie a chave gerada
3. (Opcional) Clique em "RESTRINGIR CHAVE" para maior segurança:
   - Restrições de API: Selecione "Google Calendar API"
   - Clique em "SALVAR"

### 5. Configurar as Credenciais no Código

1. Abra o arquivo `public/js/google-calendar.js`
2. Substitua as seguintes linhas:

```javascript
// ANTES:
this.CLIENT_ID = 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com';
this.API_KEY = 'SUA_API_KEY_AQUI';

// DEPOIS (com suas credenciais reais):
this.CLIENT_ID = 'seu-client-id-real.apps.googleusercontent.com';
this.API_KEY = 'sua-api-key-real';
```

### 6. Testar a Integração

1. Inicie o servidor: `npm start`
2. Acesse `http://localhost:3001`
3. Na aba de tarefas, você verá o botão "📅 Conectar Google Calendar"
4. Clique no botão para fazer login com sua conta Google
5. Autorize o aplicativo a acessar seu Google Calendar
6. O status deve mudar para "Conectado ✓"

### 7. Criar Tarefa com Notificação

1. Clique em "+ Nova Tarefa"
2. Preencha os dados da tarefa
3. **Importante**: Defina uma "Data de Vencimento"
4. Marque a opção "📅 Criar notificação no Google Calendar"
5. Clique em "Salvar"

O sistema criará automaticamente um evento no seu Google Calendar com:
- Título da tarefa
- Descrição
- Data e hora do vencimento
- Lembrete 1 hora antes
- Categoria como localização

## Solução de Problemas

### Erro "Credenciais não configuradas"
- Verifique se você substituiu corretamente o CLIENT_ID e API_KEY no arquivo `google-calendar.js`

### Erro "API não carregada"
- Verifique sua conexão com a internet
- Certifique-se de que o script da API do Google está sendo carregado corretamente

### Erro de autenticação
- Verifique se `http://localhost:3001` está nas origens JavaScript autorizadas
- Certifique-se de que a API do Google Calendar está habilitada
- Verifique se as credenciais estão corretas

### Evento não criado no Calendar
- Certifique-se de que você está conectado ao Google Calendar
- Verifique se a tarefa tem uma data de vencimento definida
- Verifique se a opção "Criar notificação" está marcada

## Segurança

⚠️ **Importante**: 
- Nunca compartilhe suas credenciais publicamente
- Para produção, configure restrições adequadas na API Key
- Use HTTPS em produção
- Configure domínios autorizados adequados para produção

## Recursos Adicionais

- [Documentação da API Google Calendar](https://developers.google.com/calendar/api/guides/overview)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Guia OAuth 2.0 do Google](https://developers.google.com/identity/protocols/oauth2)