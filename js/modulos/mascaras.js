// =========================================================
// mascaras.js — FORMATAÇÃO DE CPF, TELEFONE E CEP
// Funções puras (texto -> texto) + ligação aos campos.
// cpfValido é exportada para ser reutilizada pela validação.
// =========================================================

function somenteNumeros(valor) {
  return valor.replace(/\D/g, '');
}

export function mascaraCPF(valor) {
  return somenteNumeros(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function mascaraTelefone(valor) {
  const n = somenteNumeros(valor).slice(0, 11);
  if (n.length <= 2) return n.length ? '(' + n : '';
  if (n.length <= 6) return '(' + n.slice(0, 2) + ') ' + n.slice(2);
  if (n.length <= 10) return '(' + n.slice(0, 2) + ') ' + n.slice(2, 6) + '-' + n.slice(6);
  return '(' + n.slice(0, 2) + ') ' + n.slice(2, 7) + '-' + n.slice(7);
}

export function mascaraCEP(valor) {
  return somenteNumeros(valor)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
}

// Confere os dois dígitos verificadores do CPF
export function cpfValido(cpf) {
  const n = somenteNumeros(cpf);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(n[i]) * (t + 1 - i);
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(n[t])) return false;
  }
  return true;
}

const REGRAS = { cpf: mascaraCPF, telefone: mascaraTelefone, cep: mascaraCEP };

// Liga as máscaras aos campos que existirem dentro de "raiz"
export function iniciarMascaras(raiz) {
  Object.keys(REGRAS).forEach(function (id) {
    const campo = raiz.querySelector('#' + id);
    if (!campo || campo.dataset.mascarado) return; // evita ligar duas vezes
    campo.dataset.mascarado = 'sim';
    campo.addEventListener('input', function () {
      campo.value = REGRAS[id](campo.value);
    });
  });
}
