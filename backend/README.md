# FilaFácil Saúde - Backend

Backend para o sistema FilaFácil Saúde, desenvolvido com Node.js, Express e MySQL.

## Estrutura do Projeto

- `/controllers`: Lógica para manipulação dos dados
- `/routes`: Definição das rotas da API
- `/sql`: Scripts SQL para criação e população do banco de dados

## Configuração do Banco de Dados

- MySQL
- Usuário: `root`
- Senha: `admin123`
- Banco de dados: `filafacil_saude`

## Endpoints da API

### Usuários

- `POST /usuarios` - Cadastrar novo usuário
  - Corpo: `{ "nome": "string", "email": "string", "senha": "string", "is_priority": boolean }`
  
- `DELETE /usuarios/:email` - Remover usuário pelo email
  - Parâmetro: `email`

### Autenticação

- `POST /login` - Realizar login
  - Corpo: `{ "email": "string", "senha": "string" }`

### Filas

- `POST /fila` - Cadastrar usuário em uma fila
  - Corpo: `{ "email": "string", "hospital_nome": "string" }`
  
- `GET /fila/:email` - Consultar fila do usuário
  - Parâmetro: `email`

## Como Executar

1. Certifique-se de ter o Node.js e o MySQL instalados
2. Configure o MySQL com usuário `root` e senha `admin123`
3. Instale as dependências: `npm install`
4. Execute o projeto: `npm start`

O servidor será iniciado na porta 3000 por padrão.
