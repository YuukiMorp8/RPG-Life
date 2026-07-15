// index.js - Unifica todas as missões (CORRIGIDO)
import { MENTE_MISSIONS } from './mente.js';
import { SAUDE_MISSIONS } from './saude.js';
import { BEM_ESTAR_MISSIONS } from './bemEstar.js';

export { MENTE_MISSIONS, SAUDE_MISSIONS, BEM_ESTAR_MISSIONS };

// Todos os pilares (Corpo usa o banco de exercícios já existente)
export const ALL_PILLARS = {
  corpo: { 
    name: '🏋️ Corpo', 
    emoji: '🏋️',
    color: '#ef4444',
    type: 'exercises', // usa o banco de exercícios
    desc: 'Treinos físicos gerados automaticamente'
  },
  mente: { 
    name: '🧠 Mente', 
    emoji: '🧠',
    color: '#8b5cf6',
    type: 'missions',
    missions: MENTE_MISSIONS,
    desc: 'Leitura, estudos, criatividade'
  },
  saude: { 
    name: '❤️ Saúde', 
    emoji: '❤️',
    color: '#22c55e',
    type: 'missions',
    missions: SAUDE_MISSIONS,
    desc: 'Hidratação, alimentação, sono'
  },
  bemEstar: { 
    name: '🌱 Bem-Estar', 
    emoji: '🌱',
    color: '#0ea5e9',
    type: 'missions',
    missions: BEM_ESTAR_MISSIONS,
    desc: 'Natureza, social, finanças'
  },
};

// Total de missões (sem contar exercícios)
export const TOTAL_LIFE_MISSIONS = 
  Object.values(MENTE_MISSIONS).reduce((s, c) => s + c.missions.length, 0) +
  Object.values(SAUDE_MISSIONS).reduce((s, c) => s + c.missions.length, 0) +
  Object.values(BEM_ESTAR_MISSIONS).reduce((s, c) => s + c.missions.length, 0);