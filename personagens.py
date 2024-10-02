import requests

import random

API_URL = 'https://potterhead-api.vercel.app/api/characters'

# Função para obter a lista de personagens da API
def obter_personagens():
    response = requests.get(API_URL)
    response.raise_for_status()  # Verifica se houve um erro na requisição
    return response.json()


# Função para fornecer as características do personagem
def verificar_caracteristicas(personagem_correto, personagem_tentativa):
    resultados = {
        'nome': personagem_tentativa.get('name', '') == personagem_correto.get('name', ''),
        'casa': personagem_tentativa.get('house', '') == personagem_correto.get('house', ''),
        'genero': personagem_tentativa.get('gender', '') == personagem_correto.get('gender', ''),
        'patrono': personagem_tentativa.get('patronus', '') == personagem_correto.get('patronus', ''),
        'mago': personagem_tentativa.get('wizard', False) == personagem_correto.get('wizard', False),
        'ancestralidade': personagem_tentativa.get('ancestry', '') == personagem_correto.get('ancestry', '')
    }
    return resultados


# Função principal do jogo
def jogar():
    personagens = obter_personagens()
    personagem_correto = random.choice(personagens)

    print("Bem-vindo ao jogo de adivinhação do Harry Potter!")

    while True:
        resposta = input("Digite o nome do personagem: ").strip()

        # Encontra o personagem com o nome fornecido
        personagem_tentativa = next((p for p in personagens if p.get('name', '').lower() == resposta.lower()), None)

        if personagem_tentativa:
            resultados = verificar_caracteristicas(personagem_correto, personagem_tentativa)

            if resultados['nome']:
                print("Parabéns! Você acertou!")
                break
            else:
                print("Não é o personagem correto. Aqui estão as características comparadas:")
                for chave, valor in resultados.items():
                    print(f"{chave.capitalize()}: {'Correto' if valor else 'Incorreto'}")
        else:
            print("Personagem não encontrado. Tente novamente.")


if __name__ == "__main__":
    jogar()
