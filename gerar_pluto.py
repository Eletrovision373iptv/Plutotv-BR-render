import requests
import uuid

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
                    
                    session_id = str(uuid.uuid4())
                    device_id = str(uuid.uuid4())
                    
                    # --- PARAMETROS ATUALIZADOS PARA EVITAR ERRO DE DEVICEVERSION ---
                    params = (
                        f"appName=web&"
                        f"appVersion=5.33.0&"
                        f"deviceDNT=0&"
                        f"deviceId={device_id}&"
                        f"deviceMake=Chrome&"
                        f"deviceModel=web&"
                        f"deviceType=web&"
                        f"deviceVersion=120.0.0.0&"  # <-- ADICIONADO AQUI
                        f"sid={session_id}&"
                        f"userId={device_id}&"
                        f"marketingRegion=BR&"
                        f"locale=pt-BR&"
                        f"lang=pt&"
                        f"includeExtendedEvents=false" # <-- ADICIONADO PARA ESTABILIDADE
                    )
                    
                    link_final = f"{url_base}?{params}"
                    
                    nome = c.get('name', 'Canal Pluto')
                    logo = c.get('colorLogoPNG', {}).get('path', '')
                    cat = c.get('category', 'Geral')
                    
                    f.write(f'#EXTINF:-1 tvg-id="{c.get("_id","")}" tvg-logo="{logo}" group-title="{cat}",{nome}\n')
                    f.write(f'{link_final}\n')
                    
        print("✅ Arquivo lista.m3u corrigido com DeviceVersion!")
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    gerar_lista()