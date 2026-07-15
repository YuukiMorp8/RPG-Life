// classificacao.js - Tipos, Músculos, Equipamentos e Configurações

export const TIPOS_EXERCICIO = {
  forca: { name: 'Força', emoji: '💪', desc: 'Exercícios de resistência muscular' },
  cardio: { name: 'Cardio', emoji: '🏃', desc: 'Exercícios aeróbicos' },
  core: { name: 'Core', emoji: '🎯', desc: 'Fortalecimento do abdômen e lombar' },
  mobilidade: { name: 'Mobilidade', emoji: '🤸', desc: 'Alongamento e flexibilidade' },
  equilibrio: { name: 'Equilíbrio', emoji: '🧘', desc: 'Estabilidade e controle corporal' },
  explosao: { name: 'Explosão', emoji: '🔥', desc: 'Movimentos pliométricos' },
  isometria: { name: 'Isometria', emoji: '🛑', desc: 'Contração sem movimento' },
};

export const GRUPOS_MUSCULARES = {
  peito: { name: 'Peito', emoji: '🦾' },
  peito_superior: { name: 'Peito Superior', emoji: '🦾' },
  costas: { name: 'Costas', emoji: '🔙' },
  costas_inferior: { name: 'Costas Inferior', emoji: '🔙' },
  ombro: { name: 'Ombro', emoji: '💪' },
  ombro_frontal: { name: 'Ombro Frontal', emoji: '💪' },
  ombro_lateral: { name: 'Ombro Lateral', emoji: '💪' },
  biceps: { name: 'Bíceps', emoji: '💪' },
  triceps: { name: 'Tríceps', emoji: '💪' },
  antebraco: { name: 'Antebraço', emoji: '💪' },
  quadriceps: { name: 'Quadríceps', emoji: '🦵' },
  posterior: { name: 'Posterior', emoji: '🦵' },
  gluteo: { name: 'Glúteo', emoji: '🍑' },
  panturrilha: { name: 'Panturrilha', emoji: '🦶' },
  adutor: { name: 'Adutor', emoji: '🦵' },
  abdutor: { name: 'Abdutor', emoji: '🦵' },
  abdomen: { name: 'Abdômen', emoji: '🎯' },
  obliquo: { name: 'Oblíquo', emoji: '🎯' },
  lombar: { name: 'Lombar', emoji: '🔙' },
  full_body: { name: 'Corpo Inteiro', emoji: '🔥' },
  cardio: { name: 'Cardiovascular', emoji: '❤️' },
};

export const EQUIPAMENTOS = {
  nenhum: { name: 'Sem equipamento', emoji: '🤸' },
  barra: { name: 'Barra fixa', emoji: '🏋️' },
  halteres: { name: 'Halteres', emoji: '🏋️' },
  kettlebell: { name: 'Kettlebell', emoji: '🔔' },
  elastico: { name: 'Elástico', emoji: '🪢' },
  banco: { name: 'Banco', emoji: '🪑' },
  corda: { name: 'Corda', emoji: '🪀' },
  maquina: { name: 'Máquina', emoji: '🏗️' },
  barra_olimpica: { name: 'Barra Olímpica', emoji: '🏋️' },
  cadeira: { name: 'Cadeira', emoji: '🪑' },
  parede: { name: 'Parede', emoji: '🧱' },
  escada: { name: 'Escada', emoji: '🪜' },
  colchonete: { name: 'Colchonete', emoji: '🟩' },
};

export const LOCAIS = {
  casa: { name: 'Em Casa', emoji: '🏠' },
  ar_livre: { name: 'Ar Livre', emoji: '🌳' },
  academia: { name: 'Academia', emoji: '🏋️' },
  qualquer: { name: 'Qualquer Lugar', emoji: '🌍' },
};

export const IMPACTO = {
  baixo: { name: 'Baixo Impacto', emoji: '🟢', desc: 'Seguro para articulações' },
  medio: { name: 'Médio Impacto', emoji: '🟡', desc: 'Moderado nas articulações' },
  alto: { name: 'Alto Impacto', emoji: '🔴', desc: 'Exige cuidado articular' },
};

// ==========================================
// CONFIGURAÇÕES DE OBJETIVO
// ==========================================
export const GOAL_CONFIG = {
  perder_peso: {
    name: 'Perder Peso', emoji: '📉',
    focusOn: ['cardio', 'full_body'],
    repsRange: [15, 25], setsRange: [3, 4], restBetweenSets: 30,
  },
  ganhar_massa: {
    name: 'Ganhar Massa', emoji: '📈',
    focusOn: ['push', 'pull', 'pernas'],
    repsRange: [6, 12], setsRange: [3, 5], restBetweenSets: 90,
  },
  manter: {
    name: 'Manter Peso', emoji: '⚖️',
    focusOn: ['all'],
    repsRange: [10, 15], setsRange: [3, 3], restBetweenSets: 60,
  },
  melhorar_saude: {
    name: 'Melhorar Saúde', emoji: '💚',
    focusOn: ['all'],
    repsRange: [8, 12], setsRange: [2, 3], restBetweenSets: 45,
  },
};

// ==========================================
// CONFIGURAÇÕES DE INTENSIDADE
// ==========================================
export const INTENSITY_CONFIG = {
  leve: {
    name: 'Leve', emoji: '🌱',
    repsMultiplier: 0.6, setsMultiplier: 0.6,
    desc: 'Ideal para iniciantes ou dias de descanso ativo',
  },
  moderada: {
    name: 'Moderada', emoji: '🔥',
    repsMultiplier: 1.0, setsMultiplier: 1.0,
    desc: 'Bom para manutenção e saúde geral',
  },
  intensa: {
    name: 'Intensa', emoji: '💀',
    repsMultiplier: 1.5, setsMultiplier: 1.3,
    desc: 'Para quem quer resultado rápido',
  },
  atleta: {
    name: 'Atleta', emoji: '👑',
    repsMultiplier: 2.0, setsMultiplier: 1.5,
    desc: 'Nível competitivo, alto volume',
  },
};

// ==========================================
// DIVISÃO SEMANAL
// ==========================================
export const WEEKLY_SPLITS = {
  '3x_semana': ['Full Body', 'Full Body', 'Full Body'],
  '5x_semana': ['Push', 'Pull', 'Legs', 'Upper', 'Lower'],
  todos_dias: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs', 'Descanso Ativo'],
};