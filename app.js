require('dotenv').config();
const express = require('express');
const admin = require('./config/firebase');
const path = require('path');
const tasksRouter = require('./routes/tasks');

const app = express();

// Configurações
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.render('index');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});