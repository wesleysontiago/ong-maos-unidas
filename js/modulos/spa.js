// =========================================================
// spa.js — ROTEADOR COM HISTORY API
// Não conhece nenhum outro módulo: depois de trocar o conteúdo,
// apenas avisa quem o iniciou (callback "aoTrocarConteudo").
// Intercepta os links internos, busca a página, extrai o <main>
// e injeta o conteúdo em #conteudo, sem recarregar o documento.
// Se algo falhar, o link funciona normalmente (navegação comum).
// =========================================================

let conteudo;
let aoTrocarConteudo = function () {};
let aoFalhar = function () {};
let navegacaoAtual = 0; // identifica a navegação mais recente
const cache = new Map();          // páginas já baixadas: { titulo, main }
let caminhoAtual = location.pathname;

// 1. Decide se um link deve ser tratado pela SPA
function ehLinkInterno(link) {
  if (!link || link.target || link.hasAttribute('download')) return false;
  const url = new URL(link.href, location.href);
  return url.origin === location.origin && url.pathname.endsWith('.html');
}

// 2. Busca a página e guarda só o que interessa (título + <main>)
async function carregarPagina(caminho) {
  if (cache.has(caminho)) return cache.get(caminho);

  const resposta = await fetch(caminho);
  if (!resposta.ok) throw new Error('HTTP ' + resposta.status);

  const html = await resposta.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const main = doc.getElementById('conteudo');
  if (!main) throw new Error('Página sem #conteudo');

  const pagina = { titulo: doc.title, main: main };
  cache.set(caminho, pagina);
  return pagina;
}

// 3. Limpa o contêiner e injeta o novo fragmento
function renderizar(pagina, url) {
  const fragmento = document.createDocumentFragment();
  pagina.main.cloneNode(true).childNodes.forEach(function (no) {
    fragmento.appendChild(document.importNode(no, true));
  });
  conteudo.replaceChildren(fragmento);   // remove o antigo e insere o novo de uma vez

  document.title = pagina.titulo;
  caminhoAtual = url.pathname;
  atualizarMenu(url.pathname);

  // Avisa o main.js para religar os comportamentos do novo conteúdo
  aoTrocarConteudo(conteudo);

  // Acessibilidade: leva o foco ao novo título (o leitor de tela anuncia a página)
  const destino = url.hash ? document.getElementById(url.hash.slice(1)) : null;
  const titulo = destino || conteudo.querySelector('h1');
  if (titulo) {
    titulo.setAttribute('tabindex', '-1');
    titulo.focus({ preventScroll: true });
    titulo.scrollIntoView({ block: 'start' });
  }
}

// Marca o item atual do menu (aria-current)
function atualizarMenu(caminho) {
  document.querySelectorAll('.menu a').forEach(function (link) {
    const alvo = new URL(link.href);
    if (alvo.pathname === caminho && !alvo.hash) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

// 4. Fluxo principal de navegação
async function navegar(endereco, empilhar) {
  const url = new URL(endereco, location.href);
  const minhaNavegacao = ++navegacaoAtual;
  conteudo.setAttribute('aria-busy', 'true');
  try {
    const pagina = await carregarPagina(url.pathname);
    if (minhaNavegacao !== navegacaoAtual) return;      // um clique mais novo já assumiu
    if (empilhar) history.pushState({}, '', url.href);  // muda a URL sem recarregar
    renderizar(pagina, url);
  } catch (erro) {
    if (minhaNavegacao !== navegacaoAtual) return;
    if (erro instanceof TypeError) {
      // fetch lança TypeError quando não há conexão: fica na página atual e avisa
      if (!empilhar) history.pushState({}, '', caminhoAtual); // desfaz o "voltar" na URL
      aoFalhar('Sem conexão com a internet. Verifique e tente de novo.');
    } else {
      location.href = url.href; // erro do servidor (ex.: 404): navegação tradicional
    }
  } finally {
    if (minhaNavegacao === navegacaoAtual) conteudo.removeAttribute('aria-busy');
  }
}

// 5. Liga o roteador (chamado uma única vez pelo main.js)
export function iniciarRoteador(opcoes) {
  conteudo = document.getElementById('conteudo');
  if (!conteudo) return;
  aoTrocarConteudo = opcoes.aoTrocarConteudo || aoTrocarConteudo;
  aoFalhar = opcoes.aoFalhar || aoFalhar;

  // Interceptação dos cliques (delegação de eventos no documento)
  document.addEventListener('click', function (evento) {
    const link = evento.target.closest('a');
    if (evento.defaultPrevented || evento.button !== 0) return;
    if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return; // nova aba
    if (!ehLinkInterno(link)) return;

    const url = new URL(link.href);
    if (url.pathname === caminhoAtual && url.hash) return; // âncora na mesma página

    evento.preventDefault();
    navegar(url.href, true);
  });

  // Botões Voltar/Avançar do navegador
  window.addEventListener('popstate', function () {
    if (location.pathname === caminhoAtual) return; // só mudou a âncora
    navegar(location.href, false);
  });
}
