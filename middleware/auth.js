const admin = require('../config/firebase');

// Middleware para verificar autenticação
const verifyToken = async (req, res, next) => {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token de acesso requerido',
        code: 'UNAUTHORIZED' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    
    // Verificar token com Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Adicionar informações do usuário à requisição
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
    
    console.log(`Usuário autenticado: ${req.user.email}`);
    next();
    
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    
    // Diferentes tipos de erro
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED' 
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({ 
        error: 'Token revogado',
        code: 'TOKEN_REVOKED' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Token inválido',
      code: 'INVALID_TOKEN' 
    });
  }
};

// Middleware opcional - permite acesso sem autenticação mas adiciona user se autenticado
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      };
    }
    
    next();
  } catch (error) {
    // Em caso de erro, continua sem autenticação
    console.warn('Token opcional inválido:', error.message);
    next();
  }
};

module.exports = { verifyToken, optionalAuth };