// =========================================================
// feedback.js — TOAST E MODAIS
// Componentes de aviso reutilizáveis por qualquer módulo.
// =========================================================
let temporizador;

export function mostrarToast(mensagem, tipo) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.className = 'toast' + (tipo === 'erro' ? ' toast--erro' : '');
  toast.classList.add('is-visivel');
  toast.querySelector('p').textContent = mensagem;
  clearTimeout(temporizador);
  temporizador = setTimeout(function () { toast.classList.remove('is-visivel'); }, 4000);
}

// Botões com data-abrir-modal="id" abrem o <dialog> correspondente
export function iniciarModais(raiz) {
  raiz.querySelectorAll('[data-abrir-modal]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      document.getElementById(botao.dataset.abrirModal).showModal();
    });
  });

  const demo = raiz.querySelector('#demo-toast'); // botão do guia de componentes
  if (demo) {
    demo.addEventListener('click', function () {
      mostrarToast('Doação registrada. Obrigado por ajudar!');
    });
  }
}
