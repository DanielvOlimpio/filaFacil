// login.js - Arquivo para gerenciar o login e cadastro do FilaFácil Saúde
document.addEventListener('DOMContentLoaded', () => {
  // URL do backend
  const API_URL = 'http://localhost:3000';
  
  // Elementos do DOM
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  
  const loginFormEl = document.getElementById('loginForm');
  const registerFormEl = document.getElementById('registerForm');
  
  const loginMessage = document.getElementById('loginMessage');
  const registerMessage = document.getElementById('registerMessage');
  
  // Alternar entre formulários
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  });
  
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  });
    // Validação de formulários
  registerFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Obter valores dos campos
    const nome = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const senha = document.getElementById('registerPassword').value;
    const is_priority = document.getElementById('priorityUser').checked;
    // Limpar mensagem
    registerMessage.textContent = '';
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, is_priority })
      });
      const data = await response.json();
      if (data.success) {
        registerMessage.textContent = 'Cadastro realizado com sucesso! Faça login.';
        // Opcional: redirecionar para login após alguns segundos
        setTimeout(() => {
          loginForm.style.display = 'block';
          registerForm.style.display = 'none';
        }, 1500);
      } else {
        registerMessage.textContent = data.message || 'Erro ao cadastrar.';
      }
    } catch (err) {
      registerMessage.textContent = 'Erro de conexão com o servidor.';
    }
  });

  loginFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Obter valores dos campos
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginPassword').value;
    // Limpar mensagem
    loginMessage.textContent = '';
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const data = await response.json();
      if (data.success) {
        // Salvar usuário logado
        localStorage.setItem('currentUser', JSON.stringify(data.usuario));
        window.location.href = 'hospitais.html';
      } else {
        loginMessage.textContent = data.message || 'Email ou senha incorretos.';
      }
    } catch (err) {
      loginMessage.textContent = 'Erro de conexão com o servidor.';
    }
  });
    // Funções utilitárias
  
  // Validar formato de e-mail
  function isValidEmail(email) {
    // Expressão regular simples para validação de email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
