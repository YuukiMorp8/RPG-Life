<script>
  import { totalXP, availablePoints, streakDays, totalEarned, totalSpent, playerLevel, levelName, completedToday, freeMissionsToday, getToday } from '../lib/stores/game.js';
  import { profile } from '../lib/stores/profile.js';
  import { attributes } from '../lib/stores/attributes.js';
  import { ALL_PILLARS } from '../lib/db/missions/index.js';
  import { onMount } from 'svelte';
  
  let weekData = [];
  let totalMissionsWeek = 0;
  let bestDay = null;
  let currentStreak = 0;
  
  function loadWeekData() {
    const data = [];
    let total = 0;
    let best = { day: '', count: 0 };
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()];
      
      const saved = localStorage.getItem('lifeRpgStateV4');
      let count = 0;
      if (saved) {
        try {
          const state = JSON.parse(saved);
          const missions = state.completedMissions?.[dateStr] || [];
          const free = state.freeMissions?.[dateStr] || {};
          count = missions.length + Object.values(free).reduce((a, b) => a + b, 0);
        } catch(e) {}
      }
      
      data.push({ day: dayName, date: dateStr, count, isToday: i === 6 });
      total += count;
      if (count > best.count) best = { day: dayName, count };
    }
    
    weekData = data;
    totalMissionsWeek = total;
    bestDay = best;
    currentStreak = $streakDays;
  }
  
  onMount(loadWeekData);
  
  $: pilarDistribution = calcularDistribuicao();
  
  function calcularDistribuicao() {
    const dist = {};
    Object.keys(ALL_PILLARS).forEach(key => {
      const pillar = ALL_PILLARS[key];
      dist[key] = { name: pillar.name, emoji: pillar.emoji, color: pillar.color, count: 0 };
    });
    
    const completed = $completedToday || [];
    const free = $freeMissionsToday || {};
    
    completed.forEach(id => {
      if (id.startsWith('m_')) dist.mente.count++;
      else if (id.startsWith('s_')) dist.saude.count++;
      else if (id.startsWith('b_')) dist.bemEstar.count++;
      else dist.corpo.count++;
    });
    
    Object.keys(free).forEach(id => {
      const count = free[id] || 0;
      if (id.startsWith('m_')) dist.mente.count += count;
      else if (id.startsWith('s_')) dist.saude.count += count;
      else if (id.startsWith('b_')) dist.bemEstar.count += count;
      else dist.corpo.count += count;
    });
    
    return Object.values(dist);
  }
  
  $: attrList = Object.entries($attributes).map(([key, attr]) => ({
    key,
    ...attr,
    progress: Math.round(((attr.xp || 0) % 50) / 50 * 100),
    xpToNext: 50 - ((attr.xp || 0) % 50),
  }));
  
  $: recordes = [
    { emoji: '🔥', label: 'Maior Streak', value: `${currentStreak} dias`, color: '#d4a44e' },
    { emoji: '⭐', label: 'Nível Atual', value: `${$levelName} (Nv.${$playerLevel})`, color: '#82cdf2' },
    { emoji: '💰', label: 'Total de Pontos', value: `${$totalEarned}`, color: '#d7ba63' },
    { emoji: '📅', label: 'Missões na Semana', value: `${totalMissionsWeek}`, color: '#62c75f' },
    { emoji: '🏆', label: 'Melhor Dia', value: bestDay ? `${bestDay.day} (${bestDay.count})` : '--', color: '#c45548' },
  ];
</script>

