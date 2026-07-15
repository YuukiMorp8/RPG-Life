<script>
  import { playerLevel, levelName, xpProgress, availablePoints, streakDays, totalEarned, missionMultiplier, completedToday, freeMissionsToday, getToday, xpToNext } from '../lib/stores/game.js';
  import { profile, imcInfo, objetivoInfo, localInfo, intensidadeInfo } from '../lib/stores/profile.js';
  import { currentTab } from '../lib/stores/game.js';
  import { generateWorkout } from '../lib/core/trainingGenerator.js';
  import { ALL_PILLARS, MENTE_MISSIONS, SAUDE_MISSIONS, BEM_ESTAR_MISSIONS } from '../lib/db/missions/index.js';
  
  let todayWorkout = null;
  
  $: if ($profile) {
    todayWorkout = generateWorkout({
      local: $profile.local,
      objetivo: $profile.objetivo,
      intensidade: $profile.intensidade,
      tempoDisponivel: $profile.tempoDisponivel,
    });
  }
  
  $: pillarProgress = calcularProgressoPilares($completedToday, $freeMissionsToday);
  
  function calcularProgressoPilares(completed, freeMissions) {
    const progress = {};
    const completedToday = completed || [];
    const freeToday = freeMissions || {};
    
    // 🏋️ CORPO
    const corpoTotal = todayWorkout?.exercises?.length || 5;
    const corpoCompleted = Object.values(freeToday).reduce((a, b) => a + b, 0);
    progress.corpo = {
      total: corpoTotal,
      completed: Math.min(corpoCompleted, corpoTotal),
      color: '#62c75f',
      emoji: '🏋️',
      name: 'Corpo',
      message: corpoCompleted >= corpoTotal ? '💪 Completo!' : 
               corpoCompleted > 0 ? `${corpoCompleted}/${corpoTotal} ex` : 
               'Treino pendente'
    };
    
    // 🧠 MENTE
    const menteTotal = Object.values(MENTE_MISSIONS).reduce((s, c) => s + c.missions.length, 0);
    const menteCompleted = completedToday.filter(id => id.startsWith('m_')).length + 
                           Object.entries(freeToday).filter(([id]) => id.startsWith('m_')).reduce((s, [_, v]) => s + v, 0);
    progress.mente = {
      total: Math.min(menteTotal, 20),
      completed: Math.min(menteCompleted, 20),
      color: '#4ca8d9',
      emoji: '🧠',
      name: 'Mente',
      message: menteCompleted >= 10 ? '🧠 Mente afiada!' :
               menteCompleted >= 5 ? 'Bom progresso!' :
               menteCompleted > 0 ? 'Continue!' :
               'Que tal ler algo?'
    };
    
    // ❤️ SAÚDE
    const saudeTotal = Object.values(SAUDE_MISSIONS).reduce((s, c) => s + c.missions.length, 0);
    const saudeCompleted = completedToday.filter(id => id.startsWith('s_')).length +
                           Object.entries(freeToday).filter(([id]) => id.startsWith('s_')).reduce((s, [_, v]) => s + v, 0);
    progress.saude = {
      total: Math.min(saudeTotal, 20),
      completed: Math.min(saudeCompleted, 20),
      color: '#d4a44e',
      emoji: '❤️',
      name: 'Saúde',
      message: saudeCompleted >= 15 ? '❤️ Em dia!' :
               saudeCompleted >= 8 ? 'Cuidando bem!' :
               saudeCompleted > 0 ? 'Continue!' :
               'Beba água! 💧'
    };
    
    // 🌱 BEM-ESTAR
    const bemEstarTotal = Object.values(BEM_ESTAR_MISSIONS).reduce((s, c) => s + c.missions.length, 0);
    const bemEstarCompleted = completedToday.filter(id => id.startsWith('b_')).length +
                              Object.entries(freeToday).filter(([id]) => id.startsWith('b_')).reduce((s, [_, v]) => s + v, 0);
    progress.bemEstar = {
      total: Math.min(bemEstarTotal, 15),
      completed: Math.min(bemEstarCompleted, 15),
      color: '#82cdf2',
      emoji: '🌱',
      name: 'Bem-Estar',
      message: bemEstarCompleted >= 10 ? '🌱 Florescendo!' :
               bemEstarCompleted >= 5 ? 'Em dia!' :
               bemEstarCompleted > 0 ? 'Continue!' :
               'Saia um pouco! 🌳'
    };
    
    return progress;
  }
  
  $: quickMissions = [
    { emoji: '💧', name: 'Beber água', points: 1 },
    { emoji: '📖', name: 'Ler 5 páginas', points: 2 },
    { emoji: '🌳', name: 'Sair 15min', points: 4 },
    { emoji: '🧘', name: 'Meditar 5min', points: 3 },
  ];
  
  $: streakMessage = $streakDays === 0 
    ? 'Comece sua jornada hoje! 🚀' 
    : $streakDays < 3 ? 'Continuando... 🌱' 
    : $streakDays < 7 ? 'Streak consistente! 🎯' 
    : $streakDays < 15 ? 'Disciplina de aço! 🔥' 
    : 'LENDA! 👑';
          
  $: todayPoints = ($completedToday || []).length * 2 + 
                   Object.values($freeMissionsToday || {}).reduce((a, b) => a + b, 0);
