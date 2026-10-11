// =========================================================
// preferencias.js — PREFERÊNCIA VISUAL (texto maior)
// Usa storage.js para lembrar a escolha entre visitas.
// =========================================================
import { salvar, ler } from './storage.js';

const CHAVE = 'ong:preferencias';

function lerPrefs() {
  const prefs = ler(CHAVE, { fonteGrande: false }, function (v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  });
  return { fonteGrande: prefs.fonteGrande === true };
}

function aplicar() {
  const prefs = lerPrefs();
  document.documentElement.classList.toggle('fonte-grande', prefs.fonteGrande);
  const botao = document.querySelector('.botao-fonte');
  if (botao) botao.setAttribute('aria-pressed', String(prefs.fonteGrande));
}

export function iniciarPreferencias() {
  const botao = document.querySelector('.botao-fonte');
  if (!botao) return;
  botao.addEventListener('click', function () {
    const prefs = lerPrefs();
    prefs.fonteGrande = !prefs.fonteGrande;
    salvar(CHAVE, prefs);
    aplicar();
  });
  aplicar();
}
