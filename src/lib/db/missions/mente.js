// mente.js - Missões do Pilar Mente
export const MENTE_MISSIONS = {
  leitura: {
    emoji: '📖', name: 'Leitura', color: '#8b5cf6',
    attribute: 'inteligencia',
    missions: [
      { id: 'm_l_1', emoji: '📖', name: 'Ler páginas', unit: 'páginas', baseReps: 5, points: 2 },
      { id: 'm_l_2', emoji: '📖', name: 'Ler capítulo', unit: 'capítulos', baseReps: 1, points: 4 },
      { id: 'm_l_3', emoji: '📚', name: 'Ler livro inteiro', unit: 'livros', baseReps: 1, points: 20 },
      { id: 'm_l_4', emoji: '📖', name: 'Ler artigo', unit: 'artigos', baseReps: 1, points: 3 },
    ],
  },
  idiomas: {
    emoji: '🌍', name: 'Idiomas', color: '#3b82f6',
    attribute: 'inteligencia',
    missions: [
      { id: 'm_i_1', emoji: '🌍', name: 'Aprender palavras', unit: 'palavras', baseReps: 5, points: 2 },
      { id: 'm_i_2', emoji: '🎧', name: 'Ouvir áudio', unit: 'minutos', baseReps: 10, points: 3 },
      { id: 'm_i_3', emoji: '📺', name: 'Assistir vídeo', unit: 'minutos', baseReps: 10, points: 3 },
      { id: 'm_i_4', emoji: '🗣️', name: 'Conversar', unit: 'minutos', baseReps: 10, points: 5 },
    ],
  },
  programacao: {
    emoji: '💻', name: 'Programação', color: '#6366f1',
    attribute: 'inteligencia',
    missions: [
      { id: 'm_p_1', emoji: '💻', name: 'Estudar código', unit: 'minutos', baseReps: 30, points: 5 },
      { id: 'm_p_2', emoji: '🎯', name: 'Resolver desafio', unit: 'desafios', baseReps: 1, points: 5 },
      { id: 'm_p_3', emoji: '🐛', name: 'Corrigir bug', unit: 'bugs', baseReps: 1, points: 4 },
      { id: 'm_p_4', emoji: '📦', name: 'Fazer commit', unit: 'commits', baseReps: 1, points: 2 },
      { id: 'm_p_5', emoji: '📖', name: 'Ler documentação', unit: 'minutos', baseReps: 15, points: 3 },
      { id: 'm_p_6', emoji: '🧩', name: 'Criar componente', unit: 'componentes', baseReps: 1, points: 6 },
    ],
  },
  escrita: {
    emoji: '✍️', name: 'Escrita', color: '#a855f7',
    attribute: 'criatividade',
    missions: [
      { id: 'm_e_1', emoji: '✍️', name: 'Escrever palavras', unit: 'palavras', baseReps: 200, points: 3 },
      { id: 'm_e_2', emoji: '📝', name: 'Escrever diário', unit: 'entradas', baseReps: 1, points: 3 },
      { id: 'm_e_3', emoji: '📄', name: 'Escrever artigo', unit: 'artigos', baseReps: 1, points: 8 },
    ],
  },
  criatividade: {
    emoji: '🎨', name: 'Criatividade', color: '#ec4899',
    attribute: 'criatividade',
    missions: [
      { id: 'm_c_1', emoji: '🎨', name: 'Desenhar/Pintar', unit: 'minutos', baseReps: 20, points: 4 },
      { id: 'm_c_2', emoji: '🎸', name: 'Tocar instrumento', unit: 'minutos', baseReps: 20, points: 4 },
      { id: 'm_c_3', emoji: '📷', name: 'Fotografar', unit: 'fotos', baseReps: 5, points: 3 },
      { id: 'm_c_4', emoji: '🎵', name: 'Compor/Produzir', unit: 'minutos', baseReps: 30, points: 5 },
    ],
  },
  matematica: {
    emoji: '🔢', name: 'Matemática', color: '#14b8a6',
    attribute: 'inteligencia',
    missions: [
      { id: 'm_mt_1', emoji: '🔢', name: 'Resolver exercícios', unit: 'exercícios', baseReps: 5, points: 3 },
      { id: 'm_mt_2', emoji: '📐', name: 'Estudar geometria', unit: 'minutos', baseReps: 20, points: 4 },
    ],
  },
};