</script>

<div class="content-area">
  <!-- CABEÇALHO -->
  <div class="glass-card" style="text-align: center; margin-bottom: 14px; padding: 18px 14px;">
    <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;">
      ⚔️ Life RPG
    </div>
    <div style="font-size: 20px; font-weight: 700;" class="gold">
      Bem-vindo, {$profile.nome}!
    </div>
    <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px;">
      {$levelName} • Nv.{$playerLevel}
    </div>
    <div class="progress" style="margin: 12px 0; height: 6px;">
      <div class="progress-fill progress-accent" style="width: {$xpProgress}%;"></div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 9px; color: var(--text-muted);">
      <span>{$totalEarned} XP</span>
      <span>+{$xpToNext} p/ próximo nível</span>
    </div>
    <div style="font-size: 13px; color: var(--text-primary); margin-top: 6px;">
      {streakMessage}
    </div>
  </div>

  <!-- CARDS RÁPIDOS -->
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 14px;">
    <div class="glass-card" style="text-align: center; padding: 12px 6px;">
      <div style="font-size: 22px;" class:streak-fire={$streakDays >= 7}>🔥</div>
      <div style="font-weight: 700; color: #d4a44e; font-size: 18px;">{$streakDays}</div>
      <div style="font-size: 8px; color: var(--text-muted);">streak</div>
    </div>
    <div class="glass-card" style="text-align: center; padding: 12px 6px; cursor: pointer;" on:click={() => currentTab.set('shop')}>
      <div style="font-size: 22px;">💰</div>
      <div style="font-weight: 700; color: #d7ba63; font-size: 18px;">{$availablePoints}</div>
      <div style="font-size: 8px; color: var(--text-muted);">pontos</div>
    </div>
    <div class="glass-card" style="text-align: center; padding: 12px 6px;">
      <div style="font-size: 22px;">⭐</div>
      <div style="font-weight: 700; color: #62c75f; font-size: 18px;">{todayPoints}</div>
      <div style="font-size: 8px; color: var(--text-muted);">hoje</div>
    </div>
    <div class="glass-card" style="text-align: center; padding: 12px 6px;">
      <div style="font-size: 22px;">📊</div>
      <div style="font-weight: 700; color: #82cdf2; font-size: 18px;">{$totalEarned}</div>
      <div style="font-size: 8px; color: var(--text-muted);">XP</div>
    </div>
  </div>

  <!-- PROGRESSO DOS PILARES -->
  <div class="section-title">📊 Seus Pilares</div>
  
  {#each Object.entries(pillarProgress) as [key, pillar]}
    <div class="card" style="margin-bottom: 8px; padding: 12px; border-left: 3px solid {pillar.color}; cursor: pointer;"
         on:click={() => currentTab.set('missions')}>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 22px; flex-shrink: 0;">{pillar.emoji}</div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; font-size: 13px; color: {pillar.color};">{pillar.name}</span>
            <span style="font-size: 10px; color: var(--text-muted);">{pillar.completed}/{pillar.total}</span>
          </div>
          <div class="progress" style="margin-top: 4px; height: 5px;">
            <div class="progress-fill" style="width: {Math.min(pillar.completed / pillar.total * 100, 100)}%; background: {pillar.color};"></div>
          </div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px;">
            {pillar.message}
          </div>
        </div>
      </div>
    </div>
  {/each}

  <!-- TREINO DE HOJE -->
  {#if todayWorkout}
    <div class="section-title" style="margin-top: 16px;">🎯 Treino de Hoje</div>
    <div class="glass-card" style="padding: 14px; cursor: pointer;" on:click={() => currentTab.set('missions')}>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 30px; flex-shrink: 0;">{$localInfo.emoji}</div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 600; font-size: 13px;">
            {$intensidadeInfo.emoji} {$intensidadeInfo.name} • {$localInfo.name}
          </div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 3px;">
            {todayWorkout.exercises.length} ex • ~{todayWorkout.totalTime}min • 🔥{todayWorkout.totalKcal}kcal
          </div>
          <div style="font-size: 9px; color: var(--text-secondary); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {todayWorkout.exercises.slice(0, 2).map(e => e.emoji + ' ' + e.name).join(' • ')}
            {#if todayWorkout.exercises.length > 2} • ...{/if}
          </div>
        </div>
        <div style="font-size: 18px; color: var(--accent); flex-shrink: 0;">→</div>
      </div>
    </div>
  {/if}

  <!-- MISSÕES RÁPIDAS -->
  <div class="section-title" style="margin-top: 16px;">⚡ Rápidas</div>
  <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch;">
    {#each quickMissions as mission}
      <div class="card" style="min-width: 90px; max-width: 110px; text-align: center; padding: 12px; cursor: pointer; flex-shrink: 0;"
           on:click={() => currentTab.set('missions')}>
        <div style="font-size: 24px;">{mission.emoji}</div>
        <div style="font-weight: 600; font-size: 10px; margin: 3px 0;">{mission.name}</div>
        <div style="font-size: 9px; color: var(--success);">+{mission.points}pts</div>
      </div>
    {/each}
  </div>

  <!-- MÉTRICAS DO CORPO -->
  <div class="section-title" style="margin-top: 16px;">📊 Corpo</div>
  <div class="glass-card" style="padding: 14px;">
    <div style="display: flex; justify-content: space-around; text-align: center;">
      <div>
        <div style="font-size: 20px;">⚖️</div>
        <div style="font-weight: 700; font-size: 15px; color: {$imcInfo.color};">{$profile.imc}</div>
        <div style="font-size: 9px; color: {$imcInfo.color};">{$imcInfo.label}</div>
      </div>
      <div>
        <div style="font-size: 20px;">💧</div>
        <div style="font-weight: 700; font-size: 15px;">{$profile.aguaIdeal}L</div>
        <div style="font-size: 9px; color: var(--text-muted);">água/dia</div>
      </div>
      <div>
        <div style="font-size: 20px;">🔥</div>
        <div style="font-weight: 700; font-size: 15px;">~{$profile.kcalDiaria}</div>
        <div style="font-size: 9px; color: var(--text-muted);">kcal/dia</div>
      </div>
    </div>
    <div style="text-align: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border);">
      <div style="font-size: 10px; color: var(--text-muted);">
        Ideal: {$profile.pesoIdealMin}-{$profile.pesoIdealMax}kg • {$objetivoInfo.emoji} {$objetivoInfo.name}
      </div>
    </div>
  </div>

  <!-- MULTIPLICADOR -->
  {#if $missionMultiplier > 1}
    <div class="glass-card" style="text-align: center; margin-top: 14px; border-color: rgba(215,186,99,0.3); padding: 12px;">
      <div style="font-size: 22px;">⚡</div>
      <div style="font-weight: 700; color: #d7ba63; font-size: 13px;">Multiplicador {$missionMultiplier}x!</div>
    </div>
  {/if}
</div>