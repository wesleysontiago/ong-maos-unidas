// =========================================================
// templates.js — CARTÕES DE PROJETO A PARTIR DE DADOS
// Clona o <template id="molde-card-projeto"> para cada item
// de PROJETOS e preenche com textContent (seguro contra XSS).
// =========================================================
import { PROJETOS } from './dados.js';

function criarBadges(categorias) {
  return categorias.map(function (categoria) {
    const badge = document.createElement('span');
    badge.className = 'badge badge--' + categoria.tipo;
    badge.textContent = categoria.rotulo;
    return badge;
  });
}

function textoVagas(vagas) {
  if (vagas === 0) return 'Vagas de voluntário esgotadas';
  return vagas === 1 ? '1 vaga de voluntário' : vagas + ' vagas de voluntário';
}

function criarCardProjeto(molde, projeto) {
  const card = molde.content.firstElementChild.cloneNode(true);
  card.querySelector('[data-campo="titulo"]').textContent = projeto.titulo;
  card.querySelector('[data-campo="badges"]').append(...criarBadges(projeto.categorias));
  card.querySelector('[data-campo="descricao"]').textContent = projeto.descricao;
  card.querySelector('[data-campo="vagas"]').textContent = textoVagas(projeto.vagas);
  card.querySelector('source').srcset = '../imagens/' + projeto.imagem + '.webp';
  const img = card.querySelector('img');
  img.src = '../imagens/' + projeto.imagem + '.jpg';
  img.alt = projeto.alt;
  return card;
}

export function renderizarProjetos(raiz) {
  const destino = raiz.querySelector('#cards-projetos');
  const molde = raiz.querySelector('#molde-card-projeto');
  if (!destino || !molde) return;

  const fragmento = document.createDocumentFragment();
  PROJETOS.forEach(function (projeto) {
    fragmento.appendChild(criarCardProjeto(molde, projeto));
  });
  destino.replaceChildren(fragmento);
}
