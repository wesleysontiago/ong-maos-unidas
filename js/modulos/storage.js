// =========================================================
// storage.js — CAMADA DE PERSISTÊNCIA (infraestrutura)
// Único módulo que conversa com o localStorage.
// Não conhece o DOM nem as regras do negócio.
// =========================================================

export function salvar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor)); // objeto/array -> string
    return true;
  } catch (erro) {
    return false; // modo privado ou armazenamento cheio
  }
}

// "validar" (opcional) confere o FORMATO do que foi lido.
// Se o dado existir mas tiver o tipo errado, ele é descartado.
export function ler(chave, valorPadrao, validar) {
  try {
    const texto = localStorage.getItem(chave);
    if (texto === null) return valorPadrao;
    const valor = JSON.parse(texto); // string -> objeto/array
    if (validar && !validar(valor)) throw new Error('Formato inesperado em ' + chave);
    return valor;
  } catch (erro) {
    console.warn('[storage] dado inválido descartado:', chave, erro.message);
    remover(chave);
    return valorPadrao;
  }
}

export function remover(chave) {
  try { localStorage.removeItem(chave); } catch (erro) { /* sem acesso ao storage */ }
}
