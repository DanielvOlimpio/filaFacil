const fs = require('fs').promises;
const path = require('path');

// Função para registrar logs
async function logToFile(message) {
  const logPath = path.join(__dirname, '..', 'logs');
  const logFile = path.join(logPath, `debug_${new Date().toISOString().split('T')[0]}.log`);
  
  try {
    // Verificar se o diretório de logs existe, senão criar
    try {
      await fs.access(logPath);
    } catch (err) {
      await fs.mkdir(logPath, { recursive: true });
    }
    
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    // Adicionar ao arquivo de log
    await fs.appendFile(logFile, logMessage);
  } catch (err) {
    console.error('Erro ao escrever log:', err);
  }
}

// Middleware para logar requisições
function requestLogger(req, res, next) {
  const start = Date.now();
  
  // Método original de envio de resposta
  const originalSend = res.send;
  
  // Sobrescrever o método send para logar a resposta
  res.send = function(body) {
    const responseTime = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`;
    
    // Logar detalhes da requisição para debugging
    const requestDetails = {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      params: req.params,
      query: req.query,
      statusCode: res.statusCode,
      responseTime: responseTime,
      response: typeof body === 'object' ? body : 'não é um objeto JSON'
    };
    
    logToFile(`REQUEST: ${JSON.stringify(requestDetails)}`);
    
    // Chamar o método original
    return originalSend.call(this, body);
  };
  
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

module.exports = {
  logToFile,
  requestLogger
};
