// saude.js - Missões do Pilar Saúde
export const SAUDE_MISSIONS = {
  hidratacao: {
    emoji: '💧', name: 'Hidratação', color: '#0ea5e9',
    attribute: 'vitalidade',
    missions: [
      { id: 's_h_1', emoji: '💧', name: 'Beber água', unit: 'ml', baseReps: 300, points: 1 },
      { id: 's_h_2', emoji: '💧', name: 'Beber água', unit: 'ml', baseReps: 500, points: 2 },
      { id: 's_h_3', emoji: '💧', name: 'Completar meta diária', unit: 'meta', baseReps: 1, points: 5 },
    ],
  },
  alimentacao: {
    emoji: '🍎', name: 'Alimentação', color: '#22c55e',
    attribute: 'vitalidade',
    missions: [
      { id: 's_a_1', emoji: '🍎', name: 'Comer fruta', unit: 'frutas', baseReps: 1, points: 2 },
      { id: 's_a_2', emoji: '🥗', name: 'Comer verdura', unit: 'porções', baseReps: 1, points: 2 },
      { id: 's_a_3', emoji: '🥩', name: 'Comer proteína', unit: 'porções', baseReps: 1, points: 3 },
      { id: 's_a_4', emoji: '🥤', name: 'Evitar refrigerante', unit: 'dia', baseReps: 1, points: 4 },
      { id: 's_a_5', emoji: '🍳', name: 'Preparar refeição', unit: 'refeições', baseReps: 1, points: 4 },
    ],
  },
  sono: {
    emoji: '😴', name: 'Sono', color: '#6366f1',
    attribute: 'energia',
    missions: [
      { id: 's_s_1', emoji: '😴', name: 'Dormir 7h+', unit: 'noites', baseReps: 1, points: 5 },
      { id: 's_s_2', emoji: '🌙', name: 'Dormir antes das 23h', unit: 'noites', baseReps: 1, points: 5 },
      { id: 's_s_3', emoji: '📵', name: 'Sem celular antes de dormir', unit: 'noites', baseReps: 1, points: 4 },
    ],
  },
  higiene: {
    emoji: '🛁', name: 'Higiene', color: '#14b8a6',
    attribute: 'disciplina',
    missions: [
      { id: 's_hi_1', emoji: '🛁', name: 'Tomar banho', unit: 'banhos', baseReps: 1, points: 1 },
      { id: 's_hi_2', emoji: '🪥', name: 'Escovar dentes', unit: 'vezes', baseReps: 2, points: 1 },
      { id: 's_hi_3', emoji: '🧵', name: 'Passar fio dental', unit: 'vezes', baseReps: 1, points: 2 },
      { id: 's_hi_4', emoji: '🧴', name: 'Lavar o rosto', unit: 'vezes', baseReps: 2, points: 1 },
    ],
  },
  saudeMental: {
    emoji: '🧠', name: 'Saúde Mental', color: '#a855f7',
    attribute: 'equilibrio',
    missions: [
      { id: 's_sm_1', emoji: '🧘', name: 'Meditar', unit: 'minutos', baseReps: 5, points: 3 },
      { id: 's_sm_2', emoji: '🌬️', name: 'Respirar profundamente', unit: 'minutos', baseReps: 3, points: 2 },
      { id: 's_sm_3', emoji: '🙏', name: 'Escrever gratidão', unit: 'entradas', baseReps: 1, points: 3 },
      { id: 's_sm_4', emoji: '📵', name: 'Pausa de redes sociais', unit: 'minutos', baseReps: 30, points: 3 },
    ],
  },
  organizacao: {
    emoji: '🏠', name: 'Organização', color: '#f59e0b',
    attribute: 'disciplina',
    missions: [
      { id: 's_o_1', emoji: '🛏️', name: 'Arrumar cama', unit: 'vezes', baseReps: 1, points: 1 },
      { id: 's_o_2', emoji: '🗂️', name: 'Organizar mesa', unit: 'vezes', baseReps: 1, points: 2 },
      { id: 's_o_3', emoji: '🧹', name: 'Limpar cômodo', unit: 'cômodos', baseReps: 1, points: 3 },
      { id: 's_o_4', emoji: '🍳', name: 'Lavar louça', unit: 'vezes', baseReps: 1, points: 2 },
      { id: 's_o_5', emoji: '👕', name: 'Guardar roupas', unit: 'vezes', baseReps: 1, points: 2 },
    ],
  },
};