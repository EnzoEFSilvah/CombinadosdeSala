// CONFIGURAÇÕES INICIAIS
const XP_PARA_LEVEL_UP = 100;

// COMBINADOS(Regras) - Editável e salvo no localStorage
let COMBINADOS = JSON.parse(localStorage.getItem("combinados")) || [
    {id:1, texto: "Fez a tarefa de casa", xp: 20, tipo: "bom"},
    {id:2, texto: "Ajudou um colega", xp: 10, tipo: "bom"},
    {id:3, texto: "Jogar o lixo na lixeira", xp: 10, tipo: "bom"},
    {id:4, texto: "Andar em Fila", xp: 10, tipo: "bom"},
    {id:5, texto: "Ser Educado", xp: 10, tipo: "bom"},
    {id:6, texto: "Conversa fora de hora", xp: 10, tipo: "ruim"},
    {id:7, texto: "Não fez a tarefa de casa", xp: 20, tipo: "ruim"},
    {id:8, texto: "Brigou um colega", xp: 10, tipo: "ruim"},
    {id:9, texto: "Saiu sem pedir", xp: 15, tipo: "ruim"},
    {id:10, texto: "Não trouxe o Material", xp: 20, tipo: "ruim"},
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
    {id:19, nome: "Victor", xp: 0, level: 1, genero:"M"},
    {id:20, nome: "Vitorya", xp: 0, level: 1, genero:"F"},
    {id:21, nome: "Weiny", xp: 0, level: 1, genero:"F"},
    {id:22, nome: "Yohanna", xp: 0, level: 1, genero:"F"},
];

let alunoSelecionado = null;

// FUNÇÕES PRINCIPAIS

function salvarDados() {
    localStorage.setItem("alunos", JSON.stringify(alunos));
    localStorage.setItem("combinados", JSON.stringify(COMBINADOS));
    renderizarAlunos();
    renderizarRanking();
    renderizarCombinados();
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
            avatarUrl = "./img/feminino.jpg";
        } else {
            // Imagem padrão para meninos
            avatarUrl = "./img/masculino.jpg";
        }

        const card = document.createElement("div");
        card.className = "card-aluno";

        card.innerHTML = `
        <div class="level-badge">Nivel ${aluno.level}</div>
        <div class="avatar-container">
            <img src="${avatarUrl}" alt="${aluno.nome}" class="avatar" onclick="abrirModal(${aluno.id})">
            <div class="avatar-buttons">
                <button class="btn-edit" onclick="editarAluno(${aluno.id})" title="Editar">✏️</button>
                <button class="btn-delete" onclick="deletarAluno(${aluno.id})" title="Deletar">🗑️</button>
            </div>
        </div>
        <div class="nome">${aluno.nome}</div>
        <div class="xp-container">
            <div class="xp-bar" style="width: ${porcentagem}%;"></div>
        </div>
        <div class="xp-text">${aluno.xp} / ${XP_PARA_LEVEL_UP} XP</div>
        `;

        grind.appendChild(card);
    });
}

function renderizarRanking() {
    const rankingList = document.getElementById("rankingList");
    rankingList.innerHTML = "";

    // Filtra apenas alunos com XP > 0, ordena por XP + (level * XP_PARA_LEVEL_UP) e pega os 5 primeiros
    const top5 = [...alunos]
        .filter(a => a.xp > 0)
        .sort((a, b) => {
            const xpTotalA = a.xp + (a.level * XP_PARA_LEVEL_UP);
            const xpTotalB = b.xp + (b.level * XP_PARA_LEVEL_UP);
            return xpTotalB - xpTotalA;
        })
        .slice(0, 5);

    top5.forEach((aluno, index) => {
        const xpTotal = aluno.xp + (aluno.level * XP_PARA_LEVEL_UP);
        const posicao = index + 1;
        let medalha = '';
        let classe = '';

        if (posicao === 1) {
            medalha = '🥇';
            classe = 'primeiro';
        } else if (posicao === 2) {
            medalha = '🥈';
            classe = 'segundo';
        } else if (posicao === 3) {
            medalha = '🥉';
            classe = 'terceiro';
        } else {
            medalha = `#${posicao}`;
        }

        const item = document.createElement("div");
        item.className = `ranking-item ${classe}`;
        item.innerHTML = `
            <span class="ranking-posicao">${medalha}</span>
            <span class="ranking-nome">${aluno.nome}</span>
            <span class="ranking-xp">Lv.${aluno.level} +${aluno.xp}XP</span>
        `;
        rankingList.appendChild(item);
    });
}

