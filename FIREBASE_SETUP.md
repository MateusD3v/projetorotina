# Configuração do Firebase - Guia de Resolução

## Problema Identificado

O aplicativo está apresentando erro de autenticação Firebase:
```
Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential.
```

## Causa do Problema

O erro indica que:
1. O Firestore pode não estar habilitado no projeto Firebase
2. As credenciais do service account podem estar incorretas
3. O projeto Firebase pode não ter as permissões adequadas

## Solução Implementada (Temporária)

✅ **Fallback com Dados Mock**: O sistema agora usa dados de exemplo quando o Firebase falha, garantindo que a aplicação continue funcionando.

## Passos para Resolver o Firebase

### 1. Verificar o Console Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto "projetorotinha"
3. Vá em **Firestore Database**
4. Se não estiver criado, clique em "Criar banco de dados"
5. Escolha o modo de produção ou teste
6. Selecione uma localização (ex: southamerica-east1)

### 2. Verificar Permissões do Service Account

1. No Console Firebase, vá em **Configurações do Projeto** (ícone de engrenagem)
2. Aba **Contas de serviço**
3. Verifique se a chave privada está correta
4. Se necessário, gere uma nova chave

### 3. Verificar Regras do Firestore

No Console Firebase > Firestore > Regras, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Para desenvolvimento
    }
  }
}
```

### 4. Atualizar Credenciais (se necessário)

Se precisar de novas credenciais:

1. Baixe uma nova chave do service account
2. Substitua o arquivo `projetorotinha-firebase-adminsdk-fbsvc-c76ecbddbf.json`
3. Reinicie o servidor

## Testando a Conexão

### Rotas de Teste Disponíveis:

- `GET /tasks/test` - Verifica se a API está funcionando
- `GET /tasks/mock` - Retorna dados mock
- `GET /tasks` - Tenta Firebase, usa mock como fallback

### Logs de Debug

O sistema agora inclui logs detalhados:
- ✅ Tentativas de conexão Firebase
- ✅ Fallback para dados mock
- ✅ Erros detalhados no console

## Status Atual

- ✅ **Aplicação Funcionando**: Com dados mock
- ⚠️ **Firebase**: Precisa de configuração
- ✅ **Interface**: Totalmente funcional
- ✅ **Criação de Tarefas**: Simulada com mock

## Próximos Passos

1. Configurar Firestore no Console Firebase
2. Verificar permissões do service account
3. Testar conexão real com Firebase
4. Remover fallback mock (opcional)

---

**Nota**: O sistema continuará funcionando normalmente com dados mock até que o Firebase seja configurado corretamente.