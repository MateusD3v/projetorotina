const Parse = require('./config/back4app');

async function testBack4AppConnection() {
  try {
    console.log('🔄 Testando conexão com Back4App...');
    
    // Definir classe de teste
    const TestConnection = Parse.Object.extend('TestConnection');
    
    // Criar objeto de teste
    const testObject = new TestConnection();
    testObject.set('message', 'Teste de conexão');
    testObject.set('timestamp', new Date());
    
    console.log('📝 Criando objeto de teste...');
    const savedObject = await testObject.save(null, { useMasterKey: true });
    console.log('✅ Objeto criado com sucesso! ID:', savedObject.id);
    
    // Buscar o objeto criado
    console.log('🔍 Buscando objeto criado...');
    const query = new Parse.Query(TestConnection);
    const foundObject = await query.get(savedObject.id, { useMasterKey: true });
    console.log('✅ Objeto encontrado:', foundObject.get('message'));
    
    // Atualizar o objeto
    console.log('📝 Atualizando objeto...');
    foundObject.set('message', 'Teste de conexão - Atualizado');
    const updatedObject = await foundObject.save(null, { useMasterKey: true });
    console.log('✅ Objeto atualizado:', updatedObject.get('message'));
    
    // Listar objetos
    console.log('📋 Listando objetos...');
    const listQuery = new Parse.Query(TestConnection);
    const objects = await listQuery.find({ useMasterKey: true });
    console.log(`✅ Encontrados ${objects.length} objeto(s)`);
    
    // Deletar o objeto de teste
    console.log('🗑️ Deletando objeto de teste...');
    await updatedObject.destroy({ useMasterKey: true });
    console.log('✅ Objeto deletado com sucesso!');
    
    console.log('🎉 Teste de conexão com Back4App concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error);
    process.exit(1);
  }
}

// Executar teste
testBack4AppConnection();