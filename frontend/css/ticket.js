// ticket.js - Arquivo para gerenciar funcionalidades da página de ticket do FilaFácil Saúde
document.addEventListener('DOMContentLoaded', () => {
  // URL do backend
  const API_URL = 'http://localhost:3000';

  // Elementos do DOM
  const userName = document.getElementById('userName');
  const logoutButton = document.getElementById('logout');
  const hospitalName = document.getElementById('hospitalName');
  const hospitalImage = document.getElementById('hospitalImage');
  const currentNumber = document.getElementById('currentNumber');
  const yourNumber = document.getElementById('yourNumber');
  const priorityTag = document.getElementById('priorityTag');
  const positionNumber = document.getElementById('positionNumber');
  const estimatedTime = document.getElementById('estimatedTime');
  const progressPercentage = document.getElementById('progressPercentage');
  const queueProgress = document.getElementById('queueProgress');
  const notificationToggle = document.getElementById('notification-toggle');
  const attendantPanel = document.getElementById('attendantPanel');
  const callNextBtn = document.getElementById('callNextBtn');
  const btnNextTicket = document.getElementById('btnNextTicket');
  // Verificar se há um usuário logado
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Se não estiver logado, redirecionar para o login
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  
  // Verificar se está em uma fila
  const queueData = JSON.parse(localStorage.getItem('currentQueue'));
  
  // Se não estiver em uma fila, consultar no backend
  if (!queueData) {
    consultarFila(currentUser.email);
  } else {
    atualizarInformacoesFila(queueData);
  }

  // Função para consultar a fila no backend
  async function consultarFila(email) {
    try {
      const response = await fetch(`${API_URL}/fila/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success && data.filas.length > 0) {
        const fila = data.filas[0]; // Pegar a fila mais recente
        
        // Armazenar informações da fila
        const queueData = {
          hospitalName: fila.hospital_nome,
          timeJoined: fila.data_entrada,
          estimatedWaitTime: `~${fila.tempo_estimado} min`,
          position: fila.posicao,
          isPriority: currentUser.isPriority
        };
        
        localStorage.setItem('currentQueue', JSON.stringify(queueData));
        atualizarInformacoesFila(queueData);
      } else {
        // Se não estiver em nenhuma fila, redirecionar para a página de hospitais
        alert('Você não está em nenhuma fila no momento.');
        window.location.href = 'hospitais.html';
      }
    } catch (error) {
      console.error('Erro ao consultar fila:', error);
      alert('Erro de conexão com o servidor. Redirecionando para a página de hospitais.');
      window.location.href = 'hospitais.html';
    }
  }
  // Atualizar nome do usuário
  userName.textContent = currentUser.nome.split(' ')[0];
  
  // Função de logout
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remover dados do usuário atual e da fila
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentQueue');
    
    // Redirecionar para a página de login
    window.location.href = 'login.html';
  });
  
  // Função para atualizar as informações da fila na interface
  function atualizarInformacoesFila(queueData) {
    // Atualizar informações do hospital
    hospitalName.textContent = queueData.hospitalName;
    
    // Selecionar imagem adequada com base no nome do hospital
    if (queueData.hospitalName.includes('Santa Casa')) {
      hospitalImage.src = '../imagens/santa_casa 1.png';
    } else if (queueData.hospitalName.includes('Unimed')) {
      hospitalImage.src = '../imagens/hospital_unimed 1.png';
    } else if (queueData.hospitalName.includes('São Joaquim')) {
      hospitalImage.src = '../imagens/hospital_saojoaquim 1.png';
    } else if (queueData.hospitalName.includes('Câncer')) {
      hospitalImage.src = '../imagens/hospital do cancer 1.png';
    }
      // Verificar se é prioritário
    if (currentUser.isPriority) {
      priorityTag.style.display = 'block';
      yourNumber.textContent = 'P' + generateRandomTicketNumber(1, 50);
    } else {
      priorityTag.style.display = 'none';
      yourNumber.textContent = 'N' + generateRandomTicketNumber(50, 100);
    }
    
    // Gerar número atual sendo atendido
    const current = generateRandomTicketNumber(1, parseInt(yourNumber.textContent.substring(1)) - queueData.position);
    currentNumber.textContent = (currentUser.isPriority ? 'P' : 'N') + current.toString().padStart(3, '0');
    
    // Definir posição na fila
    positionNumber.textContent = queueData.position;
    
    // Definir tempo estimado
    estimatedTime.textContent = queueData.estimatedWaitTime;
    
    // Calcular progresso na fila
    const totalQueue = parseInt(yourNumber.textContent.substring(1)) - current;
    const position = parseInt(positionNumber.textContent);
    const progress = ((totalQueue - position) / totalQueue) * 100;
    
    // Atualizar barra de progresso
    progressPercentage.textContent = Math.round(progress) + '%';
    queueProgress.style.width = progress + '%';
  }
  
  // Notificações
  notificationToggle.addEventListener('change', () => {
    if (notificationToggle.checked) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
  });
  
  // Verificar se é um atendente (simulação)
  // Para fins de demonstração, vamos considerar que qualquer usuário pode acessar o painel de atendente
  // Em um ambiente real, seria necessário verificar permissões
  attendantPanel.style.display = 'block';
  
  // Funções para chamar próxima senha
  callNextBtn.addEventListener('click', callNextTicket);
  btnNextTicket.addEventListener('click', callNextTicket);
  
  // Função para chamar próximo ticket
  function callNextTicket() {
    // Determinar se chamar senha normal ou prioritária
    // Em um sistema real, isso seguiria regras de negócio específicas
    // Por exemplo, a cada 3 senhas normais, chamar 1 prioritária
    
    // Para fins de demonstração, vamos alternar aleatoriamente
    const isPriority = Math.random() > 0.7;  // 30% de chance de chamar senha prioritária
    
    // Gerar novo número atual sendo atendido
    const currentNum = parseInt(currentNumber.textContent.substring(1));
    const newNum = currentNum + 1;
    
    // Atualizar o número atual
    currentNumber.textContent = (isPriority ? 'P' : 'N') + newNum.toString().padStart(3, '0');
    
    // Atualizar posição na fila
    if ((isPriority && currentUser.isPriority) || (!isPriority && !currentUser.isPriority)) {
      const position = parseInt(positionNumber.textContent);
      if (position > 1) {
        positionNumber.textContent = position - 1;
        
        // Atualizar progresso
        const totalQueue = parseInt(yourNumber.textContent.substring(1)) - parseInt(currentNumber.textContent.substring(1));
        const newPos = position - 1;
        const progress = ((totalQueue - newPos) / totalQueue) * 100;
        
        progressPercentage.textContent = Math.round(progress) + '%';
        queueProgress.style.width = progress + '%';
        
        // Atualizar tempo estimado
        const newTime = Math.max(5, Math.round(newPos * 5));
        estimatedTime.textContent = '~' + newTime + ' min';
        
        // Verificar se deve enviar notificação
        if (newPos <= 3 && notificationToggle.checked) {
          sendNotification();
        }
      }
    }
  }
  
  // Função para enviar notificação
  function sendNotification() {
    if (Notification.permission === 'granted') {
      const notification = new Notification('FilaFácil Saúde', {
        body: `É quase sua vez! Faltam apenas ${positionNumber.textContent} pessoas na sua frente.`,
        icon: '../imagens/icone medico 1 1.png'
      });
      
      notification.onclick = function() {
        window.focus();
        this.close();
      };
    }
  }
  
  // Funções auxiliares
  function generateRandomTicketNumber(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num.toString().padStart(3, '0');
  }
    // Atualização automática através de polling para o backend
  setInterval(() => {
    // Verificar se ainda temos um usuário logado e em uma fila
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.email) {
      // Atualizar informações da fila a partir do backend
      fetch(`${API_URL}/fila/${currentUser.email}`)
        .then(response => response.json())
        .then(data => {
          if (data.success && data.filas.length > 0) {
            const fila = data.filas[0]; // Pegar a fila mais recente
            
            // Armazenar informações da fila atualizadas
            const queueData = {
              hospitalName: fila.hospital_nome,
              timeJoined: fila.data_entrada,
              estimatedWaitTime: `~${fila.tempo_estimado} min`,
              position: fila.posicao,
              isPriority: currentUser.isPriority
            };
            
            localStorage.setItem('currentQueue', JSON.stringify(queueData));
            
            // Atualizar a interface com os novos dados
            atualizarInformacoesFila(queueData);
          }
        })
        .catch(error => console.error('Erro ao atualizar fila:', error));
    }
  }, 15000); // Atualizar a cada 15 segundos
});
