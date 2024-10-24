import requests
import random

url = 'https://potterhead-api.vercel.app/api/spells'

def get_spells():
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()  
    else:
        print("Erro ao acessar a API.")
        return []


def guess_spell_game():
    spells = get_spells() 
    if not spells:
        return 
    

    selected_spell = random.choice(spells)
    spell_name = selected_spell['name']
    spell_description = selected_spell['description']

    print("Bem-vindo ao jogo de adivinhação de feitiços do mundo de Harry Potter!")
    print(f"Dica: {spell_description}")

    
    while True:
        guess = input("Tente adivinhar o nome do feitiço: ")
        
        if guess.lower() == spell_name.lower():
            print("Parabéns! Você acertou o feitiço!")
            break  
        else:
            print("Incorreto! Tente novamente.")


guess_spell_game()
