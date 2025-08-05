# Configuração de Upload de Arquivos no Back4App

## Problema
O erro "File upload by public is disabled" ocorre porque o Parse Server 5 (usado pelo Back4App) desabilitou uploads de arquivos por usuários públicos e anônimos por padrão para melhorar a segurança.

## Solução

Para resolver este problema, você precisa configurar as opções customizadas do Parse Server no painel do Back4App:

### Passo 1: Acessar o Painel do Back4App

1. Acesse [https://www.back4app.com/](https://www.back4app.com/)
2. Faça login na sua conta
3. Selecione sua aplicação

### Passo 2: Configurar Opções Customizadas

1. **Navegue para Server Settings**
   - No menu lateral, clique em "Server Settings"
   - Ou vá em "App Settings" > "Server Settings"

2. **Encontre a seção "Custom Parse Options"**
   - Role a página até encontrar "Custom Parse Options"
   - Esta seção permite configurar opções avançadas do Parse Server

3. **Adicione a configuração de upload**
   - No campo de texto, adicione o seguinte JSON:
   
   ```json
   {
     "fileUpload": {
       "enableForPublic": true,
       "enableForAnonymousUser": true,
       "enableForAuthenticatedUser": true
     }
   }
   ```

4. **Salve as configurações**
   - Clique em "Save" ou "Update"
   - Aguarde alguns minutos para que as mudanças sejam aplicadas

### Passo 3: Reiniciar a Aplicação (se necessário)

1. Se o erro persistir, pode ser necessário reiniciar a aplicação:
   - Vá em "App Settings" > "General"
   - Procure por uma opção de "Restart" ou "Redeploy"
   - Ou simplesmente aguarde alguns minutos para que as mudanças sejam propagadas

## Explicação das Opções

- **`enableForPublic`**: Permite upload de arquivos por usuários não autenticados
- **`enableForAnonymousUser`**: Permite upload de arquivos por usuários anônimos
- **`enableForAuthenticatedUser`**: Permite upload de arquivos por usuários autenticados

## Considerações de Segurança

⚠️ **Importante**: Habilitar uploads públicos pode representar riscos de segurança:

- **Spam de arquivos**: Usuários podem fazer upload de arquivos desnecessários
- **Uso excessivo de armazenamento**: Pode aumentar os custos
- **Arquivos maliciosos**: Possibilidade de upload de conteúdo inadequado

### Recomendações de Segurança

1. **Implementar validação de arquivos**:
   - Limitar tipos de arquivo (apenas imagens)
   - Limitar tamanho dos arquivos
   - Validar conteúdo dos arquivos

2. **Monitorar uso**:
   - Acompanhar o volume de uploads
   - Verificar regularmente os arquivos enviados

3. **Considerar autenticação**:
   - Para aplicações em produção, considere implementar um sistema de login
   - Use apenas `enableForAuthenticatedUser: true` se possível

## Alternativa: Implementar Autenticação

Se preferir manter a segurança, você pode implementar um sistema de login simples:

```javascript
// Criar usuário anônimo antes do upload
async function ensureUserAuthentication() {
    let currentUser = Parse.User.current();
    if (!currentUser) {
        currentUser = await Parse.User.logInWith('anonymous');
    }
    return currentUser;
}

// Usar antes do upload
await ensureUserAuthentication();
```

## Testando a Configuração

1. Após aplicar as configurações, aguarde 2-3 minutos
2. Recarregue sua aplicação
3. Tente fazer upload de uma imagem
4. Se ainda houver erro, verifique:
   - Se a configuração JSON está correta
   - Se não há erros de sintaxe no JSON
   - Se a aplicação foi reiniciada

## Suporte

Se o problema persistir:

1. Verifique os logs do Back4App em "Server Settings" > "Logs"
2. Consulte a documentação oficial: [Back4App Custom Parse Options](https://www.back4app.com/docs/platform/custom-parse-options)
3. Entre em contato com o suporte do Back4App

---

**Nota**: Esta configuração resolve o problema de upload de arquivos, mas lembre-se sempre de considerar as implicações de segurança ao habilitar uploads públicos.