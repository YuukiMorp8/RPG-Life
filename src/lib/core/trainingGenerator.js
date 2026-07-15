// trainingGenerator.js - Gerador de Treinos com Sistema Anti-Repetição
import { ALL_EXERCISES } from '../db/exercises/index.js';
import { INTENSITY_CONFIG, GOAL_CONFIG, WEEKLY_SPLITS } from '../db/exercises/classificacao.js';

// Histórico de uso dos exercícios
let exerciseHistory = loadHistory();

function loadHistory() {
  const saved = localStorage.getItem('exerciseHistory');
  return saved ? JSON.parse(saved) : {};
}

function saveHistory() {
  localStorage.setItem('exerciseHistory', JSON.stringify(exerciseHistory));
}

// ==========================================
// SISTEMA DE PONTUAÇÃO ANTI-REPETIÇÃO
// ==========================================
function calculateScore(exercise, profile) {
  const history = exerciseHistory[exercise.id] || {
    timesDone: 0,
    lastDone: null,
    favorite: false,
  };

  let score = Math.random() * 50; // Fator aleatório (0-50)

  // ⭐ BÔNUS: Nunca foi feito
  if (history.timesDone === 0) score += 40;

  // ⭐ BÔNUS: Faz muitos dias (quanto mais dias, mais pontos)
  if (history.lastDone) {
    const daysSince = (Date.now() - history.lastDone) / (1000 * 60 * 60 * 24);
    score += Math.min(daysSince * 5, 35); // Máximo 35 pontos
  }

  // ⭐ BÔNUS: Poucas vezes usado (menos é melhor)
  score += Math.max(0, 30 - history.timesDone * 3);

  // ❌ PENALIDADE: Feito ontem
  if (history.lastDone) {
    const daysSince = (Date.now() - history.lastDone) / (1000 * 60 * 60 * 24);
    if (daysSince < 1) score -= 50;
  }

  // ❌ PENALIDADE: Já apareceu muitas vezes na semana
  const thisWeek = getThisWeekExercises();
  const weekCount = thisWeek.filter(id => id === exercise.id).length;
  score -= weekCount * 15;

  // ⭐ BÔNUS: Favorito do usuário
  if (history.favorite) score += 20;

  // ⭐ BÔNUS: Dificuldade adequada ao nível
  const profileDifficulty = profile?.nivel || 2;
  const diffMatch = 15 - Math.abs(exercise.difficulty - profileDifficulty) * 5;
  score += Math.max(0, diffMatch);

  return score;
}

function getThisWeekExercises() {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const ids = [];
  Object.entries(exerciseHistory).forEach(([id, data]) => {
    if (data.lastDone && data.lastDone > weekAgo) {
      for (let i = 0; i < data.timesDone; i++) {
        ids.push(id);
      }
    }
  });
  return ids;
}

// ==========================================
// GERADOR DE TREINO
// ==========================================
export function generateWorkout(profile = {}) {
  const {
    local = 'casa',
    objetivo = 'melhorar_saude',
    intensidade = 'moderada',
    tempoDisponivel = 30, // minutos
    musculosFoco = [], // grupos musculares específicos (vazio = todos)
  } = profile;

  const goalConfig = GOAL_CONFIG[objetivo] || GOAL_CONFIG.melhorar_saude;
  const intensityConfig = INTENSITY_CONFIG[intensidade] || INTENSITY_CONFIG.moderada;

  // Filtrar exercícios pelo local
  const localExercises = ALL_EXERCISES[local] || ALL_EXERCISES.casa;

  // Lista plana de todos os exercícios disponíveis
  let availableExercises = [];
  Object.entries(localExercises).forEach(([category, exercises]) => {
    exercises.forEach(ex => {
      availableExercises.push({ ...ex, category });
    });
  });

  // Filtrar por foco do objetivo
  if (goalConfig.focusOn && !goalConfig.focusOn.includes('all')) {
    availableExercises = availableExercises.filter(ex =>
      goalConfig.focusOn.some(focus =>
        ex.category.includes(focus) ||
        (ex.muscle && ex.muscle.some(m => m.includes(focus)))
      )
    );
  }

  // Filtrar por músculos específicos (se definido)
  if (musculosFoco.length > 0) {
    availableExercises = availableExercises.filter(ex =>
      ex.muscle && ex.muscle.some(m => musculosFoco.includes(m))
    );
  }

  // Aplicar sistema anti-repetição
  availableExercises.forEach(ex => {
    ex._score = calculateScore(ex, profile);
  });

  // Ordenar por pontuação (maior = melhor)
  availableExercises.sort((a, b) => b._score - a._score);

  // Selecionar exercícios que cabem no tempo
  let selectedExercises = [];
  let totalTime = 0;
  const warmupTime = Math.min(5, tempoDisponivel * 0.15); // 15% para aquecimento
  const mainTime = tempoDisponivel - warmupTime;

  // Adicionar aquecimento
  if (warmupTime >= 3) {
    const warmup = selectWarmup(local, warmupTime);
    if (warmup) {
      selectedExercises.push({ ...warmup, isWarmup: true });
      totalTime += warmup.tempoMedio / 60;
    }
  }

  // Selecionar exercícios principais
  for (const ex of availableExercises) {
    if (totalTime >= mainTime) break;

    const sets = Math.round(ex.baseSets * intensityConfig.setsMultiplier);
    const reps = Math.round(ex.baseReps * intensityConfig.repsMultiplier);
    const exTime = (ex.tempoMedio * sets) / 60; // converter para minutos

    if (totalTime + exTime <= mainTime) {
      selectedExercises.push({
        ...ex,
        sets,
        reps,
        intensity: intensidade,
        points: Math.round(ex.caloriesPerMin * exTime * 0.3), // ~30% das kcal viram pontos
        estimatedKcal: Math.round(ex.caloriesPerMin * exTime),
      });
      totalTime += exTime;

      // Registrar no histórico
      registerExerciseUse(ex.id);
    }
  }

  // Adicionar alongamento final se tiver tempo
  if (totalTime + 5 <= tempoDisponivel) {
    const cooldown = selectCooldown(local, Math.min(5, tempoDisponivel - totalTime));
    if (cooldown) {
      selectedExercises.push({ ...cooldown, isCooldown: true });
    }
  }

  return {
    exercises: selectedExercises,
    totalTime: Math.round(totalTime),
    totalKcal: selectedExercises.reduce((sum, ex) => sum + (ex.estimatedKcal || 0), 0),
    totalPoints: selectedExercises.reduce((sum, ex) => sum + (ex.points || 0), 0),
    intensity: intensidade,
    local,
  };
}

