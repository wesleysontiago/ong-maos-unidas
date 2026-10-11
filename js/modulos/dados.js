// =========================================================
// dados.js — DADOS DE ORIGEM DOS PROJETOS
// Só exporta dados. Para incluir um projeto, basta adicionar
// um objeto nesta lista; nenhum HTML precisa ser escrito.
// =========================================================
export const PROJETOS = [
  {
    titulo: 'Reforço Escolar',
    descricao: 'Apoio pedagógico gratuito para crianças de 6 a 14 anos, com foco em leitura e matemática.',
    imagem: 'projeto-educacao',
    alt: 'Crianças estudando em uma sala de aula comunitária',
    categorias: [
      { rotulo: 'Educação', tipo: 'educacao' },
      { rotulo: 'Ativo', tipo: 'ativo' }
    ],
    vagas: 8
  },
  {
    titulo: 'Cozinha Solidária',
    descricao: 'Refeições nutritivas servidas de segunda a sexta para famílias da comunidade.',
    imagem: 'projeto-alimentacao',
    alt: 'Voluntários servindo refeições em uma cozinha comunitária',
    categorias: [
      { rotulo: 'Alimentação', tipo: 'alimentacao' },
      { rotulo: 'Precisa de doações', tipo: 'urgente' }
    ],
    vagas: 3
  },
  {
    titulo: 'Cidadania Digital',
    descricao: 'Turmas de informática básica e uso seguro da internet para adultos e idosos.',
    imagem: 'projeto-digital',
    alt: 'Adultos aprendendo a usar computadores',
    categorias: [
      { rotulo: 'Tecnologia', tipo: 'educacao' },
      { rotulo: 'Novo', tipo: 'novo' }
    ],
    vagas: 0
  }
];
