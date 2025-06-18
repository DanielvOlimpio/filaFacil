const { getConnection } = require('./db');

// Controller para operações relacionadas a filas
const filasController = {
  // Cadastrar usuário na fila
  async cadastrar(req, res) {
    const { email, hospital_nome } = req.body;

    if (!email || !hospital_nome) {
      return res.status(400).json({ success: false, message: 'Email do usuário e nome do hospital são obrigatórios.' });
    }

    try {
      const conn = await getConnection();
      
      // Buscar o usuário pelo email
      const [usuarios] = await conn.execute(
        'SELECT id, nome, is_priority FROM usuarios WHERE email = ?', 
        [email]
      );
      
      if (usuarios.length === 0) {
        await conn.end();
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }
      
      const usuario = usuarios[0];
      const usuario_id = usuario.id;
      
      // Verificar se o usuário já está na fila deste hospital
      const [filaExistente] = await conn.execute(
        'SELECT id FROM filas WHERE usuario_id = ? AND hospital_nome = ?', 
        [usuario_id, hospital_nome]
      );
      
      if (filaExistente.length > 0) {
        await conn.end();
        return res.status(400).json({ success: false, message: 'Usuário já está na fila deste hospital.' });
      }
      
      // Calcular posição real na fila
      const [countResult] = await conn.execute(
        'SELECT COUNT(id) as total FROM filas WHERE hospital_nome = ?',
        [hospital_nome]
      );
      const posicao = countResult[0].total + 1;
      
      // Calcular tempo estimado (5 minutos por posição)
      const tempo_estimado = posicao * 5;
      
      // Inserir na fila
      const [result] = await conn.execute(
        'INSERT INTO filas (usuario_id, hospital_nome, tempo_estimado, posicao) VALUES (?, ?, ?, ?)',
        [usuario_id, hospital_nome, tempo_estimado, posicao]
      );

      await conn.end();
      
      return res.status(201).json({ 
        success: true, 
        message: 'Usuário adicionado à fila com sucesso!',
        fila: {
          id: result.insertId,
          hospital_nome,
          posicao,
          tempo_estimado,
          usuario_nome: usuario.nome,
          is_priority: usuario.is_priority
        }
      });
      
    } catch (error) {
      console.error('Erro ao cadastrar na fila:', error);
      return res.status(500).json({ success: false, message: 'Erro ao cadastrar na fila.' });
    }
  },

  // Consultar fila do usuário pelo email
  async consultar(req, res) {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email é obrigatório.' });
    }

    try {
      const conn = await getConnection();
      
      const [filas] = await conn.execute(`
        SELECT f.id, f.hospital_nome, f.posicao, f.tempo_estimado, f.data_entrada, u.nome as usuario_nome, u.is_priority
        FROM filas f
        INNER JOIN usuarios u ON f.usuario_id = u.id
        WHERE u.email = ?
        ORDER BY f.data_entrada DESC
      `, [email]);
      
      await conn.end();
      
      if (filas.length === 0) {
        return res.status(404).json({ success: false, message: 'Usuário não está em nenhuma fila.' });
      }
      
      return res.status(200).json({ success: true, filas });
      
    } catch (error) {
      console.error('Erro ao consultar fila:', error);
      return res.status(500).json({ success: false, message: 'Erro ao consultar fila.' });
    }
  }
};

module.exports = filasController;
