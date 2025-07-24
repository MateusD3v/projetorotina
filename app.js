const express = require('express');
const path = require('path');

const app = express();

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal - servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});