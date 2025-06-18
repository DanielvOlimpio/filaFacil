// Script para depurar problemas de conexão back-end/front-end
console.log('==== Diagnóstico de Conexão - FilaFácil Saúde ====');

// Verifica tipo de acesso à página (file:// ou http://)
console.log(`Protocolo de acesso: ${window.location.protocol}`);

// Se estiver abrindo pelo protocolo file://, alertar sobre possíveis problemas de CORS
if (window.location.protocol === 'file:') {
  console.warn('ATENÇÃO: Você está acessando a página pelo protocolo file://. ' +
    'Isso pode causar problemas de CORS ao tentar conectar ao backend. ' +
    'Recomenda-se usar um servidor web local.');
}

// Verifica se consegue acessar o backend
function testarBackend() {
  console.log('Tentando conectar ao backend...');
  return fetch('http://localhost:3000/')
    .then(response => {
      console.log('Resposta do backend:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Dados do backend:', data);
      return { sucesso: true, dados: data };
    })
    .catch(error => {
      console.error('Erro ao conectar ao backend:', error);
      return { sucesso: false, erro: error.message };
    });
}

// Verifica dados no localStorage
function verificarLocalStorage() {
  console.log('Verificando dados no localStorage...');
  const currentUser = localStorage.getItem('currentUser');
  const currentQueue = localStorage.getItem('currentQueue');
  
  console.log('Usuário logado:', currentUser ? JSON.parse(currentUser) : 'Nenhum');
  console.log('Fila atual:', currentQueue ? JSON.parse(currentQueue) : 'Nenhuma');
}

// Executa os testes
document.addEventListener('DOMContentLoaded', async () => {
  verificarLocalStorage();
  const resultadoBackend = await testarBackend();
  
  if (!resultadoBackend.sucesso) {
    // Adicionar mensagem visível para o usuário
    const mensagemErro = document.createElement('div');
    mensagemErro.style.position = 'fixed';
    mensagemErro.style.bottom = '10px';
    mensagemErro.style.right = '10px';
    mensagemErro.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    mensagemErro.style.color = 'white';
    mensagemErro.style.padding = '10px';
    mensagemErro.style.borderRadius = '5px';
    mensagemErro.style.zIndex = '9999';
    mensagemErro.innerHTML = `⚠️ Erro de conexão com o backend: ${resultadoBackend.erro}<br>Verifique se o servidor está rodando na porta 3000.`;
    document.body.appendChild(mensagemErro);
  }
});
