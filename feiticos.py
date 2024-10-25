import requests


url = 'https://potterhead-api.vercel.app/api/spells'

response = requests.get(url)


if response.status_code == 200:
    spells = response.json()  
    for spell in spells:
        print(f"Nome: {spell['name']}")
        print(f"Descrição: {spell['description']}")
        
else:
    print(f"Erro ao acessar a API. Código de status: {response.status_code}")
