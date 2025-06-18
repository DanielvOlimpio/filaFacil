# Resolução de Problemas - Sistema FilaFácil Saúde

Este guia ajudará a identificar e resolver problemas comuns que podem ocorrer na execução do sistema.

## 1. Problema de Conexão entre Front-end e Back-end

**Sintoma:** O front-end carrega, mas não consegue fazer login ou cadastro. Mensagens de erro de conexão aparecem no console.

**Causas possíveis e soluções:**

1. **Servidor back-end não está rodando**
   - Execute o arquivo `iniciar_sistema.bat` na raiz do projeto e escolha a opção 1 ou 2 para iniciar o back-end
   - Verifique se aparece a mensagem "Servidor rodando na porta 3000" no terminal

2. **CORS bloqueando as requisições**
   - Abra a página de diagnóstico (pelo menu principal ou navegando até `front pi 2 SemDsm/diagnostico.html`)
   - Se o problema for de CORS, o diagnóstico indicará isso com uma solução

3. **Nome do banco de dados incorreto**
   - Verifique se o nome do banco no arquivo `backend/controllers/db.js` está como `filafacil_saude` (e não `filafacil_saude1`)

## 2. Problemas com o Banco de Dados MySQL

**Sintoma:** Mensagens de erro relacionadas a conexão com o banco de dados no terminal do back-end.

**Causas possíveis e soluções:**

1. **MySQL não está rodando**
   - Verifique se o serviço MySQL está iniciado
   - No Windows: Abra "Serviços" (services.msc) e veja se o serviço MySQL está em execução

2. **Credenciais incorretas**
   - As credenciais configuradas são:
     - Usuário: `root`
     - Senha: `admin123`
   - Se precisar alterar a senha do MySQL:
     ```sql
     ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin123';
     FLUSH PRIVILEGES;
     ```

3. **Banco de dados não foi criado**
   - O sistema deve criar o banco automaticamente na primeira execução
   - Se isso não ocorrer, execute manualmente os scripts SQL em `backend/sql/`

## 3. Problemas de Login ou Cadastro

**Sintoma:** Não consegue fazer login mesmo com o back-end rodando corretamente.

**Causas possíveis e soluções:**

1. **Cache do navegador com dados antigos**
   - Execute o script `iniciar_sistema.bat` e escolha a opção 5 para limpar o cache
   - Ou abra as ferramentas de desenvolvedor do navegador (F12), vá para "Application" > "Storage" > "Local Storage" e exclua os itens

2. **Usuário não existe no banco de dados**
   - Use os usuários de exemplo configurados:
     - Email: `joa@email.com`, Senha: `senha123`
     - Email: `mari@email.com`, Senha: `senha456`
     - Email: `pedr@email.com`, Senha: `senha789`
   - Ou cadastre um novo usuário pela interface

## 4. Ferramenta de Diagnóstico

O sistema inclui uma ferramenta de diagnóstico que verifica automaticamente:

1. Status do front-end
2. Status do back-end
3. Conexão com o banco de dados
4. Integração entre front-end e back-end

Para acessar esta ferramenta:
- Clique no link "Diagnóstico do Sistema" na página inicial, ou
- Execute `iniciar_sistema.bat` e escolha a opção 4, ou
- Navegue diretamente para `front pi 2 SemDsm/diagnostico.html`

## 5. Outros Problemas Comuns

1. **Arquivos JavaScript não estão sendo carregados**
   - Verifique se está acessando as páginas pelo mesmo caminho indicado no menu
   - Algumas configurações de segurança de navegador podem bloquear o carregamento de scripts

2. **Porta 3000 já está em uso**
   - Se outro aplicativo estiver usando a porta 3000, você verá um erro ao iniciar o back-end
   - Encerre o outro aplicativo ou altere a porta no arquivo `backend/index.js`

3. **Navegador não abre automaticamente**
   - Se o navegador não abrir automaticamente ao iniciar o sistema, navegue manualmente para:
     - Front-end: Abra o arquivo `front pi 2 SemDsm/index.html`
     - Back-end: http://localhost:3000

## Suporte

Se os problemas persistirem após tentar estas soluções, execute a ferramenta de diagnóstico e verifique os logs gerados na pasta `backend/logs/` para obter mais informações sobre o erro.
