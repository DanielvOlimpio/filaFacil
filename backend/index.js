const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Importando controladores
const { requestLogger } = require('./controllers/logController');

// Importando as rotas
const usuariosRoutes = require('./routes/usuariosRoutes');
const loginRoutes = require('./routes/loginRoutes');
const filasRoutes = require('./routes/filasRoutes');

// Configurações do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  multipleStatements: true
};

// Inicializando o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Permite acesso de qualquer origem (para desenvolvimento)
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // Adiciona logger para todas as requisições

// Rotas
app.use('/usuarios', usuariosRoutes);
app.use('/login', loginRoutes);
app.use('/fila', filasRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do FilaFácil Saúde!', status: 'online' });
});

// Rota para testar a conexão com o banco
app.get('/status', async (req, res) => {
  try {
    // Tentar conectar ao banco
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: 'filafacil_saude'
    });
    
    // Se conseguir conectar, fazer uma consulta simples
    const [rows] = await connection.execute('SELECT 1 as test');
    await connection.end();
    
    res.json({ 
      message: 'Sistema operacional', 
      db: {
        status: 'conectado',
        test: rows[0].test === 1 ? 'ok' : 'falha'
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro no sistema', 
      error: error.message,
      db: {
        status: 'desconectado',
        reason: error.message
      } 
    });
  }
});

// Função para inicializar o banco de dados
async function initializeDatabase() {
  try {
    // Conectar ao MySQL sem selecionar um banco específico
    let connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true
    });

    console.log('Conectado ao MySQL com sucesso!');

    // Ler e executar o script de criação de banco e tabelas
    const createScript = await fs.readFile(
      path.join(__dirname, 'sql', 'create_database.sql'),
      'utf8'
    );
    
    await connection.query(createScript);
    console.log('Banco de dados e tabelas criados com sucesso!');

    // Tentar executar o script de inserção de dados de exemplo
    try {
      const insertScript = await fs.readFile(
        path.join(__dirname, 'sql', 'insert_sample_data.sql'),
        'utf8'
      );
      
      await connection.query(insertScript);
      console.log('Dados de exemplo inseridos com sucesso!');
    } catch (err) {
      console.log('Aviso: Erro ao inserir dados de exemplo (talvez já existam):', err.message);
    }

    await connection.end();

  } catch (err) {
    console.error('Erro ao inicializar o banco de dados:', err);
    process.exit(1);
  }
}

// Iniciar o servidor após inicializar o banco
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Falha ao iniciar o aplicativo:', err);
  });
