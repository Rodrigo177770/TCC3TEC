// =========================================================================
// COLOQUE AQUI O CAMINHO DAS SUAS IMAGENS PNG (8 imagens = 8 pares)
// =========================================================================
const imagensCartas = [
    '../images/peca1.png',
    '../images/peca2.png',
    '../images/peca3.png',
    '../images/peca4.png',
    '../images/peca5.png',
    '../images/peca6.png',
    '../images/peca7.png',
    '../images/peca8.png'
];

const tabuleiro = document.getElementById('tabuleiro');
const displayTempo = document.getElementById('tempo');
const modalFim = document.getElementById('modal-fim');
const mensagemTitulo = document.getElementById('mensagem-titulo');
const mensagemTexto = document.getElementById('mensagem-texto');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnJogarNovamente = document.getElementById('btn-jogar-novamente');

const CHAVE_BLOQUEIO = 'jogoMemoria_bloqueioAte';
const TEMPO_BLOQUEIO_MS = 1; // 2 horas em milissegundos

let primeiraCarta = null;
let segundaCarta = null;
let bloqueioTabuleiro = false;
let paresEncontrados = 0;
let tempoRestante = 60; // 60 segundos = 1 minuto
let intervaloTempo = null;
let jogoIniciado = false;

// Verifica se o jogador está bloqueado antes de iniciar
function verificarBloqueio() {
    const bloqueadoAte = localStorage.getItem(CHAVE_BLOQUEIO);
    if (!bloqueadoAte) return false;

    const agora = Date.now();
    const tempoFaltante = parseInt(bloqueadoAte, 10) - agora;

    if (tempoFaltante > 0) {
        aplicarTelaBloqueio(tempoFaltante);
        return true;
    } else {
        // O tempo de 2 horas já passou, libera o jogo
        localStorage.removeItem(CHAVE_BLOQUEIO);
        btnReiniciar.disabled = false;
        btnReiniciar.style.opacity = '1';
        btnReiniciar.style.cursor = 'pointer';
        return false;
    }
}

// Trava o jogo e exibe a mensagem de espera de 2 horas
function aplicarTelaBloqueio(tempoFaltanteMs) {
    bloqueioTabuleiro = false;
    clearInterval(intervaloTempo);

    // Desativa o botão reiniciar do cabeçalho para não burlar o bloqueio
    btnReiniciar.disabled = false;
    btnReiniciar.style.opacity = '0.4';
    btnReiniciar.style.cursor = 'not-allowed';

    const minutosRestantes = Math.ceil(tempoFaltanteMs / (1000 * 60));
    const horas = Math.floor(minutosRestantes / 60);
    const minutos = minutosRestantes % 60;

    let textoEspera = '';
    if (horas > 0) {
        textoEspera = `${horas}h e ${minutos}min`;
    } else {
        textoEspera = `${minutos} minuto(s)`;
    }

    mensagemTitulo.textContent = "Não foi dessa vez";
    mensagemTexto.textContent = `O tempo de 1 minuto acabou. Você poderá jogar novamente em ${textoEspera}.`;
    
    btnJogarNovamente.textContent = "Não foi dessa vez";
    btnJogarNovamente.disabled = true;
    btnJogarNovamente.style.backgroundColor = "#555555";
    btnJogarNovamente.style.cursor = "not-allowed";
    btnJogarNovamente.onclick = null;

    modalFim.classList.remove('oculto');
}

function iniciarJogo() {
    // Se estiver no período de 2 horas de castigo, não deixa iniciar
    if (verificarBloqueio()) return;

    // Reseta variáveis
    tabuleiro.innerHTML = '';
    primeiraCarta = null;
    segundaCarta = null;
    bloqueioTabuleiro = false;
    paresEncontrados = 0;
    tempoRestante = 60;
    jogoIniciado = false;
    
    clearInterval(intervaloTempo);
    atualizarDisplayTempo();
    modalFim.classList.add('oculto');

    // Duplica as imagens para formar os pares e embaralha
    const baralho = [...imagensCartas, ...imagensCartas];
    baralho.sort(() => Math.random() - 0.5);

    // Cria as cartas no HTML
    baralho.forEach((caminhoImagem) => {
        const carta = document.createElement('div');
        carta.classList.add('carta');
        carta.dataset.imagem = caminhoImagem;

        carta.innerHTML = `
            <div class="face frente">
                <img src="${caminhoImagem}" alt="Peça do jogo">
            </div>
            <div class="face verso"></div>
        `;

        carta.addEventListener('click', virarCarta);
        tabuleiro.appendChild(carta);
    });
}

function iniciarCronometro() {
    jogoIniciado = true;
    intervaloTempo = setInterval(() => {
        tempoRestante--;
        atualizarDisplayTempo();

        if (tempoRestante <= 0) {
            clearInterval(intervaloTempo);
            finalizarJogo(false); // Tempo esgotado -> Derrota
        }
    }, 1000);
}

function atualizarDisplayTempo() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    displayTempo.textContent = 
        `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

function virarCarta() {
    if (bloqueioTabuleiro) return;
    if (this === primeiraCarta) return;

    // Inicia o cronômetro no primeiro clique
    if (!jogoIniciado) {
        iniciarCronometro();
    }

    this.classList.add('virada');

    if (!primeiraCarta) {
        primeiraCarta = this;
        return;
    }

    segundaCarta = this;
    verificarPar();
}

function verificarPar() {
    const ehPar = primeiraCarta.dataset.imagem === segundaCarta.dataset.imagem;

    if (ehPar) {
        desativarCartas();
        paresEncontrados++;

        // Verifica se todos os pares foram encontrados
        if (paresEncontrados === imagensCartas.length) {
            clearInterval(intervaloTempo);
            setTimeout(() => finalizarJogo(true), 400); // Vitória
        }
    } else {
        desvirarCartas();
    }
}

function desativarCartas() {
    primeiraCarta.removeEventListener('click', virarCarta);
    segundaCarta.removeEventListener('click', virarCarta);
    resetarJogada();
}

function desvirarCartas() {
    bloqueioTabuleiro = true;
    setTimeout(() => {
        primeiraCarta.classList.remove('virada');
        segundaCarta.classList.remove('virada');
        resetarJogada();
    }, 900);
}

function resetarJogada() {
    [primeiraCarta, segundaCarta] = [null, null];
    bloqueioTabuleiro = false;
}

function finalizarJogo(venceu) {
    bloqueioTabuleiro = true;

    if (venceu) {
        mensagemTitulo.textContent = "Parabéns!";
        mensagemTexto.textContent = `Você completou o jogo da memória faltando ${tempoRestante} segundos, e ganhou 15% de desconto em serviços!`;
        
        // Configura o botão para Resgatar e ir para index.html
        btnJogarNovamente.textContent = "Resgatar";
        btnJogarNovamente.disabled = false;
        btnJogarNovamente.style.backgroundColor = "#e60000";
        btnJogarNovamente.style.cursor = "pointer";
        btnJogarNovamente.onclick = () => {
            window.location.href = '../index.html';
        };

        modalFim.classList.remove('oculto');
    } else {
        // Salva o bloqueio de 2 horas no navegador e trava o jogo
        const desbloqueioEm = Date.now() + TEMPO_BLOQUEIO_MS;
        localStorage.setItem(CHAVE_BLOQUEIO, desbloqueioEm.toString());
        aplicarTelaBloqueio(TEMPO_BLOQUEIO_MS);
    }
}

btnReiniciar.addEventListener('click', iniciarJogo);

// Inicia o jogo (ou exibe o bloqueio se estiver dentro das 2h)
iniciarJogo();
