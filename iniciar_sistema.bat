@echo off
color 0A
echo ===================================================
echo      SISTEMA FILAFACIL SAUDE - MENU PRINCIPAL
echo ===================================================
echo.
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ERRO: Node.js nao encontrado! Certifique-se de que o Node.js esteja instalado.
    goto :menu_principal
)

where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0E
    echo AVISO: MySQL Client nao foi encontrado no PATH do sistema.
    echo Isso pode indicar que o MySQL nao esta instalado ou configurado corretamente.
    echo O sistema pode funcionar se o servidor MySQL estiver rodando, mas nao podera ser diagnosticado.
)

:menu_principal
echo.
echo Escolha uma opcao:
echo.
echo [1] Iniciar sistema completo (backend + frontend)
echo [2] Iniciar apenas o backend
echo [3] Abrir frontend (requer backend rodando)
echo [4] Verificar diagnostico do sistema
echo [5] Limpar cache e dados do sistema
echo [0] Sair
echo.
set /p opcao="Digite a opcao desejada: "

if "%opcao%"=="1" goto :iniciar_completo
if "%opcao%"=="2" goto :iniciar_backend
if "%opcao%"=="3" goto :abrir_frontend
if "%opcao%"=="4" goto :diagnostico
if "%opcao%"=="5" goto :limpar_cache
if "%opcao%"=="0" goto :sair

echo.
echo Opcao invalida. Tente novamente.
goto :menu_principal

:iniciar_completo
cls
echo ===================================================
echo      INICIANDO SISTEMA FILAFACIL SAUDE
echo ===================================================
echo.
echo [1/3] Verificando requisitos...

echo [2/3] Iniciando servidor backend...
start powershell -NoExit -Command "cd '%~dp0backend'; Write-Host 'Iniciando servidor backend na porta 3000...' -ForegroundColor Green; node index.js"

echo [3/3] Abrindo aplicativo no navegador...
timeout /t 3 >nul
start "" "http://localhost:3000"
timeout /t 2 >nul
start "" "%~dp0frontend\index.html"
echo Se o frontend nao abrir automaticamente, acesse: file:///%~dp0frontend/index.html

echo.
echo Sistema iniciado com sucesso!
echo - Backend: http://localhost:3000
echo - Frontend: Aberto no navegador
echo.
echo Pressione qualquer tecla para voltar ao menu principal...
pause >nul
cls
goto :menu_principal

:iniciar_backend
cls
echo ===================================================
echo      INICIANDO BACKEND FILAFACIL SAUDE
echo ===================================================
echo.
start powershell -NoExit -Command "cd '%~dp0backend'; Write-Host 'Iniciando servidor backend na porta 3000...' -ForegroundColor Green; node index.js"
echo Servidor backend iniciado na porta 3000
echo.
echo Pressione qualquer tecla para voltar ao menu principal...
pause >nul
cls
goto :menu_principal

:abrir_frontend
cls
echo ===================================================
echo      ABRINDO FRONTEND FILAFACIL SAUDE
echo ===================================================
echo.
echo Certifique-se de que o backend esta rodando!
echo.
start "" "%~dp0frontend\index.html"
echo Frontend aberto no navegador padrao
echo.
echo Se o navegador nao abrir o frontend corretamente, tente:
echo - Copiar e colar o seguinte endereco no navegador:
echo   file:///%~dp0frontend/index.html
echo - ou acessar manualmente a pasta do projeto e abrir o arquivo index.html
echo.
echo Pressione qualquer tecla para voltar ao menu principal...
pause >nul
cls
goto :menu_principal

:diagnostico
cls
echo ===================================================
echo      DIAGNOSTICO FILAFACIL SAUDE
echo ===================================================
echo.
echo Abrindo pagina de diagnostico...
start "" "%~dp0frontend\diagnostico.html"
echo.
echo Pressione qualquer tecla para voltar ao menu principal...
pause >nul
cls
goto :menu_principal

:limpar_cache
cls
echo ===================================================
echo      LIMPEZA DE CACHE E DADOS
echo ===================================================
echo.
echo AVISO: Esta operacao ira excluir todos os dados de login
echo e sessao armazenados no navegador para este sistema.
echo.
set /p confirma="Tem certeza que deseja continuar? (S/N): "
if /i "%confirma%"=="S" (
    echo @echo off > "%TEMP%\clear_filafacil.html"
    echo ^<html^>^<body^>^<script^> >> "%TEMP%\clear_filafacil.html"
    echo localStorage.removeItem('currentUser'); >> "%TEMP%\clear_filafacil.html"
    echo localStorage.removeItem('currentQueue'); >> "%TEMP%\clear_filafacil.html"
    echo document.write('Cache limpo com sucesso!'); >> "%TEMP%\clear_filafacil.html"
    echo setTimeout(function() { window.close(); }, 3000); >> "%TEMP%\clear_filafacil.html"
    echo ^</script^>^</body^>^</html^> >> "%TEMP%\clear_filafacil.html"
    start "" "%TEMP%\clear_filafacil.html"
    echo Cache limpo com sucesso!
) else (
    echo Operacao cancelada pelo usuario.
)
echo.
echo Pressione qualquer tecla para voltar ao menu principal...
pause >nul
cls
goto :menu_principal

:sair
cls
echo Obrigado por usar o sistema FilaFacil Saude!
exit

:fim
pause
