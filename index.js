'use strict';

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3003;

// --- CONFIGURAÇÃO DO TEU GITHUB ---
const GITHUB_USER = "Eletrovision373iptv";
const GITHUB_REPO = "Plutotv-BR-render";
const M3U_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/lista.m3u`;

// Função para ler a lista M3U do GitHub e transformar em JSON para o site
async function parseM3U() {
    try {
        const response = await axios.get(M3U_URL);
        const data = response.data;
        const lines = data.split('\n');
        const canais = [];

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('#EXTINF')) {
                const info = lines[i];
                const url = lines[i + 1]?.trim();
                
                // Extração de metadados (Nome, Logo, Categoria)
                const nomeMatch = info.split(',')[1] || "Canal Sem Nome";
                const logoMatch = info.match(/tvg-logo="([^"]+)"/);
                const catMatch = info.match(/group-title="([^"]+)"/);

                if (url && url.startsWith('http')) {
                    canais.push({
                        nome: nomeMatch.trim(),
                        logo: logoMatch ? logoMatch[1] : '',
                        categoria: catMatch ? catMatch[1] : 'Pluto TV',
                        url: url
                    });
                }
            }
        }
        return canais;
    } catch (error) {
        console.error("❌ Erro ao ler lista do GitHub:", error.message);
        return [];
    }
}

// --- INTERFACE VISUAL ---
app.get('/', async (req, res) => {
    const canais = await parseM3U();

    let html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Eletrovision - Pluto BR</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background: #0a0a0a; color: #eee; font-family: 'Segoe UI', sans-serif; }
            .topo { background: #000; padding: 15px; border-bottom: 3px solid #ffee00; position: sticky; top:0; z-index:1000; }
            .card { background: #161616; border: 1px solid #333; height: 100%; transition: 0.3s; }
            .card:hover { border-color: #ffee00; transform: translateY(-5px); box-shadow: 0 5px 15px rgba(255,238,0,0.1); }
            .logo-img { height: 60px; object-fit: contain; width: 100%; background: #000; padding: 8px; border-radius: 4px; }
            .btn-watch { background: #ffee00; color: #000; font-weight: bold; width: 100%; border:none; margin-bottom: 6px; }
            .btn-copy { background: #222; color: #fff; width: 100%; border: 1px solid #444; font-size: 11px; }
            .badge-cat { font-size: 9px; color: #ffee00; text-transform: uppercase; display: block; margin-bottom: 5px; letter-spacing: 1px; }
        </style>
    </head>
    <body>
    <div class="topo container-fluid d-flex justify-content-between align-items-center">
        <h4 class="m-0 text-white">PLUTO <span style="color:#ffee00">ELETROVISION</span></h4>
        <a href="/lista.m3u" class="btn btn-warning btn-sm fw-bold">📥 LISTA M3U</a>
    </div>
    <div class="container mt-4 pb-5">
        <div class="alert alert-dark py-2" style="font-size: 12px; border-left: 4px solid #ffee00;">
            🛰️ <strong>Status:</strong> Lista Sincronizada via IP Local Brasil.
        </div>
        <div class="row g-3">
        ${canais.length > 0 ? canais.map(ch => `
            <div class="col-6 col-md-4 col-lg-2">
                <div class="card p-3 text-center">
                    <img src="${ch.logo}" class="logo-img mb-2" onerror="this.src='https://via.placeholder.com/150?text=Pluto+TV'">
                    <small class="badge-cat text-truncate">${ch.categoria}</small>
                    <p class="text-truncate text-white fw-bold mb-3" style="font-size:12px;">${ch.nome}</p>
                    <a href="${ch.url}" target="_blank" class="btn btn-sm btn-watch">ASSISTIR</a>
                    <button onclick="copiar('${ch.url}')" class="btn btn-sm btn-copy">COPIAR LINK</button>
                </div>
            </div>`).join('') : '<p class="text-center mt-5">Aguardando arquivo lista.m3u no GitHub...</p>'}
        </div>
    </div>
    <script>
        function copiar(t){ 
            navigator.clipboard.writeText(t).then(() => {
                alert('Link copiado! Pode colar no seu player.');
            }); 
        }
    </script>
    </body></html>`;
    res.send(html);
});

// --- ROTA DE DOWNLOAD DA M3U ---
app.get('/lista.m3u', (req, res) => {
    res.redirect(M3U_URL);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Painel Eletrovision Online!`);
});
