<script>
  import { profile } from '../lib/stores/profile.js';
  import { generateWorkout } from '../lib/core/trainingGenerator.js';
  import { ALL_PILLARS, MENTE_MISSIONS, SAUDE_MISSIONS, BEM_ESTAR_MISSIONS } from '../lib/db/missions/index.js';
  import { INTENSITY_CONFIG } from '../lib/db/exercises/classificacao.js';
  import { addPoints, addFreeMission, streakDays, currentTab, completedToday, playerLevel, totalXP } from '../lib/stores/game.js';
  import { attributes } from '../lib/stores/attributes.js';
  import { MISSION_ATTRIBUTE_MAP, ATTRIBUTE_XP_GAIN } from '../lib/db/attributeMapping.js';

  let currentPillar = 'corpo';
  let currentCategory = null;
  let currentWorkout = null;
  let toastMessage = '';
  let toastVisible = false;
  let completingId = null;
  
  $: if (currentPillar === 'corpo' && $profile) {
    currentWorkout = generateWorkout({
      local: $profile.local,
      objetivo: $profile.objetivo,
      intensidade: $profile.intensidade,
      tempoDisponivel: $profile.tempoDisponivel,
    });
  }
  
  $: currentMissions = currentPillar !== 'corpo' 
    ? ALL_PILLARS[currentPillar]?.missions 
    : null;
  
  $: categories = currentMissions 
    ? Object.entries(currentMissions) 
    : [];
  
  $: if (categories.length > 0 && !currentCategory) {
    currentCategory = categories[0][0];
  }
  
  function switchPillar(pillar) {
    currentPillar = pillar;
    currentCategory = null;
    if (pillar !== 'corpo' && ALL_PILLARS[pillar]?.missions) {
      const cats = Object.entries(ALL_PILLARS[pillar].missions);
      if (cats.length > 0) currentCategory = cats[0][0];
    }
  }
  
  function showToast(msg) {
    toastMessage = msg;
    toastVisible = true;
    setTimeout(() => toastVisible = false, 2000);
  }
  
  function completeMission(mission) {
    completingId = mission.id;
    setTimeout(() => completingId = null, 500);
    
    const points = mission.points || 1;
    addPoints(points);
    addFreeMission(mission.id);
    completedToday.update(arr => [...arr, mission.id]);
    
    const attr = MISSION_ATTRIBUTE_MAP[mission.id];
    if (attr) {
      const xp = ATTRIBUTE_XP_GAIN[attr] || 5;
      attributes.addXP(attr, xp);
      showToast(`✅ +${points}pts • +${xp} ${attr}`);
    } else {
      showToast(`✅ +${points}pts • ${mission.emoji} ${mission.name}`);
    }
  }
  
  function completeExercise(ex) {
    completingId = ex.id || ex.name;
    setTimeout(() => completingId = null, 500);
    
    const points = ex.points || 1;
    addPoints(points);
    addFreeMission(ex.id || ex.name);
    completedToday.update(arr => [...arr, ex.id || ex.name]);
    showToast(`✅ +${points}pts • ${ex.emoji || '💪'} ${ex.name}`);
  }
  
  function regenerateWorkout() {
    currentWorkout = generateWorkout({
      local: $profile.local,
      objetivo: $profile.objetivo,
      intensidade: $profile.intensidade,
      tempoDisponivel: $profile.tempoDisponivel,
    });
    showToast('🔄 Novo treino gerado!');
  }
</script>

