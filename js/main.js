// =========================================================
// main.js — PONTO DE ENTRADA DA APLICAÇÃO
// Único script carregado pelo HTML (type="module").
// Importa os módulos e decide QUANDO cada um é iniciado.
// Os módulos não se chamam entre si para isso: o main coordena.
// =========================================================
import { iniciarMenu, fecharMenu } from './modulos/menu.js';
import { iniciarPreferencias } from './modulos/preferencias.js';
import { iniciarRoteador } from './modulos/spa.js';
import { iniciarMascaras } from './modulos/mascaras.js';
import { iniciarModais, mostrarToast } from './modulos/feedback.js';
import { iniciarFormulario } from './modulos/formulario.js';
import { renderizarProjetos } from './modulos/templates.js';
import { iniciarGrafico } from './modulos/grafico.js';

// Comportamentos do conteúdo da página (#conteudo).
// Roda no carregamento e de novo a cada troca feita pela SPA.
function iniciarConteudo(raiz) {
  iniciarMascaras(raiz);
  iniciarModais(raiz);
  iniciarFormulario(raiz);
  renderizarProjetos(raiz);
  iniciarGrafico(raiz);
}

// Partes fixas (cabeçalho): iniciadas uma única vez
iniciarMenu();
iniciarPreferencias();
iniciarRoteador({
  aoTrocarConteudo: function (raiz) {
    fecharMenu();
    iniciarConteudo(raiz);
  },
  aoFalhar: function (mensagem) {
    mostrarToast(mensagem, 'erro');
  }
});

iniciarConteudo(document.getElementById('conteudo') || document);
window.appIniciado = true; // avisa o HTML que os módulos carregaram
