// db.js - Sistema de Persistência (Salvar/Carregar estado)
const DB_VERSION = '4.8.21x26';

class Database {
  constructor() {
    this.keys = {
      game: 'lifeRpgStateV4',
      profile: 'lifeRpgProfileV4',
      attributes: 'lifeRpgAttributesV4',
      diary: 'lifeRpgDiary',
      adaptive: 'lifeRpgAdaptive',
      feedback: 'lifeRpgFeedback',
      settings: 'lifeRpgSettings',
    };
    
    // Auto-save a cada 30 segundos
    this.autoSaveInterval = setInterval(() => this.saveAll(), 30000);
    
    // Salvar antes de sair da página
    window.addEventListener('beforeunload', () => this.saveAll());
    
    // Salvar quando a página ficar oculta (mobile)
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) this.saveAll();
    });
  }

  // ==========================================
  // SALVAR
  // ==========================================
  
  save(key, data) {
    try {
      const payload = {
        data,
        version: DB_VERSION,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error('Erro ao salvar:', key, e);
      return false;
    }
  }

  // ==========================================
  // CARREGAR
  // ==========================================
  
  load(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      
      const payload = JSON.parse(raw);
      
      // Verificar versão (migração futura)
      if (payload.version !== DB_VERSION) {
        console.warn(`Versão diferente: ${payload.version} vs ${DB_VERSION}`);
      }
      
      return payload.data;
    } catch (e) {
      console.error('Erro ao carregar:', key, e);
      return defaultValue;
    }
  }

  // ==========================================
  // SALVAR TUDO (chamado automaticamente)
  // ==========================================
  
  saveAll() {
    // Importações dinâmicas para evitar circular dependency
    try {
      // Game State
      const gameState = this.collectGameState();
      if (gameState) this.save(this.keys.game, gameState);
      
      // Profile
      const profileState = this.collectProfileState();
      if (profileState) this.save(this.keys.profile, profileState);
      
      // Attributes
      const attrState = this.collectAttributesState();
      if (attrState) this.save(this.keys.attributes, attrState);
      
      // Diary
      const diaryState = this.collectDiaryState();
      if (diaryState) this.save(this.keys.diary, diaryState);
      
      // Adaptive
      const adaptiveState = this.collectAdaptiveState();
      if (adaptiveState) this.save(this.keys.adaptive, adaptiveState);
      
      // Settings
      const settingsState = this.collectSettingsState();
      if (settingsState) this.save(this.keys.settings, settingsState);
      
      console.log('💾 Estado salvo!', new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Erro ao salvar tudo:', e);
    }
  }

  // ==========================================
  // COLETAR ESTADOS (com getters dinâmicos)
  // ==========================================
  
  collectGameState() {
    try {
      const { get } = require('svelte/store');
      // Tenta importar dinamicamente
      const stores = window.__lifeRpgStores;
      if (!stores) return null;
      
      return {
        totalXP: get(stores.totalXP),
        availablePoints: get(stores.availablePoints),
        totalEarned: get(stores.totalEarned),
        totalSpent: get(stores.totalSpent),
        streakDays: get(stores.streakDays),
        maxStreak: get(stores.maxStreak),
        completedMissions: get(stores.completedToday),
        freeMissions: get(stores.freeMissionsToday),
        missionMultiplier: get(stores.missionMultiplier),
        timestamp: Date.now(),
      };
    } catch (e) {
      return null;
    }
  }

  collectProfileState() {
    try {
      const raw = localStorage.getItem(this.keys.profile);
      if (raw) return JSON.parse(raw).data;
      return null;
    } catch (e) {
      return null;
    }
  }

  collectAttributesState() {
    try {
      const raw = localStorage.getItem(this.keys.attributes);
      if (raw) return JSON.parse(raw).data;
      return null;
    } catch (e) {
      return null;
    }
  }

  collectDiaryState() {
    try {
      const raw = localStorage.getItem(this.keys.diary);
      if (raw) return JSON.parse(raw).data;
      return null;
    } catch (e) {
      return null;
    }
  }

  collectAdaptiveState() {
    try {
      const raw = localStorage.getItem(this.keys.adaptive);
      if (raw) return JSON.parse(raw).data;
      return null;
    } catch (e) {
      return null;
    }
  }

  collectSettingsState() {
    return {
      notifMissao: localStorage.getItem('notifMissao'),
      notifStreak: localStorage.getItem('notifStreak'),
      notifAgua: localStorage.getItem('notifAgua'),
      notifNoite: localStorage.getItem('notifNoite'),
      horarioMissao: localStorage.getItem('horarioMissao'),
      horarioNoite: localStorage.getItem('horarioNoite'),
    };
  }

  // ==========================================
  // EXPORTAR / IMPORTAR (Backup)
  // ==========================================
  
  exportAll() {
    const backup = {};
    Object.entries(this.keys).forEach(([name, key]) => {
      backup[name] = localStorage.getItem(key);
    });
    return JSON.stringify(backup, null, 2);
  }

  importAll(jsonStr) {
    try {
      const backup = JSON.parse(jsonStr);
      Object.entries(backup).forEach(([name, value]) => {
        if (value && this.keys[name]) {
          localStorage.setItem(this.keys[name], value);
        }
      });
      return true;
    } catch (e) {
      console.error('Erro ao importar:', e);
      return false;
    }
  }

  // ==========================================
  // LIMPAR
  // ==========================================
  
  clearAll() {
    Object.values(this.keys).forEach(key => localStorage.removeItem(key));
    console.log('🗑️ Todos os dados foram limpos');
  }
}

export const DB = new Database();