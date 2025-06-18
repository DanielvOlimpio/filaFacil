# GUIA DE EXECUÇÃO - FILAFÁCIL SAÚDE

## REQUISITOS

1. Node.js (v14+) instalado
2. MySQL (v5.7+) instalado e rodando
3. Navegador moderno (Chrome, Firefox, Edge)

## CONFIGURAÇÃO DO MYSQL

1. Certifique-se que o MySQL está rodando
2. Usuário: `root`
3. Senha: `admin123`

## PASSOS PARA INICIAR O SISTEMA

### 1. Iniciar o Backend

1. Abra a pasta `backend` 
2. Execute o arquivo `iniciar_servidor.bat` (Windows)
   * Ou pela linha de comando: `cd backend && npm start`
3. Se tudo estiver correto, você verá:
   * "Conectado ao MySQL com sucesso!"
   * "Banco de dados e tabelas criados com sucesso!"
   * "Servidor rodando na porta 3000"

### 2. Acessar o Frontend

1. Abra a pasta `frontend` 
2. Abra o arquivo `index.html` no seu navegador
3. Você será direcionado para a página inicial do sistema

### 3. Usando o Sistema

1. Na tela inicial, clique em "Entrar no Sistema"
2. Faça login ou cadastre-se:
   * Para login: use email e senha cadastrados
   * Para cadastro: preencha todos os campos do formulário
3. Após o login, você verá a lista de hospitais
4. Clique em "Entrar na Fila" no hospital desejado
5. Você será redirecionado para a página de acompanhamento da fila
6. A posição na fila e tempo estimado serão atualizados automaticamente

## SOLUÇÃO DE PROBLEMAS

### Erro de Conexão com o MySQL

* Verifique se o MySQL está rodando
* Confirme que o usuário `root` está configurado com senha `admin123`
* Execute o seguinte comando no MySQL:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin123';
  FLUSH PRIVILEGES;
  ```

### Frontend não conecta ao Backend

* Verifique se o servidor backend está rodando na porta 3000
* Confirme que não há firewall bloqueando a conexão
* Verifique se o arquivo `iniciar_servidor.bat` foi executado e está rodando

### O registro/login não funciona

* Certifique-se de que o banco de dados foi criado corretamente
* Verifique se o MySQL está aceitando conexões
* Confirme que os campos obrigatórios estão preenchidos corretamente

Para mais detalhes, consulte o arquivo `GUIA_DE_INSTALACAO.md` na pasta `backend`.
