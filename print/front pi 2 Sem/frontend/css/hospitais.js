// hospitais.js - Arquivo para gerenciar funcionalidades da página de hospitais do FilaFácil Saúde
document.addEventListener('DOMContentLoaded', () => {
  // URL do backend
  const API_URL = 'http://localhost:3000';

  // Elementos do DOM
  const userName = document.getElementById('userName');
  const logoutButton = document.getElementById('logout');
  const enterQueueButtons = document.querySelectorAll('.enter-queue-btn');
  const searchInput = document.getElementById('searchHospitals');
  
  // Verificar se há um usuário logado
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (currentUser) {
    userName.textContent = currentUser.name.split(' ')[0]; // Mostrar apenas o primeiro nome
  }
  
  // Função de logout
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remover dados do usuário atual
    localStorage.removeItem('currentUser');
    
    // Redirecionar para a página de login
    window.location.href = 'login.html';
  });
  
  // Pesquisar hospitais
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const hospitalCards = document.querySelectorAll('.hospital-card');
    
    hospitalCards.forEach(card => {
      const hospitalName = card.querySelector('h3').textContent.toLowerCase();
      const hospitalAddress = card.querySelector('p:nth-child(2)').textContent.toLowerCase();
      
      if (hospitalName.includes(searchTerm) || hospitalAddress.includes(searchTerm)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
    // Entrar na fila de atendimento
  enterQueueButtons.forEach(button => {
    button.addEventListener('click', async () => {
      // Verificar se o usuário está logado
      if (!currentUser) {
        alert('Você precisa fazer login para entrar na fila de atendimento!');
        window.location.href = 'login.html';
        return;
      }
      
      // Obter informações do hospital
      const card = button.closest('.hospital-card');
      const hospital_nome = card.querySelector('h3').textContent;
      
      try {
        button.disabled = true;
        button.textContent = 'Aguarde...';
        
        const response = await fetch(`${API_URL}/fila`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: currentUser.email,
            hospital_nome
          })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          // Armazenar informações da fila
          const queueData = {
            hospitalName: hospital_nome,
            timeJoined: new Date().toISOString(),
            estimatedWaitTime: `~${data.fila.tempo_estimado} min`,
            position: data.fila.posicao,
            isPriority: currentUser.isPriority
          };
          
          localStorage.setItem('currentQueue', JSON.stringify(queueData));
          
          // Redirecionar para a página de acompanhamento da fila
          window.location.href = 'ticket.html';
        } else {
          alert(data.message || 'Erro ao entrar na fila. Tente novamente.');
          button.disabled = false;
          button.textContent = 'Entrar na Fila';
        }
      } catch (error) {
        console.error('Erro ao entrar na fila:', error);
        alert('Erro de conexão. Verifique se o servidor está rodando e tente novamente.');
        button.disabled = false;
        button.textContent = 'Entrar na Fila';
      }
    });
  });
});
