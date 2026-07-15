<script>
  import { playerLevel, totalXP, streakDays, totalEarned } from '../lib/stores/game.js';
  import { profile } from '../lib/stores/profile.js';
  import { onMount } from 'svelte';
  
  const APP_VERSION = '4.8.21x26';
  const BUILD_DATE = '15/07/2026';
  
  let status = {
    online: true,
    api: 'Conectado',
    storage: 'Local',
    ia: 'Em breve (V5)',
    notificacoes: 'Configurável',
  };
  
  onMount(() => {
    if ('Notification' in window) {
      status.notificacoes = Notification.permission === 'granted' ? 'Ativadas' : 'Desativadas';
    }
    status.storage = localStorage.getItem('lifeRpgStateV4') ? 'Dados salvos' : 'Vazio';
  });
  
  const links = {
    github: 'https://github.com/YuukiMorp8/RPG-Life',
    discord: null,
    email: null,
    site: 'https://life-rpg.onrender.com',
  };
  
  const team = [
    { emoji: '💀', name: 'MeroMortall__', role: 'Criador & Desenvolvedor' },
    { emoji: '⚔️', name: 'Team KsW', role: 'Equipe de Desenvolvimento' },
  ];
  
  const changelog = [
    { version: '4.8.21x26', date: '15/07/2026', changes: [
      '🌿 Tema Floresta Viva com vagalumes',
      '📋 4 pilares de missões (248 itens)',
      '⚔️ Sistema de atributos (Vigor, Mente, Disciplina, Alma)',
      '🛒 Loja com 3 níveis de mentalidade',
      '🔔 Notificações configuráveis',
      '📊 Analytics / Crônicas',
      '🎉 Sistema de Level Up',
      '📱 Design mobile-first otimizado',
      '✨ Animações e micro-interações',
      '📖 Página Sobre com informações do app',
    ]},
    { version: '3.0.0', date: 'Junho 2026', changes: [
      '🍽️ Diário alimentar com parser',
      '🏋️ Gerador automático de treinos',
      '💧 Sistema de hidratação',
      '🧠 Banco de 178 exercícios',
    ]},
    { version: '2.0.0', date: 'Maio 2026', changes: [
      '⚔️ Sistema de classes RPG',
      '🛒 Loja de recompensas',
      '📊 Dashboard inicial',
    ]},
    { version: '1.0.0', date: 'Abril 2026', changes: [
      '📋 Missões diárias',
      '💰 Sistema de pontos',
      '🔥 Streak de dias',
      '🎨 Primeiro tema escuro',
    ]},
  ];
</script>

