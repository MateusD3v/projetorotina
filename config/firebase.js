const admin = require('firebase-admin');
const serviceAccount = require('../projetorotinha-firebase-adminsdk-fbsvc-c76ecbddbf.json');

// Inicializa o Firebase Admin apenas uma vez
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'projetorotinha'
  });
}

module.exports = admin;