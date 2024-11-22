const searchWrapper = document.querySelector(".search");
const inputBox = searchWrapper.querySelector("input");
const sugestBox = searchWrapper.querySelector(".list");
const icon = searchWrapper.querySelector(".icon");

let personagens;
let nomesPersonagens;
let personagemAleatorio;
let jogoTerminado = false;
let personagensTentados = [];

fetch('https://potterhead-api.vercel.app/api/characters')
    .then(response => response.json())
    .then(data => {
        personagens = data.filter(character => character.actor != '');
        nomesPersonagens = personagens.map(character => character.name.toLowerCase()); // Pre-process names for case-insensitive matching

        // Chama a função para selecionar um personagem aleatório ao carregar a página
        selectRandomCharacter();
    })
    .catch(error => {
        console.log('Error fetching data:', error);
    });

inputBox.onkeyup = (e) => {
    if (jogoTerminado) return;

    let userData = e.target.value; // user entered data
    let emptyArray = [];

    if (e.key === 'Enter') {
        if (userData) {
            // Verifica se o personagem já foi tentado
            if (personagensTentados.includes(userData.toLowerCase())) {
                return;
            }

            // Buscar o personagem correspondente
            let personagemSelecionado = personagens.find(character => character.name.toLowerCase() === userData.toLowerCase());
            if (personagemSelecionado) {
                // Adiciona o personagem à lista de tentativas
                personagensTentados.push(userData.toLowerCase());

                // Comparar os detalhes do personagem com o aleatório
                compareDetails(personagemSelecionado);
            } else {
                alert("Personagem não encontrado! Tente novamente.");
            }
        }
    }

    if (userData) {
        emptyArray = nomesPersonagens.filter((data) => {
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });
        emptyArray = emptyArray.map((data) => {
            return data = `<li>${data}</li>`;
        });
        searchWrapper.classList.add("active"); // show autocomplete box
        showSuggestions(emptyArray);
        let allList = sugestBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            allList[i].setAttribute("onclick", "select(this)");
        }

        if (e.key === 'Escape') {
            searchWrapper.classList.remove("active");
        }
    } else {
        searchWrapper.classList.remove("active"); // hide autocomplete box
    }
}

function select(element) {
    let selectData = element.textContent;
    inputBox.value = selectData;

    // Encontre o personagem correspondente ao nome selecionado
    let personagemSelecionado = personagens.find(character => character.name.toLowerCase() === selectData.toLowerCase());

    searchWrapper.classList.remove("active");
}

// Função para comparar os detalhes do personagem com o aleatório
function compareDetails(personagem) {
    const detalheContainer = document.querySelector(".historico-personagens");

    // Cria um contêiner para cada personagem comparado
    const comparacaoContainer = document.createElement("div");
    comparacaoContainer.classList.add("comparacao-personagem");

    // Detalhes do personagem aleatório
    const detalhesAleatorios = personagemAleatorio;

    // Detalhes do personagem digitado
    const detalhesDigitado = personagem;

    // Função para comparar os detalhes
    const detalhes = [
        { label: 'Nome', aleatorio: detalhesAleatorios.name, digitado: detalhesDigitado.name }, //Foto depois
        { label: 'Casa', aleatorio: detalhesAleatorios.house, digitado: detalhesDigitado.house },
        { label: 'Espécie', aleatorio: detalhesAleatorios.species, digitado: detalhesDigitado.species },
        { label: 'Gênero', aleatorio: detalhesAleatorios.gender, digitado: detalhesDigitado.gender },
        { label: 'Tipo', aleatorio: detalhesAleatorios.ancestry, digitado: detalhesDigitado.ancestry },
        { label: 'Cabelo', aleatorio: detalhesAleatorios.hairColour, digitado: detalhesDigitado.hairColour }
    ];

    let todosAcertos = true;

    // Cria o conteúdo da comparação
    detalhes.forEach(detalhe => {
        const cor = detalhe.aleatorio === detalhe.digitado ? 'green' : 'red';

        if (detalhe.aleatorio !== detalhe.digitado) {
            todosAcertos = false;
        }

        comparacaoContainer.innerHTML += `
            <div class="detalhe-item">
                <strong>${detalhe.label}:</strong> 
                <span class="detalhe-comparado" style="border: 2px solid ${cor}; padding: 5px; border-radius: 5px; background-color: ${cor}; width: 100%; height: 100%; text-align: center">
                    ${detalhe.digitado}
                </span>
            </div>
        `;
    });

    // Adiciona o contêiner do personagem comparado ao histórico
    detalheContainer.prepend(comparacaoContainer);

    if (todosAcertos) {
        // Exibe uma mensagem de vitória
        const mensagemVitoria = document.createElement("div");
        mensagemVitoria.classList.add("mensagem-vitoria");
        mensagemVitoria.innerText = "🎉 Parabéns! Você acertou o personagem do dia!";
        detalheContainer.prepend(mensagemVitoria);
        jogoTerminado = true;

        inputBox.disabled = true;
    }

}

// Função para selecionar um personagem aleatório baseado no dia
function selectRandomCharacter() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000); // Calcula o dia do ano

    const randomIndex = dayOfYear % personagens.length;

    personagemAleatorio = personagens[randomIndex];
    console.log("Personagem aleatório do dia: ", personagemAleatorio.name);
}

function showSuggestions(list) {
    let listData;
    if (!list.length) {
        userValue = inputBox.value;
        listData = `<li>${userValue}</li>`;
    } else {
        listData = list.join('');
    }
    sugestBox.innerHTML = listData;
}