<div class="content-area about-page">
  <!-- CABEÇALHO -->
  <div class="glass-card" style="text-align: center; margin-bottom: 14px; padding: 20px;">
    <div style="font-size: 48px;">⚔️</div>
    <div style="font-size: 20px; font-weight: 700;" class="gold">Life RPG</div>
    <div style="font-size: 12px; color: var(--text-muted);">Versão {APP_VERSION}</div>
    <div style="font-size: 10px; color: var(--text-muted);">{BUILD_DATE}</div>
    <div style="font-size: 10px; color: var(--accent); margin-top: 4px;">🟢 Em desenvolvimento ativo</div>
  </div>

  <!-- STATUS DO SISTEMA -->
  <div class="section-title">📡 Status do Sistema</div>
  <div class="glass-card" style="margin-bottom: 14px; padding: 12px;">
    <div class="status-row">
      <span>🟢 Online</span>
      <span class="status-dot online"></span>
    </div>
    <div class="status-row">
      <span>💾 Armazenamento</span>
      <span style="color: var(--text-muted); font-size: 11px;">{status.storage}</span>
    </div>
    <div class="status-row">
      <span>🔔 Notificações</span>
      <span style="color: var(--text-muted); font-size: 11px;">{status.notificacoes}</span>
    </div>
    <div class="status-row">
      <span>🧠 IA Integrada</span>
      <span style="color: var(--text-muted); font-size: 11px;">{status.ia}</span>
    </div>
    <div class="status-row">
      <span>☁️ Hospedagem</span>
      <span style="color: var(--text-muted); font-size: 11px;">Render Static</span>
    </div>
    <div class="status-row">
      <span>📦 Build</span>
      <span style="color: var(--text-muted); font-size: 11px;">Vite + Svelte</span>
    </div>
  </div>

  <!-- ESTATÍSTICAS DO JOGADOR -->
  <div class="section-title">👤 Seu Personagem</div>
  <div class="glass-card" style="margin-bottom: 14px; padding: 12px;">
    <div class="status-row">
      <span>⭐ Nível</span>
      <span style="color: #82cdf2; font-weight: 600;">{$playerLevel}</span>
    </div>
    <div class="status-row">
      <span>📊 XP Total</span>
      <span style="color: var(--text-muted);">{$totalXP}</span>
    </div>
    <div class="status-row">
      <span>🔥 Streak</span>
      <span style="color: #d4a44e; font-weight: 600;">{$streakDays} dias</span>
    </div>
    <div class="status-row">
      <span>💰 Pontos Totais</span>
      <span style="color: #d7ba63; font-weight: 600;">{$totalEarned}</span>
    </div>
    <div class="status-row">
      <span>🗓️ Dias Registrados</span>
      <span style="color: var(--text-muted);">{$profile.diasRegistrados}</span>
    </div>
  </div>

  <!-- LINKS -->
  <div class="section-title">🔗 Links</div>
  <div class="glass-card" style="margin-bottom: 14px; padding: 12px;">
    <a href={links.github} target="_blank" rel="noopener noreferrer" class="link-row">
      <span>📦 GitHub</span>
      <span style="color: var(--text-muted);">YuukiMorp8/RPG-Life →</span>
    </a>
    <a href={links.site} target="_blank" rel="noopener noreferrer" class="link-row">
      <span>🌐 Site</span>
      <span style="color: var(--text-muted);">https://rpg-life-7agc.onrender.com →</span>
    </a>
    
    <div class="link-row" style="opacity: 0.5;">
      <span>💬 Discord</span>
      <span style="color: var(--text-muted); font-size: 11px;">Em breve</span>
    </div>
    
    <div class="link-row" style="opacity: 0.5;">
      <span>📧 Email</span>
      <span style="color: var(--text-muted); font-size: 11px;">Em breve</span>
    </div>
  </div>

  <!-- EQUIPE -->
  <div class="section-title">👥 Equipe</div>
  <div class="glass-card" style="margin-bottom: 14px; padding: 12px;">
    {#each team as member}
      <div class="status-row">
        <span>{member.emoji} {member.name}</span>
        <span style="color: var(--text-muted); font-size: 11px;">{member.role}</span>
      </div>
    {/each}
  </div>

  <!-- CHANGELOG -->
  <div class="section-title">📝 Histórico de Versões</div>
  {#each changelog as log}
    <div class="glass-card" style="margin-bottom: 10px; padding: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 700; color: var(--accent);">v{log.version}</span>
        <span style="font-size: 10px; color: var(--text-muted);">{log.date}</span>
      </div>
      {#each log.changes as change}
        <div style="font-size: 11px; color: var(--text-secondary); padding: 2px 0;">{change}</div>
      {/each}
    </div>
  {/each}

  <!-- FRASE FINAL -->
  <div style="text-align: center; margin-top: 20px; padding: 14px;">
    <div style="font-size: 10px; color: var(--text-muted);">
      Feito com 💚 por aventureiros para aventureiros
    </div>
    <div style="font-size: 9px; color: var(--text-muted); margin-top: 4px;">
      © 2026 Life RPG - MeroMortall__ & Team KsW
    </div>
    <div style="font-size: 8px; color: var(--text-muted); margin-top: 6px;">
      🌿 Nenhum bug foi ferido durante o desenvolvimento
    </div>
  </div>
</div>

<style>
  .status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    font-size: 12px;
    border-bottom: 1px solid var(--border);
  }
  
  .status-row:last-child {
    border-bottom: none;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  
  .status-dot.online {
    background: #62c75f;
    box-shadow: 0 0 8px rgba(98,199,95,0.5);
  }
  
  .link-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 12px;
    text-decoration: none;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border);
    transition: all 0.2s ease;
  }
  
  .link-row:last-child {
    border-bottom: none;
  }
  
  .link-row:hover {
    color: var(--accent);
  }
  
  @media (max-width: 768px) {
    .about-page {
      padding: 8px !important;
    }
    
    .status-row {
      font-size: 11px;
    }
  }
</style>