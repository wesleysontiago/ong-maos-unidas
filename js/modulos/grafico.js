// =========================================================
// grafico.js — GRÁFICO DE IMPACTO com a biblioteca Chart.js (CDN)
// - Carregada sob demanda: só baixa a biblioteca se a página
//   tiver o <canvas id="grafico-impacto">
// - Os dados vêm da <table> da própria página (fonte única e
//   versão acessível do gráfico)
// - Se a CDN falhar, a tabela continua visível: nada quebra
// =========================================================

const CHART_JS = {
  url: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js',
  integridade: 'sha384-dug+JxfBvklEQdJ4AYuBBAIScUz0bVN73xpy273gcAwHjb3qI0fXmuYNaNfdyYJG'
};
let promessaChart = null; // garante um único download, mesmo navegando pela SPA

function carregarChartJs() {
  if (window.Chart) return Promise.resolve(window.Chart);
  if (!promessaChart) {
    promessaChart = new Promise(function (resolver, rejeitar) {
      const script = document.createElement('script');
      script.src = CHART_JS.url;
      script.integrity = CHART_JS.integridade; // o navegador confere se o arquivo não foi alterado
      script.crossOrigin = 'anonymous';
      script.onload = function () { resolver(window.Chart); };
      script.onerror = function () { promessaChart = null; rejeitar(new Error('Chart.js indisponível')); };
      document.head.appendChild(script);
    });
  }
  return promessaChart;
}

// Lê anos e valores da tabela
function lerTabela(tabela) {
  const linhas = Array.from(tabela.tBodies[0].rows);
  return {
    rotulos: linhas.map(function (l) { return l.cells[0].textContent.trim(); }),
    valores: linhas.map(function (l) { return Number(l.cells[1].textContent.replace(/\D/g, '')); })
  };
}

export function iniciarGrafico(raiz) {
  const canvas = raiz.querySelector('#grafico-impacto');
  const tabela = raiz.querySelector('#tabela-impacto');
  if (!canvas || !tabela) return; // página sem gráfico: nem baixa a biblioteca

  const dados = lerTabela(tabela);
  const estilo = getComputedStyle(document.documentElement);
  const cor = function (nome) { return estilo.getPropertyValue(nome).trim(); };
  const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  carregarChartJs().then(function (Chart) {
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: dados.rotulos,
        datasets: [{
          label: 'Refeições distribuídas',
          data: dados.valores,
          backgroundColor: cor('--cor-primaria-media'),
          hoverBackgroundColor: cor('--cor-primaria'),
          borderRadius: { topLeft: 4, topRight: 4 },
          maxBarThickness: 48
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: semAnimacao ? false : { duration: 600 },
        plugins: {
          legend: { display: false }, // série única: o título já diz o que é
          tooltip: {
            backgroundColor: cor('--cor-texto'),
            displayColors: false,
            callbacks: {
              label: function (item) { return item.parsed.y.toLocaleString('pt-BR') + ' refeições'; }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: cor('--cor-texto-suave') } },
          y: {
            beginAtZero: true,
            grid: { color: cor('--cor-divisor') },
            border: { display: false },
            ticks: {
              color: cor('--cor-texto-suave'),
              callback: function (v) { return v.toLocaleString('pt-BR'); }
            }
          }
        }
      }
    });
    canvas.closest('figure').classList.add('grafico--pronto');
  }).catch(function () {
    const detalhes = tabela.closest('details');
    if (detalhes) detalhes.open = true; // sem biblioteca: mostra a tabela aberta
  });
}

