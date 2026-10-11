// =========================================================
// formulario.js — ORQUESTRA A PÁGINA DE CADASTRO
// Une validação (validacao.js), dados (cadastros.js) e avisos
// (feedback.js). É o único módulo que conhece os três.
// =========================================================
import { iniciarValidacao, limparEstados } from './validacao.js';
import {
  CAMPOS_RASCUNHO, guardarRascunho, lerRascunho, apagarRascunho,
  listarCadastros, adicionarCadastro, limparCadastros
} from './cadastros.js';
import { mostrarToast } from './feedback.js';

// Lê os campos do formulário para um objeto simples
function lerValores(form) {
  const valores = {};
  CAMPOS_RASCUNHO.forEach(function (nome) {
    const campo = form.elements[nome];
    if (campo) valores[nome] = campo.value.trim ? campo.value.trim() : campo.value;
  });
  return valores;
}

function preencher(form, valores) {
  CAMPOS_RASCUNHO.forEach(function (nome) {
    const campo = form.elements[nome];
    if (campo && valores[nome]) campo.value = valores[nome]; // RadioNodeList aceita .value
  });
}

function renderizarHistorico(raiz) {
  const lista = raiz.querySelector('#historico-cadastros');
  const secao = raiz.querySelector('#secao-historico');
  if (!lista || !secao) return;

  const cadastros = listarCadastros();
  secao.hidden = cadastros.length === 0;
  const itens = cadastros.slice().reverse().map(function (c) {
    const li = document.createElement('li');
    const tipo = c.participacao === 'doador' ? 'Doador' : 'Voluntário';
    li.textContent = c.nome + ' (' + c.cidade + ') — ' + tipo + ' — ' +
      new Date(c.data).toLocaleDateString('pt-BR');
    return li;
  });
  lista.replaceChildren(...itens);
}

export function iniciarFormulario(raiz) {
  renderizarHistorico(raiz);
  const form = raiz.querySelector('form[data-cadastro]');
  if (!form || form.dataset.formulario) return;
  form.dataset.formulario = 'ativo';

  // 1. Restaura o rascunho salvo
  const rascunho = lerRascunho();
  if (rascunho) {
    preencher(form, rascunho);
    mostrarToast('Recuperamos o rascunho do seu cadastro.');
  }

  // 2. Salva o rascunho 400 ms depois da última alteração
  let espera;
  function agendar() {
    clearTimeout(espera);
    espera = setTimeout(function () { guardarRascunho(lerValores(form)); }, 400);
  }
  form.addEventListener('input', agendar);
  form.addEventListener('change', agendar);
  form.addEventListener('reset', function () { clearTimeout(espera); apagarRascunho(); });

  // 3. Validação: só chega aqui se todos os campos estiverem corretos
  iniciarValidacao(form, {
    aoEnviarValido: function () {
      clearTimeout(espera);
      adicionarCadastro(lerValores(form));
      form.reset();          // dispara "reset": apaga rascunho e estados visuais
      limparEstados(form);
      renderizarHistorico(raiz);
      mostrarToast('Cadastro enviado com sucesso! Entraremos em contato.');
    }
  });

  // 4. Botão de limpar o histórico
  const limpar = raiz.querySelector('#limpar-historico');
  if (limpar) {
    limpar.addEventListener('click', function () {
      limparCadastros();
      renderizarHistorico(raiz);
      mostrarToast('Histórico apagado deste navegador.');
    });
  }
}
