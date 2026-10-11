// =========================================================
// cadastros.js — DADOS DO CADASTRO (regras de persistência)
// Decide O QUE é salvo (rascunho e histórico) usando storage.js.
// Não toca no DOM: recebe e devolve objetos simples.
// Dados sensíveis (CPF, telefone, nascimento) nunca são gravados.
// =========================================================
import { salvar, ler, remover } from './storage.js';

const CHAVE_RASCUNHO = 'ong:rascunho';
const CHAVE_CADASTROS = 'ong:cadastros';
// Validadores de formato (protegem contra dados antigos ou editados à mão)
function ehObjeto(valor) {
  return valor !== null && typeof valor === 'object' && !Array.isArray(valor);
}
function ehCadastroValido(item) {
  return ehObjeto(item) && typeof item.nome === 'string' && typeof item.cidade === 'string' &&
    !isNaN(new Date(item.data).getTime());
}

export const CAMPOS_RASCUNHO = ['nome', 'email', 'cep', 'endereco', 'cidade', 'estado', 'participacao'];

// ----- Rascunho -----
export function guardarRascunho(valores) {
  const rascunho = {};
  CAMPOS_RASCUNHO.forEach(function (campo) { rascunho[campo] = valores[campo] || ''; });
  rascunho.salvoEm = new Date().toISOString();
  salvar(CHAVE_RASCUNHO, rascunho);
}
export function lerRascunho() { return ler(CHAVE_RASCUNHO, null, ehObjeto); }
export function apagarRascunho() { remover(CHAVE_RASCUNHO); }

// ----- Histórico -----
export function listarCadastros() {
  const lista = ler(CHAVE_CADASTROS, [], Array.isArray);
  return lista.filter(ehCadastroValido); // ignora itens incompletos
}

export function adicionarCadastro(dados) {
  const cadastros = listarCadastros();
  cadastros.push({
    nome: dados.nome,
    cidade: dados.cidade,
    participacao: dados.participacao,
    data: new Date().toISOString()
  });
  salvar(CHAVE_CADASTROS, cadastros);
  return cadastros;
}

export function limparCadastros() { remover(CHAVE_CADASTROS); }
