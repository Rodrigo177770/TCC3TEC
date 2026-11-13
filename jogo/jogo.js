
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

let primeiraCarta = null;
let segundaCarta = null;
let bloqueioTabuleiro = false;
let paresEncontrados = 0;
let tempoRestante = 60; 
let intervaloTempo = null;
let jogoIniciado = false;

function iniciarJogo() {
    
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

    
    const baralho = [...imagensCartas, ...imagensCartas];
    baralho.sort(() => Math.random() - 0.5);

    
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
            finalizarJogo(false); 
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

        
        if (paresEncontrados === imagensCartas.length) {
            clearInterval(intervaloTempo);
            setTimeout(() => finalizarJogo(true), 400); 
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
        
        
        btnJogarNovamente.textContent = "Resgatar";
        btnJogarNovamente.disabled = false;
        btnJogarNovamente.style.backgroundColor = "#e60000";
        btnJogarNovamente.style.cursor = "pointer";
        btnJogarNovamente.onclick = () => {
            window.location.href = '../index.html';
        };
    } else {
        mensagemTitulo.textContent = "Não foi dessa vez";
        mensagemTexto.textContent = "O tempo de 1 minuto acabou. Tente novamente!";
        
        
        btnJogarNovamente.textContent = "Jogar Novamente";
        btnJogarNovamente.disabled = false;
        btnJogarNovamente.style.backgroundColor = "#e60000";
        btnJogarNovamente.style.cursor = "pointer";
        btnJogarNovamente.onclick = () => {
            window.location.href = '../index.html';
        };
    }

    modalFim.classList.remove('oculto');
}

btnReiniciar.addEventListener('click', iniciarJogo);


iniciarJogo();
