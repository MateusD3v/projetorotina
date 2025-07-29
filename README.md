# Sistema de Rotina de Manutenção TI

Um sistema web simples para gerenciamento de tarefas de manutenção de TI, desenvolvido com HTML, CSS, JavaScript e integrado com Back4App (Parse Server).

## 🚀 Características

- Interface web responsiva e moderna
- Operações CRUD completas para tarefas
- Integração direta com Parse SDK
- **🆕 Integração com Google Calendar** - Crie eventos automaticamente
- Filtros por status das tarefas
- Sistema de notificações visuais
- Arquitetura frontend simplificada

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes)
- Conta no Back4App
- **Opcional**: Conta Google para integração com Calendar

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/projetorotina.git
cd projetorotina
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione suas credenciais do Back4App:
```env
BACK4APP_APP_ID=seu_app_id
BACK4APP_JAVASCRIPT_KEY=sua_javascript_key
BACK4APP_MASTER_KEY=sua_master_key
```

4. **🆕 Configure o Google Calendar (Opcional)**:
   - Execute o script de configuração automática:
   ```bash
   # Windows - Duplo clique ou execute:
   configurar-google-calendar.bat
   
   # Ou via PowerShell:
   .\setup-google-calendar.ps1
   
   # Ou via Node.js:
   node setup-google-calendar.js
   ```
   - Para configuração manual, consulte: `GOOGLE_CALENDAR_SETUP.md`

## 🚀 Como usar

1. Inicie o servidor:
```bash
npm start
```

2. Acesse a aplicação em: `http://localhost:3000`

3. Teste a conexão com Back4App:
```bash
npm run test-back4app
```

## 📁 Estrutura do Projeto

```
projetorotina/
├── config/
│   └── back4app.js          # Configuração do Parse SDK
├── public/
│   ├── css/
│   │   └── style.css        # Estilos da aplicação
│   ├── js/
│   │   ├── script.js        # Lógica frontend com Parse SDK
│   │   └── google-calendar.js # 🆕 Integração Google Calendar
│   └── index.html           # Interface principal
├── app.js                   # Servidor Express
├── test-back4app.js         # Script de teste da conexão
├── setup-google-calendar.js # 🆕 Script configuração Google Calendar
├── setup-google-calendar.ps1 # 🆕 Script PowerShell para Windows
├── configurar-google-calendar.bat # 🆕 Script batch para Windows
├── GOOGLE_CALENDAR_SETUP.md # 🆕 Guia de configuração detalhado
├── package.json             # Dependências e scripts
└── README.md               # Documentação
```

## 🎯 Funcionalidades

### Gerenciamento de Tarefas
- **Criar**: Adicione novas tarefas com título, descrição e status
- **Visualizar**: Liste todas as tarefas ou filtre por status
- **Editar**: Modifique tarefas existentes
- **Excluir**: Remova tarefas desnecessárias

### 🆕 Integração Google Calendar
- **Autenticação**: Login seguro com conta Google
- **Criação Automática**: Eventos criados automaticamente para tarefas
- **Sincronização**: Tarefas sincronizadas com seu calendário
- **Lembretes**: Notificações automáticas do Google Calendar
- **Detalhes Completos**: Título, descrição, data, prioridade e categoria

### Status Disponíveis
- `pendente`: Tarefas aguardando execução
- `em_andamento`: Tarefas sendo executadas
- `concluida`: Tarefas finalizadas

### Sistema de Notificações
- Notificações visuais elegantes
- Feedback em tempo real
- Diferentes tipos: sucesso, aviso, erro, informação

## 🔧 Scripts Disponíveis

- `npm start`: Inicia o servidor de produção
- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm run test-back4app`: Testa a conexão com Back4App
- `npm run lint`: Executa verificação de código
- `npm run format`: Formata o código

## 🌐 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: Back4App (Parse Server)
- **🆕 Integração**: Google Calendar API, OAuth 2.0
- **Estilo**: CSS Grid, Flexbox, Design Responsivo, Animações CSS
- **Notificações**: Sistema de notificações visuais customizado

## 📝 Configuração do Back4App

1. Crie uma conta em [Back4App](https://www.back4app.com/)
2. Crie uma nova aplicação
3. Obtenha as chaves de API:
   - Application ID
   - JavaScript Key
   - Master Key
4. Configure as variáveis no arquivo `.env`

## 📅 Configuração do Google Calendar

### Configuração Automática (Recomendada)
1. Execute um dos scripts de configuração:
   - **Windows**: `configurar-google-calendar.bat`
   - **PowerShell**: `setup-google-calendar.ps1`
   - **Node.js**: `node setup-google-calendar.js`

### Configuração Manual
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Habilite a Google Calendar API
4. Crie credenciais OAuth 2.0 para aplicação web
5. Adicione `http://localhost:3001` nas origens JavaScript autorizadas
6. Configure as credenciais em `public/js/google-calendar.js`

📖 **Guia Detalhado**: Consulte `GOOGLE_CALENDAR_SETUP.md` para instruções completas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de tarefas de TI**