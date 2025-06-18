const { getConnection } = require('./db');

// Controller para operações relacionadas a usuários
const usuariosController = {
  // Cadastrar um novo usuário
  async cadastrar(req, res) {
    const { nome, email, senha, is_priority } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ success: false, message: 'Dados incompletos. Nome, email e senha são obrigatórios.' });
    }

    try {
      const conn = await getConnection();
      
      // Verificar se o email já está em uso
      const [verificaEmail] = await conn.execute(
        'SELECT * FROM usuarios WHERE email = ?', 
        [email]
      );
      
      if (verificaEmail.length > 0) {
        await conn.end();
        return res.status(400).json({ success: false, message: 'Este email já está cadastrado.' });
      }
      
      // Inserir novo usuário
      const [result] = await conn.execute(
        'INSERT INTO usuarios (nome, email, senha, is_priority) VALUES (?, ?, ?, ?)',
        [nome, email, senha, is_priority || false]
      );

      await conn.end();
      
      return res.status(201).json({ 
        success: true, 
        message: 'Usuário cadastrado com sucesso!',
        usuario: {
          id: result.insertId,
          nome,
          email,
          is_priority: is_priority || false
        }
      });
      
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.' });
    }
  },

  // Login de usuário
  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
    }

    try {
      const conn = await getConnection();
      
      const [usuarios] = await conn.execute(
        'SELECT id, nome, email, is_priority FROM usuarios WHERE email = ? AND senha = ?',
        [email, senha]
      );
      
      await conn.end();
      
      if (usuarios.length === 0) {
        return res.status(401).json({ success: false, message: 'Email ou senha incorretos.' });
      }
      
      return res.status(200).json({ success: true, usuario: usuarios[0] });
      
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return res.status(500).json({ success: false, message: 'Erro ao realizar login.' });
    }
  },

  // Remover usuário pelo email
  async remover(req, res) {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email é obrigatório.' });
    }

    try {
      const conn = await getConnection();
      
      const [result] = await conn.execute(
        'DELETE FROM usuarios WHERE email = ?',
        [email]
      );
      
      await conn.end();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }
      
      return res.status(200).json({ success: true, message: 'Usuário removido com sucesso.' });
      
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      return res.status(500).json({ success: false, message: 'Erro ao remover usuário.' });
    }
  }
};

module.exports = usuariosController;
