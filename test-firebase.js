#!/usr/bin/env node

/**
 * Script de Teste do Firebase
 * Execute: node test-firebase.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🔥 Testando Configuração do Firebase...\n');

// 1. Verificar arquivo de credenciais
const credentialsPath = path.join(__dirname, 'projetorotinha-firebase-adminsdk-fbsvc-c76ecbddbf.json');
console.log('1. Verificando arquivo de credenciais...');

if (fs.existsSync(credentialsPath)) {
    console.log('   ✅ Arquivo de credenciais encontrado');
    
    try {
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        console.log(`   ✅ Project ID: ${credentials.project_id}`);
        console.log(`   ✅ Client Email: ${credentials.client_email}`);
    } catch (error) {
        console.log('   ❌ Erro ao ler arquivo de credenciais:', error.message);
        process.exit(1);
    }
} else {
    console.log('   ❌ Arquivo de credenciais não encontrado');
    console.log('   📝 Baixe o arquivo do Console Firebase e coloque na raiz do projeto');
    process.exit(1);
}

// 2. Verificar variáveis de ambiente
console.log('\n2. Verificando variáveis de ambiente...');
const requiredEnvVars = ['FIREBASE_PROJECT_ID'];
let envOk = true;

requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
        console.log(`   ✅ ${envVar}: ${process.env[envVar]}`);
    } else {
        console.log(`   ⚠️  ${envVar}: não definido (usando fallback)`);
    }
});

// 3. Testar conexão Firebase
console.log('\n3. Testando conexão com Firebase...');

try {
    const admin = require('firebase-admin');
    const serviceAccount = require('./projetorotinha-firebase-adminsdk-fbsvc-c76ecbddbf.json');
    
    // Verificar se já foi inicializado
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID || 'projetorotinha'
        });
    }
    
    const db = admin.firestore();
    console.log('   ✅ Firebase Admin SDK inicializado');
    
    // 4. Testar acesso ao Firestore
    console.log('\n4. Testando acesso ao Firestore...');
    
    db.collection('tasks').limit(1).get()
        .then(snapshot => {
            console.log('   ✅ Conexão com Firestore estabelecida');
            console.log(`   ✅ Documentos encontrados: ${snapshot.size}`);
            
            if (snapshot.size > 0) {
                console.log('   ✅ Dados existentes encontrados');
            } else {
                console.log('   ℹ️  Nenhum documento encontrado (normal para novo projeto)');
            }
            
            console.log('\n🎉 Configuração do Firebase está funcionando!');
            console.log('\n📋 Próximos passos:');
            console.log('   1. Reinicie o servidor: node app.js');
            console.log('   2. Teste a aplicação no navegador');
            console.log('   3. Verifique se as tarefas são salvas no Firestore');
            
            process.exit(0);
        })
        .catch(error => {
            console.log('   ❌ Erro ao acessar Firestore:', error.message);
            console.log('\n🔧 Possíveis soluções:');
            console.log('   1. Verifique se o Firestore está habilitado no Console Firebase');
            console.log('   2. Verifique as regras de segurança do Firestore');
            console.log('   3. Gere uma nova chave do service account');
            console.log('   4. Verifique se o project_id está correto');
            
            if (error.code === 16) {
                console.log('\n⚠️  Erro de autenticação detectado!');
                console.log('   - Acesse: https://console.firebase.google.com/');
                console.log('   - Vá em Firestore Database');
                console.log('   - Clique em "Criar banco de dados" se não existir');
                console.log('   - Configure as regras de segurança');
            }
            
            process.exit(1);
        });
        
} catch (error) {
    console.log('   ❌ Erro ao inicializar Firebase:', error.message);
    console.log('\n🔧 Verifique:');
    console.log('   1. Se o arquivo de credenciais está correto');
    console.log('   2. Se as dependências estão instaladas: npm install');
    console.log('   3. Se o project_id está correto');
    
    process.exit(1);
}

// Timeout de segurança
setTimeout(() => {
    console.log('\n⏰ Timeout - teste demorou muito para responder');
    console.log('   Verifique sua conexão com a internet');
    process.exit(1);
}, 10000);