'use strict';

const express = require('express');
const axios = require('axios'); // Vamos usar axios para ler a lista do GitHub
const app = express();
const PORT = process.env.PORT || 3003;

// --- CONFIGURAÇÃO DO SEU GITHUB ---
const GITHUB_USER = "SEU_USUARIO_AQUI";
const GITHUB_REPO = "SEU_REPOSITORIO_AQUI";
const M3U_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/lista.m3u`;

// Função para transformar o arquivo M3U em uma lista de objetos para o site
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
                
                // Extração simples de metadados
                const nome = info.split(',')[1] || "Canal Sem Nome";
                const logoMatch = info.match(/tvg-logo="([^"]+)"/);
                const catMatch = info.match(/group-title="([^"]+)"/);
                const idMatch = info.match(/tvg-id="([^"]+)"/);

                canais.push({
                    id: idMatch ? idMatch[1] : Math.random().toString(36),
                    nome: nome.trim(),
                    logo: logoMatch ? logoMatch[1] : '',
                    categoria: catMatch ? catMatch[1] : 'Geral',
                    url: url
                });
            }
        }
        return canais;
    } catch (error) {
        console.error("Erro ao ler lista do GitHub:", error.message);
        return [];
    }
}

// --- PAINEL VISUAL ---
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
            body { background: #0a0a0a; color: #eee; font-family: sans-serif; }
            .topo { background: #000; padding: 15px; border-bottom: 3px solid #ffee00; position: sticky; top:0; z-index:1000; }
            .card { background: #161616; border: 1px solid #333; height: 100%; transition: 0.3s; }
            .card:hover { border-color: #ffee00; transform: translateY(-5px); }
            .logo-img { height: 60px; object-fit: contain; width: 100%; padding: 8px; }
            .btn-watch { background: #ffee00; color: #000; font-weight: bold; width: 100%; border:none; margin-bottom: 6px; }
            .btn-copy { background: #222; color: #fff; width: 100%; border: 1px solid #444; font-size: 11px; }
            .badge-cat { font-size: 9px; color: #ffee00; text-transform: uppercase; display: block; margin-bottom: 5px; }
        </style>
    </head>
    <body>
    <div class="topo d-flex justify-content-between align-items-center container-fluid">
        <h4 class="m-0 text-white">PLUTO <span style="color:#ffee00">ELETROVISION</span></h4>
        <a href="/lista.m3u" class="btn btn-warning btn-sm fw-bold">📥 BAIXAR M3U</a>
    </div>
    <div class="container mt-4 pb-5">
        <p class="text-muted small">Sincronizado com IP Local Brasil via Robô .BAT</p>
        <div class="row g-3">
        ${canais.map(ch => `
            <div class="col-6 col-md-4 col-lg-2">
                <div class="card p-3 text-center">
                    <img src="${ch.logo}" class="logo-img mb-2" onerror="this.src='https://via.placeholder.com/150?text=TV'">
                    <small class="badge-cat">${ch.categoria}</small>
                    <p class="text-truncate text-white fw-bold mb-3" style="font-size:12px;">${ch.nome}</p>
                    <a href="${ch.url}" target="_blank" class="btn btn-sm btn-watch">ASSISTIR</a>
                    <button onclick="copiar('${ch.url}')" class="btn btn-sm btn-copy">COPIAR LINK</button>
                </div>
            </div>`).join('')}
        </div>
    </div>
    <script>
        function copiar(t){ navigator.clipboard.writeText(t).then(()=>alert('Link do canal copiado!')); }
    </script>
    </body></html>`;
    res.send(html);
});

// --- ROTA QUE ENTREGA A M3U ---
app.get('/lista.m3u', (req, res) => {
    // Redireciona diretamente para o arquivo que o seu .bat enviou
    res.redirect(M3U_URL);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Site Rodando na porta ${PORT}`);
});
