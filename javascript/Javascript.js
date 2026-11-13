document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.service-card');
  const btnVoltar = document.getElementById('btnVoltar');

  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const preco = card.getAttribute('data-preco');
      console.log(`Produto selecionado: R$ ${preco}`);
    });
  });

  
  btnVoltar.addEventListener('click', () => {
    window.history.back();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  
  const anoSpan = document.getElementById("ano-atual");
  if (anoSpan) {
    anoSpan.textContent = new Date().getFullYear();
  }

  
  const elementosReveal = document.querySelectorAll(".reveal");

  const observerReveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ativo");
        }
      });
    },
    { threshold: 0.15 }
  );

  elementosReveal.forEach((el) => observerReveal.observe(el));

  
  const contadores = document.querySelectorAll(".contador");
  let animacaoExecutada = false;

  const animarContadores = () => {
    contadores.forEach((contador) => {
      const alvo = Number(contador.getAttribute("data-alvo"));
      const duracao = 1800; 
      const incremento = alvo / (duracao / 16);
      let valorAtual = 0;

      const atualizar = () => {
        valorAtual += incremento;
        if (valorAtual < alvo) {
          contador.textContent = Math.floor(valorAtual).toLocaleString("pt-BR");
          requestAnimationFrame(atualizar);
        } else {
          contador.textContent = alvo.toLocaleString("pt-BR");
        }
      };

      atualizar();
    });
  };

  const secaoNumeros = document.querySelector(".numeros-section");
  if (secaoNumeros) {
    const observerNumeros = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animacaoExecutada) {
          animarContadores();
          animacaoExecutada = true;
        }
      },
      { threshold: 0.3 }
    );

    observerNumeros.observe(secaoNumeros);
  }
});
