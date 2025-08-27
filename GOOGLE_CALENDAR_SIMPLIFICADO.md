# 📅 Integração Simplificada com Google Calendar

## ✨ O que mudou?

A nova versão simplificada permite que os usuários façam login no Google Calendar **apenas com sua conta Google**, sem precisar configurar credenciais OAuth manualmente.

## 🚀 Vantagens da Versão Simplificada

✅ **Para Usuários:**
- Login com um clique usando conta Google
- Não precisam configurar credenciais
- Processo mais seguro e moderno
- Interface mais intuitiva

✅ **Para Desenvolvedores:**
- Apenas Client ID necessário (não precisa mais de API Key)
- Configuração mais simples
- Usa Google Identity Services (biblioteca mais recente)
- Menos pontos de falha

## 🔧 Como Configurar (Desenvolvedor)

### 1. Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Calendar API**
4. Vá em **Credenciais** > **Criar Credenciais** > **ID do cliente OAuth 2.0**
5. Escolha **Aplicação da Web**
6. Configure as **origens JavaScript autorizadas**:
   - `http://localhost:3000` (desenvolvimento)
   - `https://seudominio.com` (produção)
7. Copie o **Client ID** gerado

### 2. Configuração no Código

Edite o arquivo `public/js/google-calendar-config.js`:

```javascript
const GOOGLE_CALENDAR_CONFIG = {
    CLIENT_ID: 'seu-client-id-aqui.apps.googleusercontent.com'
};
```

**Importante:** Substitua `seu-client-id-aqui` pelo Client ID real obtido no Google Cloud Console.

## 👥 Como Usar (Usuário Final)

1. **Conectar:** Clique no botão "📅 Conectar Google Calendar"
2. **Autorizar:** Faça login com sua conta Google e autorize o acesso
3. **Pronto:** Agora suas tarefas podem criar eventos no Google Calendar automaticamente

### Criando Eventos Automáticos

1. Ao criar uma nova tarefa, marque a opção:
   ☑️ **Criar notificação no Google Calendar**
2. A tarefa criará automaticamente um evento 1 hora antes do prazo
3. Você receberá notificações no seu Google Calendar

## 🔄 Diferenças da Versão Anterior

| Aspecto | Versão Anterior | Versão Simplificada |
|---------|----------------|---------------------|
| **Credenciais** | Client ID + API Key | Apenas Client ID |
| **Login do Usuário** | Configuração manual | Um clique |
| **Biblioteca** | GAPI (antiga) | Google Identity Services |
| **Segurança** | Boa | Melhor |
| **Experiência** | Complexa | Simples |

## 🛠️ Arquivos Modificados

- `public/js/google-calendar-simple.js` - Nova classe de integração
- `public/js/google-calendar-config.js` - Configuração simplificada
- `public/js/script.js` - Funções atualizadas
- `public/index.html` - Referências aos novos scripts

## 🔍 Solução de Problemas

### "Client ID não configurado"
- Verifique se o Client ID está correto em `google-calendar-config.js`
- Certifique-se de que não há espaços extras

### "Erro de origem não autorizada"
- Adicione seu domínio nas origens autorizadas no Google Cloud Console
- Para desenvolvimento local: `http://localhost:3000`

### "API não habilitada"
- Verifique se a Google Calendar API está ativada no Google Cloud Console

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Confirme a configuração no Google Cloud Console
3. Teste com uma conta Google diferente

---

**Nota:** Esta versão simplificada mantém todas as funcionalidades da versão anterior, mas com uma experiência muito mais fluida para os usuários finais.