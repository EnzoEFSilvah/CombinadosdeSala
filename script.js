// CONFIGURAÇÕES INICIAIS
const XP_PARA_LEVEL_UP = 100;

// COMBINADOS(Regras) - Edite aqui os valores e descrições dos combinados
const COMBINADOS = [
    {id:1, texto: "Fez a tarefa de casa", xp: 20, tipo: "bom"},
    {id:2, texto: "Ajudou um colega", xp: 15, tipo: "bom"},
    {id:3, texto: "Participou da aula", xp: 25, tipo: "bom"},
    {id:4, texto: "Respeitou as regras da sala", xp: 10, tipo: "bom"},
    {id:5, texto: "Conversa fora de hora", xp: 30, tipo: "ruim"},
    {id:6, texto: "Não fez a tarefa de casa", xp: 20, tipo: "ruim"},
    {id:7, texto: "Brigou um colega", xp: 25, tipo: "ruim"},
    {id:8, texto: "Saiu sem pedir", xp: 15, tipo: "ruim"},
    {id:9, texto: "Não trouxe o Material", xp: 30, tipo: "ruim"},
];

// Estado da Aplicação
let alunos = JSON.parse(localStorage.getItem("alunos")) || [
    {id:1, nome: "Alice", xp: 0, level: 1, genero:"F"},
    {id:2, nome: "Alexsandro", xp: 0, level: 1, genero:"M"},
    {id:3, nome: "Ana Clara", xp: 0, level: 1, genero:"F"},
    {id:4, nome: "Arthur", xp: 0, level: 1, genero:"M"},
    {id:5, nome: "Carlito", xp: 0, level: 1, genero:"M"},
    {id:6, nome: "Dominic", xp: 0, level: 1, genero:"M"},
    {id:7, nome: "Edson", xp: 0, level: 1, genero:"M"},
    {id:8, nome: "Estevan", xp: 0, level: 1, genero:"M"},
    {id:9, nome: "Gregory", xp: 0, level: 1, genero:"M"},
    {id:10, nome: "Kimberly", xp: 0, level: 1, genero:"F"},
    {id:11, nome: "Lays", xp: 0, level: 1, genero:"F"},
    {id:12, nome: "Layslla", xp: 0, level: 1, genero:"F"},
    {id:13, nome: "Luis", xp: 0, level: 1, genero:"M"},
    {id:14, nome: "Matheus", xp: 0, level: 1, genero:"M"},
    {id:15, nome: "Murillo", xp: 0, level: 1, genero:"M"},
    {id:16, nome: "Ryan", xp: 0, level: 1, genero:"M"},
    {id:17, nome: "Sophia", xp: 0, level: 1, genero:"F"},
    {id:18, nome: "Valentina", xp: 0, level: 1, genero:"F"},
    {id:19, nome: "Vitorya", xp: 0, level: 1, genero:"F"},
    {id:20, nome: "Weiny", xp: 0, level: 1, genero:"F"},
    {id:21, nome: "Yohanna", xp: 0, level: 1, genero:"F"},
];

let alunoSelecionado = null;

// FUNÇÕES PRINCIPAIS

function salvarDados() {
    localStorage.setItem("alunos", JSON.stringify(alunos));
    renderizarAlunos();
}

function renderizarAlunos() {
    const grind = document.getElementById("gridAlunos");
    grind.innerHTML = "";

    alunos.forEach(aluno => {
        // Calculo da % da barra de progresso
        const porcentagem = (aluno.xp / XP_PARA_LEVEL_UP) * 100;

        // AVATAR PADRÃO POR GÊNERO
        let avatarUrl;
        if (aluno.genero === 'F') {
            // Imagem padrão para meninas
            avatarUrl = "feminino.jpg";
        } else {
            // Imagem padrão para meninos
            avatarUrl = "masculino.jpg";
        }

        const card = document.createElement("div");
        card.className = "card-aluno";
        card.onclick = () => abrirModal(aluno.id);

        card.innerHTML = `
        <div class="level-badge">Nivel ${aluno.level}</div>
        <img src="${avatarUrl}" alt="${aluno.nome}" class="avatar">
        <div class="nome">${aluno.nome}</div>
        <div class="xp-container">
            <div class="xp-bar" style="width: ${porcentagem}%;"></div>
        </div>
        <div class="xp-text">${aluno.xp} / ${XP_PARA_LEVEL_UP} XP</div>
        `;

        grind.appendChild(card);
    });
}

function abrirModal(id) {
    alunoSelecionado = id;
    const aluno = alunos.find(a => a.id === id);

    document.getElementById("modalNomeAluno").innerText = `Ação para: ${aluno.nome}`;

    const lista = document.getElementById("listaCombinados");
    lista.innerHTML = "";

    COMBINADOS.forEach(comb => {
        const btn = document.createElement("button");
        const classeTipo = comb.tipo === "bom" ? 'btn-positive' : 'btn-negative';
        const sinal = comb.xp > 0 ? '+': '';

        btn.className = `btn-action ${classeTipo}`;
        btn.innerHTML = `<span>${comb.texto}</span>
        <span>${sinal}${comb.xp} XP</span>`;
        btn.onclick = () => aplicarAcao(comb.xp);

        lista.appendChild(btn);
    });

    document.getElementById('modalAcoes').style.display = 'flex';

}

function fecharModal() {
    document.getElementById('modalAcoes').style.display = 'none';
    alunoSelecionado = null;
}

function aplicarAcao(valor) {
    const index = alunos.findIndex(a => a.id === alunoSelecionado);
    if (index !== -1) {
        let aluno = alunos[index];
        aluno.xp += valor;

        // Lógica de Level Up
        if(aluno.xp >= XP_PARA_LEVEL_UP) {
            aluno.xp = aluno.xp - XP_PARA_LEVEL_UP;
            aluno.level += 1;
            alert(`🎉 LEVEL UP! ${aluno.nome} subiu para o nível ${aluno.level}!`);
        }

        // Lógica para não deixar XP negativo
        if(aluno.xp < 0) {
            aluno.xp = 0;
        }

        salvarDados();
        fecharModal();
    }
} 


function adicionarAluno() {
    const nome = prompt("Nome do novo aluno:");
    if(!nome) return;

    // Pergunta simples para o gênero do aluno
    const generoInput = prompt("É menino ou menina? (Digite M ou F").toLocaleUpperCase(); 

    // Validação simples (se digitar errado, vai como M padrão)
    const genero = (generoInput === 'F') ? 'F' : 'M';


    if (nome) {
        const novoId = Date.now(); // ID único simples
        alunos.push({id: novoId, nome: nome, xp: 0, level: 1, genero: genero});
        salvarDados();

    }
}

function resetarTudo(){
    if(confirm("Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.")) {
        localStorage.removeItem("alunos");
        location.reload();
    }
}

// INICIALIZAÇÃO
renderizarAlunos();
