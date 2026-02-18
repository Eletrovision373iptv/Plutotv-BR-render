@echo off
title Robo Pluto TV - Eletrovision
cls

echo ======================================================
echo    INICIANDO ATUALIZACAO PLUTO TV (IP LOCAL BR)
echo ======================================================
echo.

:: ENTRA NA PASTA CORRETA
cd /d "C:\Users\Uso\Desktop\plutotv BR"

:: 1. GERA A LISTA COM PYTHON
echo [PASSO 1/4] Gerando lista M3U...
python gerar_pluto.py

:: 2. SINCRONIZA COM O GITHUB (RESOLVE O ERRO DE REJECTED)
echo.
echo [PASSO 2/4] Sincronizando com a nuvem...
git pull origin main --rebase

:: 3. ORGANIZA OS ARQUIVOS
echo.
echo [PASSO 3/4] Preparando atualizacao...
git add .
git commit -m "Atualizacao automatica com SIDs fixos"

:: 4. ENVIA PARA O GITHUB
echo.
echo [PASSO 4/4] Enviando para o GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ########## ERRO NO ENVIO ##########
    echo Tentando forçar envio...
    git push origin main --force
) else (
    echo.
    echo ======================================================
    echo    SUCESSO! Lista e Site atualizados.
    echo ======================================================
)

pause