const searchWrapper = document.querySelector(".search");
const inputBox = searchWrapper.querySelector("input");
const sugestBox = searchWrapper.querySelector(".list");

let personagem;
let nomePersonagem;
let personagemAleatorio;
let jogoTerminado = false;
let personagensTentados = [];

fetch('https://potterhead-api.vercel.app/api/characters')
    .then(response => response.json())
    .then(data => {
        personagem = data.filter(character => character.image != '');
        nomePersonagem = personagem.map(character => character.name.toLowerCase());
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
            let personagemSelecionado = personagem.find(character => character.name.toLowerCase() === userData.toLowerCase());
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
        emptyArray = nomePersonagem.filter((data) => {
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
    let personagemSelecionado = personagem.find(character => character.name.toLowerCase() === selectData.toLowerCase());

    searchWrapper.classList.remove("active");
}

// Função para comparar os detalhes do personagem com o aleatório
function compareDetails(personagem) {
    const detalheContainer = document.querySelector(".historico-personagens");

    // Cria um contêiner para cada personagem comparado
    const comparacaoContainer = document.createElement("div");
    comparacaoContainer.classList.add("comparacao-personagem");

    // Detalhes do personagem digitado
    const detalhesDigitado = traduzirPersonagem(personagem);

    // Função para criar o conteúdo de detalhes
    const detalhes = [
        { label: 'Personagem', valorDigitado: detalhesDigitado.image, valorAleatorio: personagemAleatorio.image, isImage: true },
        { label: 'Casa', valorDigitado: detalhesDigitado.house, valorAleatorio: personagemAleatorio.house },
        { label: 'Espécie', valorDigitado: detalhesDigitado.species, valorAleatorio: personagemAleatorio.species },
        { label: 'Gênero', valorDigitado: detalhesDigitado.gender, valorAleatorio: personagemAleatorio.gender },
        { label: 'Tipo', valorDigitado: detalhesDigitado.ancestry, valorAleatorio: personagemAleatorio.ancestry },
        { label: 'Cabelo', valorDigitado: detalhesDigitado.hairColour, valorAleatorio: personagemAleatorio.hairColour }
    ];

    let todosAcertos = true;

    // Cria o conteúdo da comparação
    detalhes.forEach(detalhe => {
        const valorDigitado = detalhe.valorDigitado || "DESCONHECIDO"; // Substitui valores vazios por "DESCONHECIDO"
        const valorAleatorio = detalhe.valorAleatorio || "DESCONHECIDO"; // Substitui valores vazios por "DESCONHECIDO"

        // Verifica se o valor digitado é igual ao aleatório
        const cor = valorDigitado === valorAleatorio ? 'green' : 'red';
        if (valorDigitado !== valorAleatorio) {
            todosAcertos = false;
        }

        // Renderiza detalhes normais ou imagens
        let conteudoDetalhe;
        if (detalhe.isImage) {
            conteudoDetalhe = `
                <img src="${valorDigitado !== "Desconhecido" ? valorDigitado : ''}"
                    style="width: 90px; height: 90px; border: 2px solid ${cor}; border-radius: 5px; background-color: #f0f0f0;">
                ${valorDigitado === "Desconhecido" ? `<div style="text-align: center;">${valorDigitado}</div>` : ''}
            `;
        } else {
            conteudoDetalhe = `
                <span class="detalhe-comparado" style="border: 2px solid ${cor}; padding: 5px; border-radius: 5px; 
                        background-color: ${cor}; text-align: center; width: 120px; display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${valorDigitado}
                </span>
            `;
        }

        comparacaoContainer.innerHTML += `
            <div class="detalhe-item" style="display: flex; gap: 10px; align-items: center;">
                <strong>${detalhe.label}:</strong> 
                ${conteudoDetalhe}
            </div>
        `;
    });

    // Adiciona o contêiner do personagem comparado ao histórico
    detalheContainer.prepend(comparacaoContainer); // Adiciona no início do histórico

    // Verifica se todos os detalhes estão corretos
    if (todosAcertos) {
        const mensagemVitoria = document.createElement("div");
        mensagemVitoria.classList.add("mensagem-vitoria");
        mensagemVitoria.innerText = "🎉 Parabéns! Você adivinhou o personagem do dia!";
        detalheContainer.prepend(mensagemVitoria);
        jogoTerminado = true;
        inputBox.disabled = true;
    }
}

const dicionario = {
    "Gryffindor": "Grifinória",
    "Hufflepuff": "Lufa-Lufa",
    "Ravenclaw": "Corvinal",
    "Slytherin": "Sonserina",
    "human": "Humano",
    "half-blood": "Mestiço",
    "pure-blood": "Bruxo",
    "male": "Masculino",
    "female": "Feminino",
    "black": "Preto",
    "blonde": "Loiro",
    "brown": "Marrom",
    "unknown": "Desconhecido",
    "red": "Vermelho",
    "muggleborn": "Nascido Trouxa",
    "muggle": "Trouxa",
    "siver": "Prateado",
    "blond": "Loiro",
    "squib": "Aborto"
};

function traduzirPersonagem(personagem) {
    const traduzido = {};
    for (const chave in personagem) {
        const valor = personagem[chave];
        if (typeof valor === "string") {
            traduzido[chave] = dicionario[valor] || valor; // Traduz, se houver no dicionário
        } else {
            traduzido[chave] = valor;
        }
    }
    return traduzido;
}


// Função para selecionar um personagem aleatório baseado no dia
function selectRandomCharacter() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000); // Calcula o dia do ano

    const randomIndex = dayOfYear % personagem.length;

    personagemAleatorio = traduzirPersonagem(personagem[randomIndex]);
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