<div class="content-area missions-page">
  <!-- TOAST -->
  {#if toastVisible}
    <div class="toast-popup">
      {toastMessage}
    </div>
  {/if}

  <!-- CABEÇALHO -->
  <div class="glass-card" style="text-align: center; margin-bottom: 12px; padding: 14px;">
    <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">
      ⚔️ Guilda dos Aventureiros
    </div>
    <div style="font-size: 16px; font-weight: 700;" class="gold">
      Missões de Hoje
    </div>
    <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">
      Nv.{$playerLevel} • ⭐ {$totalXP} XP
    </div>
  </div>

  <!-- ABAS DE PILARES -->
  <div class="pillar-tabs">
    {#each Object.entries(ALL_PILLARS) as [key, pillar]}
      <div
        class="pillar-tab"
        class:active={currentPillar === key}
        style="color: {currentPillar === key ? pillar.color : 'var(--text-muted)'};
               border-color: {currentPillar === key ? pillar.color + '44' : 'var(--border)'};
               background: {currentPillar === key ? pillar.color + '18' : 'var(--bg-card)'};"
        on:click={() => switchPillar(key)}
      >
        {pillar.emoji} {pillar.name}
      </div>
    {/each}
  </div>

  <!-- PILAR: CORPO -->
  {#if currentPillar === 'corpo'}
    <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 10px; text-align: center;">
      {$profile.intensidade === 'leve' ? '🌱' : $profile.intensidade === 'intensa' ? '💀' : '🔥'} 
      {INTENSITY_CONFIG[$profile.intensidade]?.name || 'Moderada'}
    </div>

    {#if currentWorkout}
      {#if currentWorkout.exercises.length === 0}
        <div class="glass-card" style="text-align: center; padding: 30px;">
          <div style="font-size: 36px;">🏋️</div>
          <div style="color: var(--text-muted); margin: 8px 0; font-size: 12px;">Nenhum exercício.</div>
          <button class="btn btn-primary btn-sm" on:click={regenerateWorkout} style="margin-top: 8px;">
            🔄 Gerar Novo
          </button>
        </div>
      {:else}
        <div class="section-title">
          🎯 Treino • ~{currentWorkout.totalTime}min • 🔥{currentWorkout.totalKcal}kcal
        </div>

        {#each currentWorkout.exercises as ex}
          <div class="card mission-card" 
               class:mission-completed={completingId === (ex.id || ex.name)}
               style="border-left: 3px solid {ex.isWarmup ? '#62c75f' : ex.isCooldown ? '#4ca8d9' : '#d4a44e'};">
            <div class="card-row">
              <div class="card-emoji">{ex.emoji || '💪'}</div>
              <div class="card-body">
                <div class="card-name">
                  {ex.isWarmup ? '🟢 ' : ex.isCooldown ? '🔵 ' : ''}{ex.name}
                </div>
                <div class="card-info">
                  {ex.sets || 3}s × {ex.reps || 12} reps
                  {#if ex.estimatedKcal} • 🔥{ex.estimatedKcal}kcal{/if}
                </div>
              </div>
              <div class="card-action">
                <div class="card-points">+{ex.points || 1}</div>
                <button class="btn btn-sm complete-btn" on:click={() => completeExercise(ex)}>
                  ✅
                </button>
              </div>
            </div>
          </div>
        {/each}

        <button class="btn btn-primary btn-block btn-sm" style="margin-top: 10px;" on:click={regenerateWorkout}>
          🔄 Gerar Novo Treino
        </button>
      {/if}
    {/if}

  <!-- OUTROS PILARES -->
  {:else if currentMissions}
    <div class="category-tabs">
      {#each categories as [key, cat]}
        <div
          class="category-tab"
          class:active={currentCategory === key}
          on:click={() => currentCategory = key}
        >
          {cat.emoji} {cat.name}
        </div>
      {/each}
    </div>

    {#if currentCategory && currentMissions[currentCategory]}
      <div class="section-title">
        {currentMissions[currentCategory].emoji} {currentMissions[currentCategory].name}
      </div>

      {#each currentMissions[currentCategory].missions as mission}
        <div class="card mission-card" 
             class:mission-completed={completingId === mission.id}
             style="border-left: 3px solid {ALL_PILLARS[currentPillar].color};">
          <div class="card-row">
            <div class="card-emoji">{mission.emoji}</div>
            <div class="card-body">
              <div class="card-name">{mission.name}</div>
              <div class="card-info">{mission.baseReps} {mission.unit}</div>
            </div>
            <div class="card-action">
              <div class="card-points">+{mission.points}</div>
              <button class="btn btn-sm complete-btn" on:click={() => completeMission(mission)}>
                ✅
              </button>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <div class="glass-card" style="text-align: center; padding: 30px;">
        <div style="font-size: 36px;">📭</div>
        <div style="color: var(--text-muted); font-size: 12px;">Selecione uma categoria</div>
      </div>
    {/if}
  {/if}

  <button class="btn btn-ghost btn-block btn-sm" style="margin-top: 12px;" on:click={() => currentTab.set('profile')}>
    ⚙️ Ajustar Preferências
  </button>
</div>

<style>
  /* Toast */
  .toast-popup {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-card);
    color: var(--text-primary);
    padding: 10px 18px;
    border-radius: 25px;
    font-size: 13px;
    font-weight: 600;
    z-index: 1000;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--accent);
    animation: toastIn 0.3s ease;
    white-space: nowrap;
    max-width: 90vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Abas de pilares */
  .pillar-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 2px;
  }

  .pillar-tab {
    padding: 7px 10px;
    border-radius: 16px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
    transition: all 0.2s ease;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-muted);
  }

  .pillar-tab.active {
    font-weight: 700;
  }

  /* Abas de categorias */
  .category-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    flex-wrap: wrap;
    padding-bottom: 2px;
  }

  .category-tab {
    padding: 5px 10px;
    border-radius: 14px;
    font-size: 10px;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-muted);
  }

  .category-tab.active {
    background: rgba(98,199,95,0.12);
    color: #62c75f;
    border-color: rgba(98,199,95,0.3);
  }

  /* Cards de missão */
  .mission-card {
    margin-bottom: 6px;
    padding: 10px;
  }

  .card-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .card-emoji {
    font-size: 24px;
    flex-shrink: 0;
  }

  .card-body {
    flex: 1;
    min-width: 0;
  }

  .card-name {
    font-weight: 600;
    font-size: 13px;
  }

  .card-info {
    font-size: 10px;
    color: var(--text-muted);
  }

  .card-action {
    text-align: right;
    flex-shrink: 0;
  }

  .card-points {
    font-weight: 700;
    color: var(--accent);
    font-size: 12px;
  }

  .complete-btn {
    margin-top: 4px;
    font-size: 9px;
    padding: 4px 10px;
    background: rgba(98,199,95,0.12);
    color: #62c75f;
    border: 1px solid rgba(98,199,95,0.25);
  }

  /* Animações */
  @keyframes toastIn {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }

  @keyframes completePulse {
    0% { transform: scale(1); }
    30% { transform: scale(1.03); }
    60% { transform: scale(0.98); }
    100% { transform: scale(1); }
  }

  :global(.mission-completed) {
    animation: completePulse 0.5s ease;
  }

  /* ============================================
     MOBILE
     ============================================ */
  @media (max-width: 768px) {
    .missions-page {
      padding: 8px !important;
    }

    .pillar-tab {
      padding: 5px 8px;
      font-size: 10px;
      border-radius: 14px;
    }

    .category-tab {
      padding: 4px 7px;
      font-size: 9px;
      border-radius: 11px;
    }

    .mission-card {
      padding: 8px;
      margin-bottom: 5px;
    }

    .card-row {
      gap: 7px;
    }

    .card-emoji {
      font-size: 20px;
    }

    .card-name {
      font-size: 11px;
    }

    .card-info {
      font-size: 9px;
    }

    .card-points {
      font-size: 10px;
    }

    .complete-btn {
      font-size: 8px;
      padding: 3px 7px;
      margin-top: 2px;
    }

    .section-title {
      font-size: 9px;
    }

    .toast-popup {
      font-size: 11px;
      padding: 8px 14px;
      bottom: 70px;
    }
  }

  @media (max-width: 400px) {
    .pillar-tab {
      padding: 4px 6px;
      font-size: 9px;
    }

    .card-emoji {
      font-size: 18px;
    }

    .card-name {
      font-size: 10px;
    }
  }
</style>