@echo off
echo Iniciando o servidor FilaFacil Saude...
echo.
echo Certifique-se de que o MySQL esta rodando com:
echo   Usuario: root
echo   Senha: admin123
echo.
echo Pressione qualquer tecla para iniciar o servidor...
pause > nul

cd "%~dp0"
echo Iniciando o servidor na porta 3000...
node index.js

pause
