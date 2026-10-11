# ONG Mãos Unidas — Plataforma Web

Plataforma web de uma ONG (fictícia) do terceiro setor, desenvolvida na disciplina de
**Desenvolvimento Front-end**. O site apresenta a organização, divulga seus projetos sociais,
mostra o impacto alcançado e capta voluntários e doadores por meio de um formulário de cadastro
com validação completa.

> Versão atual: **1.0.1** — veja o [histórico de versões](#histórico-de-versões).

---

## Sumário

1. [Visão geral](#visão-geral)
2. [Funcionalidades](#funcionalidades)
3. [Tecnologias](#tecnologias)
4. [Pré-requisitos](#pré-requisitos)
5. [Instalação](#instalação)
6. [Como executar](#como-executar)
7. [Build e publicação](#build-e-publicação)
8. [Testes e validação](#testes-e-validação)
9. [Estrutura de pastas](#estrutura-de-pastas)
10. [Arquitetura do JavaScript](#arquitetura-do-javascript)
11. [Acessibilidade](#acessibilidade)
12. [Fluxo de trabalho (GitFlow)](#fluxo-de-trabalho-gitflow)
13. [Histórico de versões](#histórico-de-versões)
14. [Créditos](#créditos)

---

## Visão geral

| Página | Conteúdo |
|---|---|
| **Início** (`html/index.html`) | Missão, visão e valores, história, gráfico de impacto e contato. |
| **Projetos sociais** (`html/projetos.html`) | Cartões dos projetos, como ser voluntário e como doar. |
| **Cadastro** (`html/cadastro.html`) | Formulário de voluntários e doadores. |
| **Guia de componentes** (`html/componentes.html`) | Referência visual de badges, alertas, botões, toast e modal. |

O site funciona como uma **SPA (Single Page Application)**: a navegação troca apenas o conteúdo
principal, sem recarregar a página.

## Funcionalidades

- **Menu responsivo:** horizontal com submenu (dropdown) no desktop e hambúrguer no celular.
- **Design System:** cores, tipografia e espaçamentos centralizados em variáveis CSS.
- **Layout responsivo:** Grid de 12 colunas com 5 breakpoints (576, 768, 992, 1200 e 1400px).
- **Formulário de cadastro:**
  - máscaras automáticas para CPF, telefone e CEP;
  - validação com mensagens abaixo de cada campo e resumo de erros;
  - conferência dos dígitos do CPF, do DDD e da idade mínima (16 anos).
- **Persistência local (`localStorage`):**
  - rascunho automático do formulário;
  - histórico de cadastros enviados;
  - preferência de texto maior (botão **A+**).
- **Cartões de projeto gerados por template** a partir de uma lista de dados.
- **Componentes de feedback:** alertas, badges, toast e modal (`<dialog>`).
- **Gráfico de impacto** com Chart.js, com tabela de dados como alternativa acessível.
- **Tolerância a falhas:** aviso quando a internet cai durante a navegação, dados corrompidos
  descartados com segurança e funcionamento básico mesmo sem JavaScript.

## Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| **HTML5** | Estrutura semântica (`header`, `nav`, `main`, `section`, `article`, `footer`), formulários e `<template>`. |
| **CSS3** | Variáveis (custom properties), Grid, Flexbox, media queries, pseudo-classes de estado e transições. |
| **JavaScript (ES6+)** | Módulos (`import`/`export`), History API, `fetch`, DOM, `localStorage`. |
| **[Chart.js 4.4.1](https://www.chartjs.org/)** | Gráfico de barras, carregado via CDN (jsDelivr) com verificação de integridade (SRI). |
| **Node.js** *(só para desenvolvimento)* | Servidor local, testes automatizados e validação. |
| **Git + GitHub** | Versionamento com GitFlow, tags e releases. |

O site em si **não usa frameworks** nem precisa de compilação: são arquivos estáticos.

## Pré-requisitos

| Ferramenta | Versão | Para quê |
|---|---|---|
| Navegador moderno | Chrome, Edge, Firefox ou Safari atualizados | Abrir o site |
| [Node.js](https://nodejs.org/) | 18 ou superior | Servidor local e testes |
| [Java](https://adoptium.net/) | 11 ou superior | *(Opcional)* validar HTML e CSS localmente |
| [Git](https://git-scm.com/) | qualquer versão recente | Clonar o repositório |

> Sem Node.js, também é possível abrir o projeto com a extensão **Live Server** do VS Code.

## Instalação

```bash
git clone https://github.com/SEU-USUARIO/ong-maos-unidas.git
cd ong-maos-unidas
npm install
```

O `npm install` instala apenas as ferramentas de desenvolvimento (`http-server` e `vnu-jar`).
O site não tem dependências de produção.

## Como executar

```bash
npm start
```

O site abre em `http://localhost:8000/html/index.html`.

**Por que um servidor?** Os módulos JavaScript (`type="module"`) e o carregamento das páginas
pela SPA (`fetch`) são bloqueados pelo navegador quando o arquivo é aberto direto do disco
(`file://`). Nesse caso, o site continua utilizável, mas sem a parte interativa.

## Build e publicação

O projeto **não tem etapa de build**: HTML, CSS e JavaScript são servidos exatamente como estão
no repositório. Para publicar, basta enviar as pastas `html/`, `css/`, `js/`, `imagens/` e o
`index.html` da raiz para qualquer hospedagem de arquivos estáticos.

**GitHub Pages:** em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`.
O `index.html` da raiz redireciona para `html/index.html`.

## Testes e validação

| Comando | O que faz |
|---|---|
| `npm test` | Roda os testes automatizados (Node Test Runner, sem dependências extras). |
| `npm run validar` | Valida todo o HTML e o CSS com o validador oficial do W3C (precisa de Java). |
| `npm run validar:html` | Valida só o HTML. |
| `npm run validar:css` | Valida só o CSS. |

**Testes automatizados** (pasta `tests/`):

- `mascaras.test.js`: formatação de CPF, telefone e CEP e cálculo dos dígitos do CPF.
- `validacao.test.js`: regras do formulário (nome, e-mail, CPF, telefone/DDD, idade, CEP e
  campos obrigatórios).

**Testes manuais recomendados** (no navegador, com DevTools aberto):

1. *Network → Offline* e clicar no menu: deve aparecer o aviso "Sem conexão".
2. *Application → Local Storage*: trocar `ong:cadastros` por `{"a":1}` e recarregar o cadastro.
   O dado deve ser descartado com um aviso no console, sem erros.
3. Dar dois cliques rápidos em "Enviar" com o formulário válido: deve haver um único envio.
4. Navegar pelo menu e usar Voltar/Avançar: a página não deve recarregar.

Sem Java, a validação pode ser feita em <https://validator.w3.org/> e
<https://jigsaw.w3.org/css-validator/>.

## Estrutura de pastas

```
├── index.html          → redireciona para html/index.html
├── html/               → páginas (index, projetos, cadastro, componentes)
├── css/
│   ├── reset.css       → normaliza diferenças entre navegadores
│   ├── variaveis.css   → Design System (cores, tipografia, espaçamentos)
│   └── style.css       → layout, componentes, menu, formulários e feedback
├── js/
│   ├── main.js         → ponto de entrada: importa e inicia os módulos
│   └── modulos/        → um módulo por responsabilidade (ver abaixo)
├── imagens/            → logo (SVG/PNG) e fotos (WebP + JPG)
├── tests/              → testes automatizados
└── package.json        → scripts de desenvolvimento
```

## Arquitetura do JavaScript

O HTML carrega um único script, `js/main.js` (`type="module"`), que coordena os módulos:

| Módulo | Responsabilidade |
|---|---|
| `storage.js` | Único acesso ao `localStorage` (`JSON.stringify` / `JSON.parse` com validação de formato). |
| `cadastros.js` | Regras de dados do rascunho e do histórico (sem DOM). |
| `dados.js` | Lista de projetos sociais. |
| `mascaras.js` | Máscaras e cálculo do CPF (funções puras). |
| `validacao.js` | Regras do formulário e estados visuais de erro/sucesso. |
| `formulario.js` | Orquestra a página de cadastro (validação + dados + avisos). |
| `feedback.js` | Toast e modais. |
| `templates.js` | Gera os cartões de projeto a partir do `<template>`. |
| `grafico.js` | Carrega o Chart.js sob demanda e desenha o gráfico. |
| `menu.js` | Menu hambúrguer. |
| `preferencias.js` | Preferência de texto maior. |
| `spa.js` | Roteador com History API (não depende de nenhum outro módulo). |

As dependências seguem uma só direção (main → orquestradores → regras → infraestrutura), e os
módulos se comunicam por `import`/`export` e callbacks, sem variáveis globais.

## Acessibilidade

- Contraste de cores conferido pelo padrão **WCAG AA** (mínimo 4,5:1).
- Navegação completa por teclado, com foco visível.
- `aria-expanded`, `aria-current`, `aria-invalid`, `aria-describedby` e `role="alert"/"status"`.
- Erros sinalizados com texto e ícone, nunca só com cor.
- Botão **A+** para aumentar o texto, com a preferência salva.
- Respeito a `prefers-reduced-motion`.
- Gráfico com descrição (`aria-label`) e tabela de dados equivalente.

## Fluxo de trabalho (GitFlow)

| Branch | Função |
|---|---|
| `main` | Versões publicadas, cada uma com uma tag (`v1.0.0`, `v1.0.1`, `v1.1.0`). |
| `develop` | Integração das funcionalidades concluídas. |
| `feature/*` | Uma branch por funcionalidade, criada a partir de `develop`. |
| `release/*` | Preparação de uma versão. |
| `hotfix/*` | Correção urgente criada a partir de `main`. |

As mensagens de commit seguem o padrão **Conventional Commits** (`feat:`, `fix:`, `docs:`,
`test:`, `chore:`), e os merges usam `--no-ff` para manter o histórico legível.

## Histórico de versões

O projeto segue o **versionamento semântico** (MAIOR.MENOR.CORREÇÃO).

| Versão | Descrição |
|---|---|
| **1.1.0** | Testes automatizados, scripts de desenvolvimento (`npm start`, `npm test`, `npm run validar`) e README completo. |
| **1.0.1** | Correção: o segundo clique em "Enviar" logo após um envio mostrava erros falsos. |
| **1.0.0** | Primeira versão completa do site. |

## Créditos

Projeto acadêmico. Os dados, nomes e imagens da ONG são fictícios.
