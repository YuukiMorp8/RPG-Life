// notifications.js - Sistema de Notificações com OneSignal
import { get } from 'svelte/store';
import { streakDays, completedToday } from '../stores/game.js';

class NotificationSystem {
  constructor() {
    this.intervals = [];
    this.oneSignalReady = false;
    this.oneSignal = null;
    this.init();
  }

  async init() {
    // Aguardar OneSignal carregar
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async (OneSignal) => {
        this.oneSignal = OneSignal;
        this.oneSignalReady = true;
        console.log('🔔 Life RPG + OneSignal conectado!');
      });
    }
    
    // Iniciar agendamentos
    setTimeout(() => this.scheduleAll(), 2000);
  }

  // Enviar notificação push
  async sendPush(title, body, url = '/') {
    if (!this.oneSignalReady || !this.oneSignal) {
      console.log('⚠️ OneSignal não está pronto, usando fallback local');
      this.sendLocal(title, body);
      return;
    }

    try {
      await this.oneSignal.notifications.send({
        include_external_user_ids: ["life-rpg-user"],
        headings: { en: title, pt: title },
        contents: { en: body, pt: body },
        url: window.location.origin + url,
        chrome_web_icon: '⚔️',
        chrome_web_badge: '⚔️',
        priority: 10,
      });
      console.log('✅ Push enviado:', title);
    } catch (e) {
      console.log('❌ Push falhou, usando local:', e.message);
      this.sendLocal(title, body);
    }
  }

  // Fallback: notificação local
  sendLocal(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '⚔️',
        badge: '⚔️',
        vibrate: [200, 100, 200],
        tag: 'life-rpg',
      });
    }
  }

  // Agendar todas as notificações
  scheduleAll() {
    this.clearAll();
    
    if (this.isEnabled('notifMissao')) {
      this.scheduleDaily('missao', this.getTime('horarioMissao', '09:00'), () => {
        this.sendPush(
          '📋 Missões Pendentes',
          'Complete suas missões de hoje e ganhe pontos! Clique para abrir o app.'
        );
      });
    }
    
    if (this.isEnabled('notifAgua')) {
      [10, 13, 16, 19].forEach(hour => {
        this.scheduleDaily(`agua_${hour}`, `${hour}:00`, () => {
          this.sendPush(
            '💧 Hora de beber água!',
            'Um copo de água agora faz bem! 💙'
          );
        });
      });
    }
    
    if (this.isEnabled('notifStreak')) {
      this.scheduleDaily('streak', '21:00', () => {
        const streak = get(streakDays);
        if (streak >= 3) {
          this.sendPush(
            '🔥 Streak de ' + streak + ' dias!',
            'Não perca sua sequência! Complete uma missão hoje.'
          );
        }
      });
    }
    
    if (this.isEnabled('notifNoite')) {
      this.scheduleDaily('noite', this.getTime('horarioNoite', '20:00'), () => {
        const completed = get(completedToday);
        const count = completed.length;
        
        if (count === 0) {
          this.sendPush(
            '🌙 Fim do dia',
            'Nenhuma missão hoje. Amanhã é um novo dia! 🌟'
          );
        } else {
          this.sendPush(
            '🌙 Resumo do Dia',
            `Hoje: ${count} missões completadas! ⭐ Bom descanso!`
          );
        }
      });
    }
  }

  scheduleDaily(id, timeStr, callback) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    const checkAndSchedule = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);
      
      let delay = target - now;
      if (delay < 0) delay += 24 * 60 * 60 * 1000;
      
      const timeout = setTimeout(() => {
        callback();
        checkAndSchedule();
      }, delay);
      
      this.intervals.push(timeout);
    };
    
    checkAndSchedule();
  }

  isEnabled(key) {
    return localStorage.getItem(key) !== 'false';
  }

  getTime(key, defaultTime) {
    return localStorage.getItem(key) || defaultTime;
  }

  clearAll() {
    this.intervals.forEach(t => clearTimeout(t));
    this.intervals = [];
  }

  reschedule() {
    this.clearAll();
    this.scheduleAll();
  }

  // Solicitar permissão
  async requestPermission() {
    if (!this.oneSignalReady || !this.oneSignal) return;
    
    try {
      await this.oneSignal.notifications.requestPermission();
      console.log('✅ Permissão concedida!');
    } catch (e) {
      console.log('❌ Permissão negada:', e);
    }
  }
}

export const Notifications = new NotificationSystem();