<div class="content-area">
  <!-- CABEÇALHO -->
  <div class="glass-card" style="text-align: center; margin-bottom: 14px; padding: 16px;">
    <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;">
      📜 Crônicas do Aventureiro
    </div>
    <div style="font-size: 18px; font-weight: 700;" class="gold">
      Suas Estatísticas
    </div>
    <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">
      A história da sua jornada
    </div>
  </div>

  <!-- CARDS RÁPIDOS -->
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px;">
    <div class="glass-card" style="text-align: center; padding: 12px 8px;">
      <div style="font-size: 22px;">📋</div>
      <div style="font-weight: 700; font-size: 18px; color: #62c75f;">{totalMissionsWeek}</div>
      <div style="font-size: 9px; color: var(--text-muted);">na semana</div>
    </div>
    <div class="glass-card" style="text-align: center; padding: 12px 8px;">
      <div style="font-size: 22px;" class:streak-fire={currentStreak >= 7}>🔥</div>
      <div style="font-weight: 700; font-size: 18px; color: #d4a44e;">{currentStreak}</div>
      <div style="font-size: 9px; color: var(--text-muted);">streak</div>
    </div>
    <div class="glass-card" style="text-align: center; padding: 12px 8px;">
      <div style="font-size: 22px;">⭐</div>
      <div style="font-weight: 700; font-size: 18px; color: #82cdf2;">{$playerLevel}</div>
      <div style="font-size: 9px; color: var(--text-muted);">nível</div>
    </div>
  </div>

  <!-- GRÁFICO DA SEMANA -->
  <div class="section-title">📊 Esta Semana</div>
  <div class="glass-card" style="margin-bottom: 14px; padding: 16px;">
    <div style="display: flex; align-items: flex-end; gap: 6px; height: 100px;">
      {#each weekData as day}
        {@const maxCount = Math.max(...weekData.map(d => d.count), 1)}
        {@const height = (day.count / maxCount) * 100}
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; height: 100%; justify-content: flex-end;">
          <div style="font-size: 9px; color: var(--text-muted);">{day.count > 0 ? day.count : ''}</div>
          <div style="width: 100%; height: {Math.max(height, 3)}%; 
               background: {day.isToday ? 'linear-gradient(180deg, #62c75f, #348a44)' : '#1a3525'}; 
               border-radius: 4px 4px 0 0; min-height: 3px; transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);"></div>
          <div style="font-size: 9px; color: {day.isToday ? 'var(--text-primary)' : 'var(--text-muted)'}; font-weight: {day.isToday ? '700' : '400'};">
            {day.day}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- DISTRIBUIÇÃO POR PILAR -->
  <div class="section-title">🎯 Por Pilar (Hoje)</div>
  {#each pilarDistribution as pilar}
    {@const maxPilar = Math.max(...pilarDistribution.map(p => p.count), 1)}
    {@const barWidth = (pilar.count / maxPilar) * 100}
    <div style="margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span style="font-size: 12px; color: var(--text-secondary);">{pilar.emoji} {pilar.name}</span>
        <span style="font-size: 12px; font-weight: 600; color: {pilar.color};">{pilar.count}</span>
      </div>
      <div class="progress" style="height: 6px;">
        <div class="progress-fill" style="width: {barWidth}%; background: {pilar.color};"></div>
      </div>
    </div>
  {/each}

  <!-- ATRIBUTOS -->
  <div class="section-title" style="margin-top: 16px;">⚔️ Atributos</div>
  {#each attrList as attr}
    <div class="card" style="margin-bottom: 8px; padding: 12px; border-left: 3px solid {attr.color};">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 22px; flex-shrink: 0;">{attr.emoji}</div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; font-size: 12px; color: {attr.color};">{attr.name}</span>
            <span style="font-size: 10px; color: var(--text-muted);">Nv.{attr.level}/10</span>
          </div>
          <div class="progress" style="height: 5px; margin-top: 4px;">
            <div class="progress-fill" style="width: {attr.progress}%; background: {attr.color};"></div>
          </div>
          <div style="font-size: 9px; color: var(--text-muted); margin-top: 3px;">{attr.xp} XP • +{attr.xpToNext} p/ próximo</div>
        </div>
      </div>
    </div>
  {/each}

  <!-- RECORDES -->
  <div class="section-title" style="margin-top: 16px;">🏆 Recordes</div>
  <div class="glass-card" style="padding: 14px;">
    {#each recordes as record}
      <div style="display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--border);">
        <div style="font-size: 20px; flex-shrink: 0;">{record.emoji}</div>
        <div style="font-size: 12px; color: var(--text-secondary); flex: 1;">{record.label}</div>
        <div style="font-weight: 700; font-size: 13px; color: {record.color};">{record.value}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  @keyframes fireShake {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-3deg) scale(1.1); }
    75% { transform: rotate(3deg) scale(1.05); }
  }
  
  .streak-fire {
    animation: fireShake 0.6s ease-in-out infinite;
  }
</style>