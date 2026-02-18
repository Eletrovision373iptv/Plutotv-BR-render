import requests
import uuid

def gerar_lista():
    print("Buscando canais da Pluto TV...")
    # API com localização Brasil
    url_api = "https://api.pluto.tv/v2/channels?marketingRegion=BR&locale=pt-BR"
    
    try:
        response = requests.get(url_api)
        canais = response.json()
        
        with open("lista.m3u", "w", encoding="utf-8") as f:
            f.write("#EXTM3U\n")
            
            for c in canais:
                if 'stitched' in c and c['stitched']['urls']:
                    # Pegamos a URL base sem parâmetros antigos
                    url_base = c['stitched']['urls'][0]['url'].split('?')[0]
                    
                    # Geramos IDs únicos para simular um dispositivo real
                    session_id = str(uuid.uuid4())
                    device_id = str(uuid.uuid4())
                    
                    # Parâmetros obrigatórios para não dar erro de SID
                    params = (
                        f"appName=web&"
                        f"appVersion=5.33.0&"
                        f"deviceDNT=0&"
                        f"deviceId={device_id}&"
                        f"deviceMake=Chrome&"
                        f"deviceModel=web&"
                        f"deviceType=web&"
                        f"sid={session_id}&"  # ESTE É O CAMPO QUE ESTAVA FALTANDO
                        f"userId={device_id}&"
                        f"marketingRegion=BR&"
                        f"locale=pt-BR&"
                        f"lang=pt"
                    )
                    
                    link_final = f"{url_base}?{params}"
                    
                    nome = c.get('name', 'Canal Pluto')
                    logo = c.get('colorLogoPNG', {}).get('path', '')
                    cat = c.get('category', 'Geral')
                    
                    f.write(f'#EXTINF:-1 tvg-id="{c.get("_id","")}" tvg-logo="{logo}" group-title="{cat}",{nome}\n')
                    f.write(f'{link_final}\n')
                    
        print("✅ Arquivo lista.m3u gerado com sucesso com SIDs válidos!")
    except Exception as e:
        print(f"❌ Erro ao gerar lista: {e}")

if __name__ == "__main__":
    gerar_lista()