function selectWarmup(local, time) {
  const warmupExercises = [
    { name: 'Polichinelos', emoji: '⭐', tempoMedio: 120, caloriesPerMin: 8, sets: 1, reps: 30 },
    { name: 'Corrida Parada', emoji: '🏃', tempoMedio: 180, caloriesPerMin: 8, sets: 1, reps: 1 },
    { name: 'Rotação de Braços', emoji: '🔄', tempoMedio: 60, caloriesPerMin: 3, sets: 1, reps: 10 },
    { name: 'Alongamento Dinâmico', emoji: '🤸', tempoMedio: 120, caloriesPerMin: 3, sets: 1, reps: 1 },
  ];
  return warmupExercises[Math.floor(Math.random() * warmupExercises.length)];
}

function selectCooldown(local, time) {
  const cooldownExercises = [
    { name: 'Alongamento Posterior', emoji: '🧘', tempoMedio: 180, caloriesPerMin: 2, sets: 1, reps: 1 },
    { name: 'Child Pose', emoji: '🧘', tempoMedio: 120, caloriesPerMin: 1, sets: 1, reps: 1 },
    { name: 'Respiração Profunda', emoji: '🌬️', tempoMedio: 120, caloriesPerMin: 1, sets: 1, reps: 1 },
  ];
  return cooldownExercises[Math.floor(Math.random() * cooldownExercises.length)];
}

function registerExerciseUse(exerciseId) {
  if (!exerciseHistory[exerciseId]) {
    exerciseHistory[exerciseId] = { timesDone: 0, lastDone: null, favorite: false };
  }
  exerciseHistory[exerciseId].timesDone++;
  exerciseHistory[exerciseId].lastDone = Date.now();
  saveHistory();
}

// ==========================================
// GERAR ROTINA SEMANAL
// ==========================================
export function generateWeeklyRoutine(profile = {}) {
  const { frequencia = '5x_semana' } = profile;
  const split = WEEKLY_SPLITS[frequencia] || WEEKLY_SPLITS['5x_semana'];

  const muscleMap = {
    'Push': ['peito', 'ombro', 'triceps'],
    'Pull': ['costas', 'biceps'],
    'Legs': ['quadriceps', 'posterior', 'gluteo'],
    'Upper': ['peito', 'costas', 'ombro', 'biceps', 'triceps'],
    'Lower': ['quadriceps', 'posterior', 'gluteo', 'panturrilha'],
    'Full Body': [],
    'Descanso Ativo': [],
  };

  return split.map(dayName => {
    const muscles = muscleMap[dayName] || [];
    if (dayName === 'Descanso Ativo') {
      return {
        day: dayName,
        isRest: true,
        exercises: [],
      };
    }
    return {
      day: dayName,
      muscles,
      workout: generateWorkout({ ...profile, musculosFoco: muscles }),
    };
  });
}

// ==========================================
// MARCAR FAVORITO
// ==========================================
export function toggleFavorite(exerciseId) {
  if (!exerciseHistory[exerciseId]) {
    exerciseHistory[exerciseId] = { timesDone: 0, lastDone: null, favorite: false };
  }
  exerciseHistory[exerciseId].favorite = !exerciseHistory[exerciseId].favorite;
  saveHistory();
  return exerciseHistory[exerciseId].favorite;
}

// ==========================================
// ESTATÍSTICAS
// ==========================================
export function getExerciseStats() {
  const stats = {
    totalExercisesDone: 0,
    mostUsed: null,
    neverDone: [],
    favorites: [],
  };

  let maxTimes = 0;
  Object.entries(exerciseHistory).forEach(([id, data]) => {
    stats.totalExercisesDone += data.timesDone;
    if (data.timesDone > maxTimes) {
      maxTimes = data.timesDone;
      stats.mostUsed = { id, ...data };
    }
    if (data.timesDone === 0) stats.neverDone.push(id);
    if (data.favorite) stats.favorites.push(id);
  });

  return stats;
}