# Sistema de Controle de Tarefas de Manutenção de TI

Sistema web para gerenciamento de tarefas de manutenção de TI com Firebase.

## 🚀 Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Firebase

**Opção A: Teste Automático**
```bash
node test-firebase.js
```

**Opção B: Configuração Manual**
1. Leia o guia completo: [CONFIGURACAO_FIREBASE.md](./CONFIGURACAO_FIREBASE.md)
2. Baixe as credenciais do Firebase Console
3. Configure o arquivo `.env`

### 3. Iniciar Servidor
```bash
npm start
# ou
node app.js
```

### 4. Acessar Aplicação
Abra: http://localhost:3000

## 📋 Status do Sistema

- ✅ **Funcionando**: Sistema operacional com dados mock
- ⚠️ **Firebase**: Requer configuração (opcional)
- ✅ **Interface**: Totalmente funcional
- ✅ **Criação de Tarefas**: Simulada até Firebase ser configurado

## 🔧 Comandos Úteis

```bash
# Testar Firebase
npm run test-firebase

# Desenvolvimento com auto-reload
npm run dev

# Setup completo
npm run setup
```

## 📚 Documentação

- [Configuração do Firebase](./CONFIGURACAO_FIREBASE.md) - Guia passo a passo
- [Melhorias Sugeridas](./MELHORIAS.md) - Próximas funcionalidades
- [Setup do Firebase](./FIREBASE_SETUP.md) - Resolução de problemas