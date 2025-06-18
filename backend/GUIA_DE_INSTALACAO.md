# Guia de Instalação e Uso do FilaFácil Saúde

## Pré-requisitos

1. **Node.js**: Versão 14 ou superior
2. **MySQL**: Versão 5.7 ou superior
3. **Configuração do MySQL**: 
   - Usuário: `root`
   - Senha: `admin123`

## Instalação

### 1. Configurar o Banco de Dados

Certifique-se que o MySQL está instalado e rodando em seu sistema. Você pode baixá-lo em: https://dev.mysql.com/downloads/installer/

Durante a instalação do MySQL, defina:
- Usuário: `root`
- Senha: `admin123`

Ou se você já tem o MySQL instalado, você pode alterar a senha com o seguinte comando:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin123';
```

### 2. Instalar as Dependências

No diretório do backend, execute:
```
npm install
```

### 3. Iniciar o Servidor Backend

Ainda no diretório do backend, execute:
```
npm start
```

Se tudo estiver correto, o servidor será iniciado na porta 3000 e você verá mensagens confirmando a conexão com o MySQL e a criação das tabelas.

## Endpoints da API

### Usuários

- **Cadastrar Usuário**:
  - `POST /usuarios`
  - Corpo: `{ "nome": "Nome do Usuário", "email": "usuario@email.com", "senha": "senha123", "is_priority": false }`

- **Remover Usuário**:
  - `DELETE /usuarios/usuario@email.com`

### Autenticação

- **Login**:
  - `POST /login`
  - Corpo: `{ "email": "usuario@email.com", "senha": "senha123" }`

### Filas

- **Cadastrar na Fila**:
  - `POST /fila`
  - Corpo: `{ "email": "usuario@email.com", "hospital_nome": "Hospital Santa Casa" }`

- **Consultar Fila**:
  - `GET /fila/usuario@email.com`

## Integração com o Frontend

O frontend já deve estar configurado para se conectar ao backend na porta 3000. Se necessário, verifique os arquivos JavaScript do frontend para confirmar que as chamadas de API estão apontando para o endereço correto (normalmente http://localhost:3000).

### Arquivos Relevantes do Frontend
- `login.js`: Manipula o login e cadastro de usuários
- `hospitais.js`: Lista e permite entrada nas filas dos hospitais
- `ticket.js`: Mostra informações sobre a posição do usuário na fila

## Resolução de Problemas Comuns

1. **Erro de Conexão com o MySQL**:
   - Verifique se o MySQL está instalado e rodando
   - Confirme que as credenciais (usuário e senha) estão corretas no arquivo `controllers/db.js`
   - Certifique-se que não há firewall bloqueando a porta do MySQL (normalmente 3306)

2. **Servidor Não Inicia**:
   - Verifique se a porta 3000 não está sendo usada por outro aplicativo
   - Confirme que todas as dependências foram instaladas corretamente com `npm install`

3. **Frontend Não Consegue se Conectar ao Backend**:
   - Verifique se o backend está rodando na porta 3000
   - Confirme que o frontend está fazendo requisições para o endereço correto
   - Verifique se o CORS está configurado corretamente no backend