function renderizarCombinados() {
    const combinadosList = document.getElementById("combinadosList");
    combinadosList.innerHTML = "";

    COMBINADOS.forEach(comb => {
        const item = document.createElement("div");
        item.className = `combinado-item ${comb.tipo}`;
        
        const sinal = comb.tipo === "bom" ? '+' : '-';
        
        item.innerHTML = `
            <span class="combinado-texto">${comb.texto}</span>
            <span class="combinado-xp ${comb.tipo}">${sinal}${comb.xp} XP</span>
        `;
        combinadosList.appendChild(item);
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
        const sinal = comb.tipo === "bom" ? '+' : '-';
        const xpValue = comb.tipo === "bom" ? comb.xp : -comb.xp;

        btn.className = `btn-action ${classeTipo}`;
        btn.innerHTML = `<span>${comb.texto}</span>
        <span>${sinal}${comb.xp} XP</span>`;
        btn.onclick = () => aplicarAcao(xpValue);

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
    // Mantido para compatibilidade; abre o formulário
    abrirFormAluno();
}

function resetarTudo(){
    if(confirm("Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.")) {
        localStorage.removeItem("alunos");
        localStorage.removeItem("combinados");
        location.reload();
    }
}

// Funções de Editar e Deletar Aluno
function editarAluno(id) {
    const aluno = alunos.find(a => a.id === id);
    if (!aluno) return;
    
    document.getElementById('modalAluno').style.dataset_edit_id = id;
    document.getElementById('inputNomeAluno').value = aluno.nome;
    document.getElementById('inputXPAluno').value = aluno.xp;
    document.getElementById('inputLevelAluno').value = aluno.level;
    document.getElementById('inputGeneroAluno').value = aluno.genero;
    
    // Muda o título e o comportamento do botão salvar
    const modal = document.getElementById('modalAluno');
    modal.dataset.editId = id;
    modal.querySelector('.modal-title').innerText = 'Editar Aluno';
    
    document.getElementById('modalAluno').style.display = 'flex';
}

function deletarAluno(id) {
    const aluno = alunos.find(a => a.id === id);
    if (!aluno) return;
    
    if (confirm(`Tem certeza que deseja deletar ${aluno.nome}? Esta ação não pode ser desfeita.`)) {
        alunos = alunos.filter(a => a.id !== id);
        salvarDados();
    }
}

// Funções do formulário de Aluno
function abrirFormAluno() {
    document.getElementById('inputNomeAluno').value = '';
    document.getElementById('inputXPAluno').value = 0;
    document.getElementById('inputLevelAluno').value = 1;
    document.getElementById('inputGeneroAluno').value = 'M';
    
    // Reseta o modo editar
    const modal = document.getElementById('modalAluno');
    modal.dataset.editId = '';
    modal.querySelector('.modal-title').innerText = 'Trazer Aluno';
    
    document.getElementById('modalAluno').style.display = 'flex';
}

function fecharModalAluno() {
    document.getElementById('modalAluno').style.display = 'none';
}

function salvarAlunoFromForm() {
    const nome = document.getElementById('inputNomeAluno').value.trim();
    const xp = parseInt(document.getElementById('inputXPAluno').value, 10) || 0;
    const level = parseInt(document.getElementById('inputLevelAluno').value, 10) || 1;
    const genero = document.getElementById('inputGeneroAluno').value || 'M';

    if (!nome) { alert('Nome é obrigatório.'); return; }

    const modal = document.getElementById('modalAluno');
    const editId = modal.dataset.editId;
    
    if (editId) {
        // Modo editar - atualizar aluno existente
        const index = alunos.findIndex(a => a.id === parseInt(editId, 10));
        if (index !== -1) {
            alunos[index] = {id: alunos[index].id, nome: nome, xp: xp, level: level, genero: genero};
        }
    } else {
        // Modo adicionar - novo aluno
        const novoId = Date.now();
        alunos.push({id: novoId, nome: nome, xp: xp, level: level, genero: genero});
    }
    
    salvarDados();
    fecharModalAluno();
}

// Funções do formulário de Combinado
function abrirFormCombinado() {
    document.getElementById('inputTextoCombinado').value = '';
    document.getElementById('inputXPCombinado').value = 10;
    document.getElementById('inputTipoCombinado').value = 'bom';
    document.getElementById('modalCombinado').style.display = 'flex';
}

function fecharModalCombinado() {
    document.getElementById('modalCombinado').style.display = 'none';
}

function salvarCombinadoFromForm() {
    const texto = document.getElementById('inputTextoCombinado').value.trim();
    const xp = parseInt(document.getElementById('inputXPCombinado').value, 10) || 0;
    const tipo = document.getElementById('inputTipoCombinado').value || 'bom';

    if (!texto) { alert('Texto é obrigatório.'); return; }

    const novoId = Date.now();
    COMBINADOS.push({id: novoId, texto: texto, xp: xp, tipo: tipo});
    salvarDados();
    fecharModalCombinado();
}

// INICIALIZAÇÃO
renderizarAlunos();
renderizarRanking();
renderizarCombinados();
