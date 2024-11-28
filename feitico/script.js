const searchWrapper = document.querySelector(".search");
const inputBox = searchWrapper.querySelector("input");
const sugestBox = searchWrapper.querySelector(".list");

let feitiços = [];
let nomeFeitiços = [];
let feitiçoAleatorio;
let jogoTerminado = false;
let feitiçosTentados = [];

// Fetch dos feitiços
fetch('https://potterapi-fedeperin.vercel.app/pt/spells')
    .then(response => response.json())
    .then(data => {
        feitiços = data.map(f => ({
            nome: f.spell,
            descricao: f.use
        }));
        nomeFeitiços = feitiços.map(f => f.nome.toLowerCase());
        selectRandomSpell();
    })
    .catch(error => {
        console.log('Erro ao buscar feitiços:', error);
    });

// Função para lidar com entrada do usuário
inputBox.onkeyup = (e) => {
    if (jogoTerminado) return; // Se o jogo terminou, ignora o evento

    let userData = e.target.value; // Dados digitados pelo usuário
    let emptyArray = [];

    if (e.key === 'Enter') {
        if (userData) {
            // Verifica se o feitiço já foi tentado
            if (feitiçosTentados.includes(userData.toLowerCase())) {
                return;
            }

            // Busca o feitiço correspondente
            let feitiçoSelecionado = feitiços.find(f => f.nome.toLowerCase() === userData.toLowerCase());
            if (feitiçoSelecionado) {
                feitiçosTentados.push(userData.toLowerCase()); // Adiciona o feitiço à lista de tentativas
                inputBox.value = ''; // Limpa o campo de entrada
                compareSpell(feitiçoSelecionado); // Compara o feitiço
            } else {
                alert("Feitiço não encontrado! Tente novamente.");
            }
        }
    }

    if (userData) {
        emptyArray = nomeFeitiços
            .filter(data => {
                // Filtra apenas feitiços válidos contendo o texto digitado e que não foram tentados
                return data.includes(userData.toLowerCase()) && !feitiçosTentados.includes(data);
            })
            .map(data => {
                return `<li>${data}</li>`;
            });

        if (emptyArray.length > 0) {
            searchWrapper.classList.add("active"); // Mostra a caixa de sugestões
            showSuggestions(emptyArray);
        } else {
            searchWrapper.classList.remove("active"); // Esconde a caixa se não houver sugestões
        }

        let allList = sugestBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            allList[i].setAttribute("onclick", "select(this)");
        }

        if (e.key === 'Escape') {
            searchWrapper.classList.remove("active");
        }
    } else {
        searchWrapper.classList.remove("active"); // Esconde a caixa de sugestões
    }
};



// Seleciona um feitiço ao clicar em uma sugestão
function select(element) {
    let selectData = element.textContent;
    inputBox.value = selectData;

    searchWrapper.classList.remove("active");
}

// Função para comparar o feitiço digitado com o feitiço aleatório
function compareSpell(feitiço) {
    const detalheContainer = document.querySelector(".historico");

    // Cria um contêiner para a tentativa
    const tentativaContainer = document.createElement("div");
    tentativaContainer.classList.add("tentativa-feitiço");

    // Verifica se o feitiço está correto
    const cor = feitiço.nome.toLowerCase() === feitiçoAleatorio.nome.toLowerCase() ? 'green' : 'red';

    tentativaContainer.innerHTML = `
    <div style="color: ${cor}; font-weight: bold; background-color: white; padding: 10px; margin-bottom: 10px; min-width: 200px; display: inline-block;">
        ${feitiço.nome}
    </div>
    `;


    detalheContainer.prepend(tentativaContainer); // Adiciona ao histórico

    if (feitiço.nome.toLowerCase() === feitiçoAleatorio.nome.toLowerCase()) {
        displayWinMessage(); // Exibe mensagem de vitória
        jogoTerminado = true; // Marca o jogo como terminado
        inputBox.disabled = true; // Desativa o campo de entrada
        inputBox.value = ''; // Limpa o campo de entrada
        searchWrapper.classList.remove("active"); // Esconde sugestões
    }
}

function startConfetti() {
    const efeitoPurpurina = document.querySelector(".efeito-purpurina");

    for (let i = 0; i < 50; i++) {
        const emoji = document.createElement("div");
        emoji.classList.add("emoji");
        emoji.textContent = "🎉"; // Emoji de festa

        // Define posição e velocidade aleatórias
        emoji.style.left = Math.random() * 100 + "vw";
        emoji.style.animationDelay = Math.random() * 2 + "s";
        emoji.style.animationDuration = 3 + Math.random() * 2 + "s";

        efeitoPurpurina.appendChild(emoji);

        // Remove o emoji após a animação
        setTimeout(() => {
            emoji.remove();
        }, 5000);
    }
}

// Chama o confetti ao exibir a mensagem de vitória
function displayWinMessage() {
    const detalheContainer = document.querySelector(".historico");
    const mensagemVitoria = document.createElement("div");
    mensagemVitoria.classList.add("mensagem-vitoria");
    mensagemVitoria.innerText = "🎉 Parabéns! Você acertou o feitiço do dia!";
    detalheContainer.prepend(mensagemVitoria);

    startConfetti(); // Inicia o efeito de purpurina
}



// Seleciona o feitiço aleatório do dia
function selectRandomSpell() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000); // Calcula o dia do ano

    const randomIndex = dayOfYear % feitiços.length;

    feitiçoAleatorio = feitiços[randomIndex];
    console.log("Feitiço aleatório do dia: ", feitiçoAleatorio.nome);

    // Exibe a descrição do feitiço aleatório na interface
    const randomSpellDescription = document.querySelector(".feitico-aleatorio");
    randomSpellDescription.innerHTML = `
        "${feitiçoAleatorio.descricao || "Descrição indisponível"}"
    `;
}

// Mostra sugestões na lista
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
