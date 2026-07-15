import { writable, derived } from 'svelte/store';

// ============================================
// PERFIL DO USUÁRIO
// ============================================

const defaultProfile = {
  // Dados pessoais
  nome: 'Aventureiro',
  peso: 70,
  altura: 170,
  idade: 25,
  sexo: 'masculino',

  // Preferências de treino
  local: 'casa',           // 'casa' | 'ar_livre' | 'academia'
  objetivo: 'melhorar_saude', // 'perder_peso' | 'ganhar_massa' | 'manter' | 'melhorar_saude'
  intensidade: 'moderada',    // 'leve' | 'moderada' | 'intensa' | 'atleta'
  tempoDisponivel: 30,        // minutos
  frequencia: '5x_semana',    // '3x_semana' | '5x_semana' | 'todos_dias'

  // Dados calculados
  imc: 0,
  aguaIdeal: 0,
  kcalDiaria: 0,
  pesoIdealMin: 0,
  pesoIdealMax: 0,

  // Estatísticas
  diasRegistrados: 0,
  treinosCompletados: 0,
  exerciciosFavoritos: [],
};

// ============================================
// STORES
// ============================================

function createProfileStore() {
  const saved = localStorage.getItem('lifeRpgProfileV4');
  const initial = saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;

  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    
    // Atualizar campo específico
    updateField: (field, value) => update(p => {
      const newProfile = { ...p, [field]: value };
      localStorage.setItem('lifeRpgProfileV4', JSON.stringify(newProfile));
      return newProfile;
    }),

    // Atualizar múltiplos campos
    updateProfile: (data) => update(p => {
      const newProfile = { ...p, ...data };
      localStorage.setItem('lifeRpgProfileV4', JSON.stringify(newProfile));
      return newProfile;
    }),

    // Calcular IMC e metas
    calculateMetrics: () => update(p => {
      const alturaM = p.altura / 100;
      p.imc = Math.round((p.peso / (alturaM * alturaM)) * 10) / 10;
      p.aguaIdeal = Math.round((p.peso * 35) / 1000 * 10) / 10;
      
      // Taxa metabólica basal (Harris-Benedict)
      if (p.sexo === 'masculino') {
        p.kcalDiaria = Math.round(88.36 + (13.4 * p.peso) + (4.8 * p.altura) - (5.7 * p.idade));
      } else {
        p.kcalDiaria = Math.round(447.6 + (9.2 * p.peso) + (3.1 * p.altura) - (4.3 * p.idade));
      }
      
      // Ajustar pelo objetivo
      switch (p.objetivo) {
        case 'perder_peso': p.kcalDiaria = Math.round(p.kcalDiaria * 0.85); break;
        case 'ganhar_massa': p.kcalDiaria = Math.round(p.kcalDiaria * 1.15); break;
      }
      
      p.pesoIdealMin = Math.round(18.5 * alturaM * alturaM);
      p.pesoIdealMax = Math.round(24.9 * alturaM * alturaM);
      
      localStorage.setItem('lifeRpgProfileV4', JSON.stringify(p));
      return p;
    }),

    // Registrar treino completado
    registerWorkout: () => update(p => {
      p.treinosCompletados++;
      p.diasRegistrados++;
      localStorage.setItem('lifeRpgProfileV4', JSON.stringify(p));
      return p;
    }),

    // Toggle favorito
    toggleFavorite: (exerciseId) => update(p => {
      const index = p.exerciciosFavoritos.indexOf(exerciseId);
      if (index === -1) {
        p.exerciciosFavoritos.push(exerciseId);
      } else {
        p.exerciciosFavoritos.splice(index, 1);
      }
      localStorage.setItem('lifeRpgProfileV4', JSON.stringify(p));
      return p;
    }),

    // Resetar perfil
    reset: () => {
      localStorage.removeItem('lifeRpgProfileV4');
      set(defaultProfile);
    },
  };
}

export const profile = createProfileStore();

// ============================================
// DERIVED STORES (somente leitura)
// ============================================

// IMC formatado
export const imcInfo = derived(profile, ($profile) => {
  const imc = $profile.imc;
  if (imc < 18.5) return { label: 'Abaixo do peso', emoji: '⚠️', color: '#f59e0b' };
  if (imc < 25) return { label: 'Peso normal', emoji: '✅', color: '#22c55e' };
  if (imc < 30) return { label: 'Sobrepeso', emoji: '🤔', color: '#f97316' };
  return { label: 'Obesidade', emoji: '😰', color: '#ef4444' };
});

// Nome do objetivo
export const objetivoInfo = derived(profile, ($profile) => {
  const map = {
    perder_peso: { name: 'Perder Peso', emoji: '📉' },
    ganhar_massa: { name: 'Ganhar Massa', emoji: '📈' },
    manter: { name: 'Manter Peso', emoji: '⚖️' },
    melhorar_saude: { name: 'Melhorar Saúde', emoji: '💚' },
  };
  return map[$profile.objetivo] || map.melhorar_saude;
});

// Nome do local
export const localInfo = derived(profile, ($profile) => {
  const map = {
    casa: { name: 'Em Casa', emoji: '🏠' },
    ar_livre: { name: 'Ar Livre', emoji: '🌳' },
    academia: { name: 'Academia', emoji: '🏋️' },
  };
  return map[$profile.local] || map.casa;
});

// Nome da intensidade
export const intensidadeInfo = derived(profile, ($profile) => {
  const map = {
    leve: { name: 'Leve', emoji: '🌱' },
    moderada: { name: 'Moderada', emoji: '🔥' },
    intensa: { name: 'Intensa', emoji: '💀' },
    atleta: { name: 'Atleta', emoji: '👑' },
  };
  return map[$profile.intensidade] || map.moderada;
});

// ============================================
// INICIALIZAR
// ============================================
profile.calculateMetrics();