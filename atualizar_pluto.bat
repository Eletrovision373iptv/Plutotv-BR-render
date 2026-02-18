@echo off
title Robo Pluto TV - Eletrovision
cls

echo ======================================================
echo    INICIANDO ATUALIZACAO PLUTO TV (IP LOCAL BR)
echo ======================================================
echo.

cd /d "C:\Users\Uso\Desktop\plutotv BR"

:: 1. GERA A LISTA
echo [PASSO 1/3] Gerando lista M3U...
python gerar_pluto.py

:: 2. SALVA AS MUDANCAS LOCALMENTE
echo.
echo [PASSO 2/3] Salvando mudancas locais...
git add .
git commit -m "Atualizacao automatica SIDs"

:: 3. SINCRONIZA E ENVIA (FORCADO PARA GARANTIR)
echo.
echo [PASSO 3/3] Enviando para o GitHub...
git pull origin main --rebase
git push origin main --force

echo.
echo ======================================================
echo    SUCESSO TOTAL! Lista online e funcional.
echo ======================================================

pause