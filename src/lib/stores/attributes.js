import { writable, derived } from 'svelte/store';

// ============================================
// ATRIBUTOS DO PERSONAGEM
// ============================================

const defaultAttributes = {
  vigor: { xp: 0, level: 1, name: 'Vigor', emoji: '❤️', color: '#ef4444', desc: 'Força física e resistência' },
  mente: { xp: 0, level: 1, name: 'Mente', emoji: '🧠', color: '#8b5cf6', desc: 'Inteligência e clareza mental' },
  disciplina: { xp: 0, level: 1, name: 'Disciplina', emoji: '🛡️', color: '#f59e0b', desc: 'Organização e consistência' },
  alma: { xp: 0, level: 1, name: 'Alma', emoji: '💧', color: '#22c55e', desc: 'Bem-estar e equilíbrio' },
};

const XP_PER_LEVEL = 50;
const MAX_LEVEL = 10;

function createAttributesStore() {
  const saved = localStorage.getItem('lifeRpgAttributesV4');
  const initial = saved ? { ...defaultAttributes, ...JSON.parse(saved) } : defaultAttributes;
  
  // Recalcular níveis
  Object.keys(initial).forEach(key => {
    initial[key].level = Math.min(Math.floor((initial[key].xp || 0) / XP_PER_LEVEL) + 1, MAX_LEVEL);
  });

  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    
    // Adicionar XP a um atributo
    addXP: (attribute, amount) => update(attrs => {
      if (!attrs[attribute]) return attrs;
      
      const before = attrs[attribute].level;
      attrs[attribute].xp = (attrs[attribute].xp || 0) + amount;
      attrs[attribute].level = Math.min(Math.floor(attrs[attribute].xp / XP_PER_LEVEL) + 1, MAX_LEVEL);
      
      localStorage.setItem('lifeRpgAttributesV4', JSON.stringify(attrs));
      
      // Verificar level up
      if (attrs[attribute].level > before) {
        const attr = attrs[attribute];
        // Guardar para notificação
        localStorage.setItem('pendingAttrLevelUp', JSON.stringify({
          emoji: attr.emoji,
          name: attr.name,
          level: attr.level
        }));
      }
      
      return attrs;
    }),
    
    // Progresso para próximo nível (0-100)
    getProgress: (attribute) => {
      let progress = 0;
      subscribe(attrs => {
        if (attrs[attribute]) {
          progress = Math.round(((attrs[attribute].xp || 0) % XP_PER_LEVEL) / XP_PER_LEVEL * 100);
        }
      })();
      return progress;
    },
    
    // Verificar level up pendente
    checkLevelUp: () => {
      const pending = localStorage.getItem('pendingAttrLevelUp');
      if (pending) {
        const data = JSON.parse(pending);
        localStorage.removeItem('pendingAttrLevelUp');
        return data;
      }
      return null;
    },
    
    // Resetar
    reset: () => {
      localStorage.removeItem('lifeRpgAttributesV4');
      set(defaultAttributes);
    },
  };
}

export const attributes = createAttributesStore();

// Derived store: atributo mais forte
export const dominantAttribute = derived(attributes, ($attrs) => {
  let max = null;
  Object.entries($attrs).forEach(([key, attr]) => {
    if (!max || attr.level > max.level) max = { key, ...attr };
  });
  return max;
});

// Derived store: atributo mais fraco
export const weakestAttribute = derived(attributes, ($attrs) => {
  let min = null;
  Object.entries($attrs).forEach(([key, attr]) => {
    if (!min || attr.level < min.level) min = { key, ...attr };
  });
  return min;
});