// Seleciona o modal
const modal = document.getElementById("modal");
// Seleciona o botão que abre o modal
const openBtn = document.getElementById("openBtn");
// Seleciona o botão de fechar
const closeBtn = document.getElementById("closeBtn");

// Quando o usuário clica no botão, abre o modal
openBtn.onclick = function() {
    modal.style.display = "block";
}

// Quando o usuário clica no botão de fechar, fecha o modal
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Quando o usuário clica fora do modal, também fecha
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

modal.style.display = "block";