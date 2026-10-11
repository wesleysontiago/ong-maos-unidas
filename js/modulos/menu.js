// =========================================================
// menu.js — MENU HAMBÚRGUER
// Só alterna aria-expanded; o CSS cuida da aparência.
// =========================================================

export function fecharMenu() {
  const botao = document.querySelector('.menu-toggle');
  if (botao) botao.setAttribute('aria-expanded', 'false');
}

export function iniciarMenu() {
  const botao = document.querySelector('.menu-toggle');
  if (!botao) return;

  botao.addEventListener('click', function () {
    const aberto = botao.getAttribute('aria-expanded') === 'true';
    botao.setAttribute('aria-expanded', String(!aberto));
  });

  // Esc fecha o menu e devolve o foco ao botão
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
      fecharMenu();
      botao.focus();
    }
  });
}
