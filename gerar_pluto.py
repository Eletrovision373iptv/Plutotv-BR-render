import requests

def gerar_lista():
    print("Buscando canais da Pluto TV...")
    url_api = "https://api.pluto.tv/v2/channels?marketingRegion=BR&locale=pt-BR"
    
    try:
        response = requests.get(url_api)
        canais = response.json()
        
        with open("lista.m3u", "w", encoding="utf-8") as f:
            f.write("#EXTM3U\n")
            for c in canais:
                if 'stitched' in c and c['stitched']['urls']:
                    url_base = c['stitched']['urls'][0]['url'].split('?')[0]
                    # Parâmetros para travar o áudio em PT-BR
                    params = "appName=web&appVersion=unknown&deviceDNT=0&deviceId=12345&deviceMake=Chrome&deviceModel=web&deviceType=web&marketingRegion=BR&locale=pt-BR&lang=pt"
                    link_final = f"{url_base}?{params}"
                    
                    nome = c['name']
                    logo = c.get('colorLogoPNG', {}).get('path', '')
                    cat = c.get('category', 'Geral')
                    
                    f.write(f'#EXTINF:-1 tvg-logo="{logo}" group-title="{cat}",{nome}\n')
                    f.write(f'{link_final}\n')
                    
        print("✅ Arquivo lista.m3u gerado com sucesso!")
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    gerar_lista()