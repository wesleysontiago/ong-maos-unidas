# ONG Mãos Unidas — Plataforma Web

Site institucional para uma ONG fictícia, desenvolvido na disciplina de Desenvolvimento Front-end.
Divulga projetos sociais, capta voluntários e doações e oferece um formulário de cadastro com validação.

## Tecnologias

- HTML5 semântico (validado no W3C)
- CSS3 com Design System em variáveis, Grid de 12 colunas e Flexbox
- JavaScript em ES6 Modules: SPA com History API, templates, validação e `localStorage`
- [Chart.js 4.4.1](https://www.chartjs.org/) via CDN (gráfico de impacto)

## Como executar

Os módulos JavaScript precisam de um servidor local. Use a extensão **Live Server** do VS Code
(abra `index.html` com "Open with Live Server") ou rode:

```bash
python3 -m http.server 8000
```

e acesse `http://localhost:8000`.

## Estrutura de pastas

```
├── index.html        → redireciona para html/index.html
├── html/             → páginas (index, projetos, cadastro, componentes)
├── css/              → reset.css, variaveis.css, style.css
├── js/
│   ├── main.js       → ponto de entrada
│   └── modulos/      → um módulo por responsabilidade
└── imagens/          → logo (SVG/PNG) e fotos (WebP/JPG)
```

## Fluxo de trabalho (GitFlow)

| Branch | Função |
|---|---|
| `main` | Versões publicadas. Cada versão recebe uma tag (`v1.0.0`, `v1.0.1`). |
| `develop` | Integração contínua: recebe as funcionalidades concluídas. |
| `feature/*` | Uma branch por funcionalidade, criada a partir de `develop`. |
| `release/*` | Preparação de uma versão (documentação, número de versão). |
| `hotfix/*` | Correção urgente criada a partir de `main`. |

Os merges usam `--no-ff` para manter visível no histórico onde cada branch começou e terminou.

## Versão

0.1.0
