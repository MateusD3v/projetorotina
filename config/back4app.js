const Parse = require('parse/node');

// Configuração do Back4App
Parse.initialize(
  'xrkPQgeanlbyRGOOqaR9kChOXIrEMZnPhOo271qp', // Application ID
  'nQoYP0tnyrYOn1XoKTpjx777AWP4WhIL4aZL37S1', // JavaScript Key
  'XK8iTpwDdkYzLAXou2VFFz2qwWR1XtZNRPf1FR7t'  // Master Key
);

Parse.serverURL = 'https://parseapi.back4app.com';

module.exports = Parse;