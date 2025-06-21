-- Criação do banco de dados por João Gabriel
CREATE DATABASE IF NOT EXISTS filafacil_saude;
USE filafacil_saude;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(100) NOT NULL,
  is_priority BOOLEAN DEFAULT FALSE
);

-- Tabela de filas
CREATE TABLE IF NOT EXISTS filas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  hospital_nome VARCHAR(100) NOT NULL,
  tempo_estimado INT NOT NULL,
  posicao INT NOT NULL,
  data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
