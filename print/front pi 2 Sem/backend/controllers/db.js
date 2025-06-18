const mysql = require('mysql2/promise');

// Configuração de conexão com o banco de dados MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'filafacil_saude'
};

// Função para obter uma conexão com o banco
async function getConnection() {
  try {
    return await mysql.createConnection(dbConfig);
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    throw err;
  }
}

module.exports = {
  getConnection
};
