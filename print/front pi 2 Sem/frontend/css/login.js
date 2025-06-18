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
    
    // Validar email
    if (!isValidEmail(email)) {
      registerMessage.textContent = 'Por favor, insira um e-mail válido.';
      registerMessage.style.color = '#e53935';
      return;
    }
    
    // Validar senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      registerMessage.textContent = 'A senha deve ter no mínimo 6 caracteres.';
      registerMessage.style.color = '#e53935';
      return;
    }
    
    // Enviar para o backend
    registerMessage.textContent = 'Cadastrando...';
    registerMessage.style.color = '#00c4a7';
    
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          is_priority
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        registerMessage.textContent = 'Cadastrado com sucesso! Redirecionando...';
        
        // Redirecionar para página de login após 2 segundos
        setTimeout(() => {
          loginForm.style.display = 'block';
          registerForm.style.display = 'none';
          registerFormEl.reset();
          registerMessage.textContent = '';
        }, 2000);
      } else {
        registerMessage.textContent = data.message || 'Erro ao cadastrar usuário.';
        registerMessage.style.color = '#e53935';
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      registerMessage.textContent = 'Erro de conexão. Tente novamente mais tarde.';
      registerMessage.style.color = '#e53935';
    }
  });
    loginFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Obter valores dos campos
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginPassword').value;
    
    // Validar email
    if (!isValidEmail(email)) {
      loginMessage.textContent = 'Por favor, insira um e-mail válido.';
      loginMessage.style.color = '#e53935';
      return;
    }
    
    // Processar login
    loginMessage.textContent = 'Autenticando...';
    loginMessage.style.color = '#00c4a7';
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        loginMessage.textContent = 'Login bem-sucedido! Redirecionando...';
        
        // Salvar informação de usuário logado
        localStorage.setItem('currentUser', JSON.stringify({
          id: data.usuario.id,
          name: data.usuario.nome,
          email: data.usuario.email,
          isPriority: data.usuario.is_priority
        }));
        
        // Redirecionar para a página principal após 1.5 segundos
        setTimeout(() => {
          window.location.href = 'hospitais.html';
        }, 1500);
      } else {
        loginMessage.textContent = data.message || 'Email ou senha incorretos!';
        loginMessage.style.color = '#e53935';
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      loginMessage.textContent = 'Erro de conexão. Tente novamente mais tarde.';
      loginMessage.style.color = '#e53935';
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
