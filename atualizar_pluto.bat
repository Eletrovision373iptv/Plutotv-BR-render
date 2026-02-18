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
echo [PASSO 1/3] Gerando lista M3U...
python gerar_pluto.py

:: 2. ORGANIZA OS ARQUIVOS (ADICIONA TUDO PARA EVITAR ERRO)
echo.
echo [PASSO 2/3] Preparando Git...
git add .
git commit -m "Lista e scripts atualizados"

:: 3. ENVIA PARA O GITHUB (CORREÇÃO DE MASTER PARA MAIN)
echo.
echo [PASSO 3/3] Enviando para o GitHub...
:: Este comando renomeia sua branch local para 'main' para bater com o GitHub
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ########## ERRO NO GIT ##########
    echo Verifique se o repositorio no GitHub existe ou se precisa de login.
) else (
    echo.
    echo ======================================================
    echo    SUCESSO! Site e M3U atualizados no GitHub.
    echo ======================================================
)

pause