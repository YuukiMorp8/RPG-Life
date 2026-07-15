// bemEstar.js - Missões do Pilar Bem-Estar
export const BEM_ESTAR_MISSIONS = {
  natureza: {
    emoji: '🌿', name: 'Natureza', color: '#22c55e',
    attribute: 'equilibrio',
    missions: [
      { id: 'b_n_1', emoji: '🌅', name: 'Ver nascer do sol', unit: 'vezes', baseReps: 1, points: 5 },
      { id: 'b_n_2', emoji: '🌳', name: 'Caminhar ao ar livre', unit: 'minutos', baseReps: 15, points: 4 },
      { id: 'b_n_3', emoji: '🪴', name: 'Cuidar de planta', unit: 'plantas', baseReps: 1, points: 2 },
      { id: 'b_n_4', emoji: '☀️', name: 'Ficar no sol', unit: 'minutos', baseReps: 15, points: 3 },
    ],
  },
  social: {
    emoji: '🤝', name: 'Social', color: '#ec4899',
    attribute: 'socializacao',
    missions: [
      { id: 'b_s_1', emoji: '💬', name: 'Conversar com amigo', unit: 'conversas', baseReps: 1, points: 3 },
      { id: 'b_s_2', emoji: '📞', name: 'Ligar para familiar', unit: 'chamadas', baseReps: 1, points: 5 },
      { id: 'b_s_3', emoji: '❤️', name: 'Fazer um elogio sincero', unit: 'elogios', baseReps: 1, points: 4 },
      { id: 'b_s_4', emoji: '☕', name: 'Tomar café com alguém', unit: 'encontros', baseReps: 1, points: 8 },
    ],
  },
  financas: {
    emoji: '💰', name: 'Finanças', color: '#fbbf24',
    attribute: 'disciplina',
    missions: [
      { id: 'b_f_1', emoji: '📝', name: 'Anotar gastos do dia', unit: 'dias', baseReps: 1, points: 2 },
      { id: 'b_f_2', emoji: '💵', name: 'Economizar dinheiro', unit: 'reais', baseReps: 10, points: 3 },
      { id: 'b_f_3', emoji: '📊', name: 'Organizar orçamento', unit: 'vezes', baseReps: 1, points: 5 },
      { id: 'b_f_4', emoji: '📈', name: 'Estudar investimentos', unit: 'minutos', baseReps: 20, points: 4 },
    ],
  },
  lar: {
    emoji: '🏡', name: 'Lar', color: '#f97316',
    attribute: 'organizacao',
    missions: [
      { id: 'b_l_1', emoji: '🧹', name: 'Varrer casa', unit: 'vezes', baseReps: 1, points: 3 },
      { id: 'b_l_2', emoji: '🛏️', name: 'Trocar roupa de cama', unit: 'vezes', baseReps: 1, points: 3 },
      { id: 'b_l_3', emoji: '🗑️', name: 'Tirar lixo', unit: 'vezes', baseReps: 1, points: 2 },
      { id: 'b_l_4', emoji: '🛒', name: 'Fazer compras', unit: 'vezes', baseReps: 1, points: 3 },
    ],
  },
  lazer: {
    emoji: '🎮', name: 'Lazer', color: '#8b5cf6',
    attribute: 'equilibrio',
    missions: [
      { id: 'b_lz_1', emoji: '🎬', name: 'Assistir filme', unit: 'filmes', baseReps: 1, points: 3 },
      { id: 'b_lz_2', emoji: '🎵', name: 'Ouvir música', unit: 'minutos', baseReps: 30, points: 2 },
      { id: 'b_lz_3', emoji: '🎮', name: 'Jogar videogame', unit: 'minutos', baseReps: 30, points: 2 },
    ],
  },
};