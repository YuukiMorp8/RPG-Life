import { writable, derived } from 'svelte/store';

// ============================================
// ESTADO DO JOGO
// ============================================

export const currentTab = writable('dashboard');
export { profile } from './profile.js';

export const totalXP = writable(0);
export const availablePoints = writable(0);
export const totalEarned = writable(0);
export const totalSpent = writable(0);

export const streakDays = writable(0);
export const maxStreak = writable(0);

// Nível
export const playerLevel = derived(totalXP, ($totalXP) => {
  const XP_PER_LEVEL = 100;
  return Math.floor($totalXP / XP_PER_LEVEL) + 1;
});

export const levelName = derived(playerLevel, ($level) => {
  const names = ['Iniciante', 'Aprendiz', 'Guerreiro', 'Veterano', 'Mestre', 'Lenda', 'Herói', 'Deus'];
  return names[Math.min($level - 1, names.length - 1)];
});

export const xpProgress = derived(totalXP, ($totalXP) => {
  const XP_PER_LEVEL = 100;
  return Math.round(($totalXP % XP_PER_LEVEL) / XP_PER_LEVEL * 100);
});

// XP para próximo nível
export const xpToNext = derived(totalXP, ($totalXP) => {
  const XP_PER_LEVEL = 100;
  return XP_PER_LEVEL - ($totalXP % XP_PER_LEVEL);
});

// Missões
export const completedToday = writable([]);
export const freeMissionsToday = writable({});
export const missionMultiplier = writable(1);
export const activeTimer = writable(null);

// ============================================
// SISTEMA DE LEVEL UP
// ============================================

export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: 'Iniciante' },
  { level: 2, xp: 100, title: 'Aprendiz' },
  { level: 3, xp: 250, title: 'Guerreiro' },
  { level: 5, xp: 500, title: 'Veterano' },
  { level: 8, xp: 1000, title: 'Mestre' },
  { level: 12, xp: 2000, title: 'Lenda' },
  { level: 15, xp: 3500, title: 'Herói' },
  { level: 20, xp: 5000, title: 'Deus' },
];

let lastLevel = 1;

// Detectar Level Up
totalXP.subscribe(xp => {
  let newLevel = 1;
  let newTitle = 'Iniciante';
  
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.xp) {
      newLevel = threshold.level;
      newTitle = threshold.title;
    }
  }
  
  if (newLevel > lastLevel) {
    lastLevel = newLevel;
    console.log(`🎉 LEVEL UP! ${newTitle} (Nível ${newLevel})!`);
    // Guardar no localStorage para mostrar toast
    localStorage.setItem('pendingLevelUp', JSON.stringify({ level: newLevel, title: newTitle }));
  }
});

// Verificar se há level up pendente
export function checkLevelUp() {
  const pending = localStorage.getItem('pendingLevelUp');
  if (pending) {
    const data = JSON.parse(pending);
    localStorage.removeItem('pendingLevelUp');
    return data;
  }
  return null;
}

// Intensidades bloqueadas
export const isIntensaUnlocked = derived(playerLevel, ($level) => $level >= 5);
export const isAtletaUnlocked = derived(playerLevel, ($level) => $level >= 10);

// ============================================
// AÇÕES
// ============================================

export function addPoints(amount) {
  availablePoints.update(n => n + amount);
  totalEarned.update(n => n + amount);
  totalXP.update(n => n + amount);
}

export function spendPoints(amount) {
  availablePoints.update(n => Math.max(0, n - amount));
  totalSpent.update(n => n + amount);
}

export function completeMission(missionId) {
  completedToday.update(arr => [...arr, missionId]);
}

export function addFreeMission(missionId) {
  freeMissionsToday.update(obj => ({
    ...obj,
    [missionId]: (obj[missionId] || 0) + 1
  }));
}

export function updateStreak(days) {
  streakDays.set(days);
  if (days > 0) {
    maxStreak.update(max => Math.max(max, days));
  }
}

// ============================================
// LOCAL STORAGE
// ============================================

export function loadGame() {
  const saved = localStorage.getItem('lifeRpgStateV4');
  if (!saved) return;
  
  try {
    const data = JSON.parse(saved);
    totalXP.set(data.totalXP || 0);
    availablePoints.set(data.availablePoints || 0);
    totalEarned.set(data.totalEarned || 0);
    totalSpent.set(data.totalSpent || 0);
    streakDays.set(data.streakDays || 0);
    maxStreak.set(data.maxStreak || 0);
    
    const today = getToday();
    completedToday.set(data.completedMissions?.[today] || []);
    freeMissionsToday.set(data.freeMissions?.[today] || {});
    
    // Inicializar lastLevel
    const xp = data.totalXP || 0;
    for (const threshold of LEVEL_THRESHOLDS) {
      if (xp >= threshold.xp) lastLevel = threshold.level;
    }
  } catch (e) {
    console.error('Erro ao carregar:', e);
  }
}

export function saveGame(state) {
  const today = getToday();
  const data = {
    totalXP: state.totalXP,
    availablePoints: state.availablePoints,
    totalEarned: state.totalEarned,
    totalSpent: state.totalSpent,
    streakDays: state.streakDays,
    maxStreak: state.maxStreak,
    completedMissions: { [today]: state.completedToday },
    freeMissions: { [today]: state.freeMissionsToday },
  };
  localStorage.setItem('lifeRpgStateV4', JSON.stringify(data));
}

// ============================================
// UTILITÁRIOS
// ============================================

export function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getLevelName(level) {
  const names = ['Iniciante', 'Aprendiz', 'Guerreiro', 'Veterano', 'Mestre', 'Lenda', 'Herói', 'Deus'];
  return names[Math.min(level - 1, names.length - 1)];
}