<script>
  import { profile, imcInfo, objetivoInfo, localInfo, intensidadeInfo } from '../lib/stores/profile.js';
  import { currentTab } from '../lib/stores/game.js';
  import { LOCAIS, GOAL_CONFIG, INTENSITY_CONFIG } from '../lib/db/exercises/classificacao.js';
  import { isIntensaUnlocked, isAtletaUnlocked, playerLevel } from '../lib/stores/game.js';
  
  let editMode = false;
  let formData = { ...$profile };
  
  const locaisOptions = [
    { value: 'casa', ...LOCAIS.casa },
    { value: 'ar_livre', ...LOCAIS.ar_livre },
    { value: 'academia', ...LOCAIS.academia },
  ];
  
  $: objetivoOptions = Object.entries(GOAL_CONFIG).map(([key, val]) => ({ value: key, ...val }));
  
  $: intensidadeOptions = Object.entries(INTENSITY_CONFIG)
    .filter(([key]) => {
      if (key === 'intensa' && !$isIntensaUnlocked) return false;
      if (key === 'atleta' && !$isAtletaUnlocked) return false;
      return true;
    })
    .map(([key, val]) => ({ value: key, ...val, locked: false }));
  
  // Adicionar bloqueadas como locked
  $: if (!$isIntensaUnlocked) {
    intensidadeOptions.push({ value: 'intensa', ...INTENSITY_CONFIG.intensa, locked: true });
  }
  $: if (!$isAtletaUnlocked) {
    intensidadeOptions.push({ value: 'atleta', ...INTENSITY_CONFIG.atleta, locked: true });
  }
  
  function saveProfile() {
    profile.updateProfile(formData);
    profile.calculateMetrics();
    editMode = false;
  }
  
  function startEdit() {
    formData = { ...$profile };
    editMode = true;
  }
  
  function cancelEdit() {
    editMode = false;
  }
</script>

<div class="content-area profile-page">
  <!-- CABEÇALHO -->
  <div class="glass-card" style="text-align: center; margin-bottom: 12px; padding: 14px;">
    <div style="font-size: 36px;">{$imcInfo.emoji}</div>
    <div style="font-size: 16px; font-weight: 700;" class="gold">{$profile.nome}</div>
    <div style="font-size: 11px; color: var(--text-secondary);">
      {$objetivoInfo.emoji} {$objetivoInfo.name} • {$intensidadeInfo.emoji} {$intensidadeInfo.name}
    </div>
  </div>

  <!-- MÉTRICAS -->
  <div class="section-title">📊 Suas Métricas</div>
  <div class="glass-card" style="margin-bottom: 12px; padding: 10px;">
    <div class="metrics-grid">
      <div class="metric-item">
        <div class="metric-label">⚖ Peso</div>
        <div class="metric-value">{$profile.peso}kg</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">📏 Altura</div>
        <div class="metric-value">{$profile.altura}cm</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">📊 IMC</div>
        <div class="metric-value" style="color: {$imcInfo.color};">{$profile.imc}</div>
        <div class="metric-sub" style="color: {$imcInfo.color};">{$imcInfo.label}</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">🔥 Kcal</div>
        <div class="metric-value">~{$profile.kcalDiaria}</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">💧 Água</div>
        <div class="metric-value">{$profile.aguaIdeal}L</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">⚖ Ideal</div>
        <div class="metric-value">{$profile.pesoIdealMin}-{$profile.pesoIdealMax}</div>
      </div>
    </div>
  </div>

  <!-- PREFERÊNCIAS -->
  <div class="section-title">⚙️ Preferências</div>
  
  {#if !editMode}
    <div class="glass-card" style="margin-bottom: 12px; padding: 12px;">
      <div class="pref-row">
        <span class="pref-label">🏠 Local</span>
        <span class="pref-value">{$localInfo.emoji} {$localInfo.name}</span>
      </div>
      <div class="pref-row">
        <span class="pref-label">🎯 Objetivo</span>
        <span class="pref-value">{$objetivoInfo.emoji} {$objetivoInfo.name}</span>
      </div>
      <div class="pref-row">
        <span class="pref-label">🔥 Intensidade</span>
        <span class="pref-value">{$intensidadeInfo.emoji} {$intensidadeInfo.name}</span>
      </div>
      <div class="pref-row">
        <span class="pref-label">⏱️ Tempo</span>
        <span class="pref-value">{$profile.tempoDisponivel}min</span>
      </div>
      <div class="pref-row">
        <span class="pref-label">📅 Frequência</span>
        <span class="pref-value">{$profile.frequencia.replace('_', ' ')}</span>
      </div>
      
      <button class="btn btn-primary btn-block btn-sm" style="margin-top: 10px;" on:click={startEdit}>
        ⚙️ Editar
      </button>
    </div>
  {:else}
    <div class="glass-card" style="margin-bottom: 12px; padding: 12px;">
      <!-- Nome -->
      <div class="form-group">
        <label class="form-label">Nome</label>
        <input type="text" bind:value={formData.nome} class="form-input" />
      </div>

      <!-- Peso e Altura -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Peso (kg)</label>
          <input type="number" bind:value={formData.peso} min="30" max="300" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Altura (cm)</label>
          <input type="number" bind:value={formData.altura} min="100" max="250" class="form-input" />
        </div>
      </div>

      <!-- Idade e Sexo -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Idade</label>
          <input type="number" bind:value={formData.idade} min="10" max="120" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Sexo</label>
          <select bind:value={formData.sexo} class="form-input">
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>
      </div>

      <!-- Local -->
      <div class="form-group">
        <label class="form-label">Onde treina?</label>
        <div class="option-row">
          {#each locaisOptions as loc}
            <div 
              class="option-card"
              class:active={formData.local === loc.value}
              on:click={() => formData.local = loc.value}
            >
              <div class="option-emoji">{loc.emoji}</div>
              <div class="option-name">{loc.name}</div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Objetivo -->
      <div class="form-group">
        <label class="form-label">Objetivo</label>
        <select bind:value={formData.objetivo} class="form-input">
          {#each objetivoOptions as obj}
            <option value={obj.value}>{obj.emoji} {obj.name}</option>
          {/each}
        </select>
      </div>

      <!-- Intensidade -->
      <div class="form-group">
        <label class="form-label">Intensidade</label>
        <div class="option-row">
          {#each intensidadeOptions as int}
            <div 
              class="option-card"
              class:active={formData.intensidade === int.value}
              class:locked={int.locked}
              on:click={() => !int.locked && (formData.intensidade = int.value)}
            >
              <div class="option-emoji">{int.emoji}</div>
              <div class="option-name">{int.name}{int.locked ? ' 🔒' : ''}</div>
            </div>
          {/each}
        </div>
        {#if !$isIntensaUnlocked || !$isAtletaUnlocked}
          <div class="unlock-hint">
            🔒 Nv.{$playerLevel}: 
            {#if !$isIntensaUnlocked}"Intensa" no nível 5{/if}
            {#if !$isAtletaUnlocked}{#if !$isIntensaUnlocked} • {/if}"Atleta" no nível 10{/if}
          </div>
        {/if}
      </div>

      <!-- Tempo -->
      <div class="form-group">
        <label class="form-label">Tempo: {formData.tempoDisponivel}min</label>
        <input type="range" bind:value={formData.tempoDisponivel} min="10" max="120" step="5" class="range-slider" />
        <div class="range-labels">
          <span>10</span><span>30</span><span>60</span><span>120</span>
        </div>
      </div>

      <!-- Frequência -->
      <div class="form-group">
        <label class="form-label">Frequência</label>
        <select bind:value={formData.frequencia} class="form-input">
          <option value="3x_semana">3x por semana</option>
          <option value="5x_semana">5x por semana</option>
          <option value="todos_dias">Todos os dias</option>
        </select>
      </div>

      <div class="form-row">
        <button class="btn btn-success btn-sm" style="flex: 1;" on:click={saveProfile}>💾 Salvar</button>
        <button class="btn btn-ghost btn-sm" on:click={cancelEdit}>Cancelar</button>
      </div>
    </div>
  {/if}

  <!-- ESTATÍSTICAS -->
  <div class="section-title">📈 Estatísticas</div>
  <div class="glass-card" style="padding: 10px;">
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-icon">🗓️</div>
        <div class="stat-value">{$profile.diasRegistrados}</div>
        <div class="stat-label">dias</div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">✅</div>
        <div class="stat-value">{$profile.treinosCompletados}</div>
        <div class="stat-label">treinos</div>
      </div>
    </div>
  </div>

  <!-- BOTÃO MISSÕES -->
  <button class="btn btn-primary btn-block btn-sm" style="margin-top: 12px;" on:click={() => currentTab.set('missions')}>
    🎯 Gerar Treinos
  </button>
</div>

<style>
  /* Grid de métricas */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .metric-item {
    text-align: center;
    padding: 8px;
  }

  .metric-label {
    font-size: 10px;
    color: var(--text-muted);
  }

  .metric-value {
    font-weight: 700;
    font-size: 15px;
  }

  .metric-sub {
    font-size: 8px;
  }

  /* Preferências */
  .pref-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
  }

  .pref-label {
    color: var(--text-muted);
    font-size: 11px;
  }

  .pref-value {
    font-weight: 600;
    font-size: 12px;
  }

  /* Formulário */
  .form-group {
    margin-bottom: 10px;
  }

  .form-label {
    font-size: 10px;
    color: var(--text-muted);
    display: block;
    margin-bottom: 3px;
  }

  .form-input {
    width: 100%;
    padding: 8px;
    background: #13271c;
    border: 1px solid rgba(255,255,255,0.05);
    color: var(--text-primary);
    border-radius: 8px;
    font-size: 13px;
  }

  .form-row {
    display: flex;
    gap: 6px;
  }

  .form-row .form-group {
    flex: 1;
  }

  /* Opções (local, intensidade) */
  .option-row {
    display: flex;
    gap: 4px;
  }

  .option-card {
    flex: 1;
    text-align: center;
    padding: 8px 4px;
    border-radius: 10px;
    cursor: pointer;
    background: #13271c;
    border: 1px solid rgba(255,255,255,0.05);
    color: var(--text-muted);
    transition: all 0.2s ease;
  }

  .option-card.active {
    background: rgba(98,199,95,0.12);
    border-color: rgba(98,199,95,0.3);
    color: #62c75f;
  }

  .option-card.locked {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .option-emoji {
    font-size: 20px;
  }

  .option-name {
    font-size: 9px;
  }

  .unlock-hint {
    font-size: 9px;
    color: var(--text-muted);
    text-align: center;
    margin-top: 4px;
  }

  /* Range slider */
  .range-slider {
    width: 100%;
    height: 5px;
    -webkit-appearance: none;
    appearance: none;
    background: #13271c;
    border-radius: 3px;
    outline: none;
  }

  .range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
  }

  .range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 8px;
    color: var(--text-muted);
  }

  /* Estatísticas */
  .stats-row {
    display: flex;
    justify-content: space-around;
    text-align: center;
  }

  .stat-item {
    padding: 8px;
  }

  .stat-icon {
    font-size: 20px;
  }

  .stat-value {
    font-weight: 700;
    font-size: 16px;
  }

  .stat-label {
    font-size: 9px;
    color: var(--text-muted);
  }

  /* Mobile */
  @media (max-width: 768px) {
    .profile-page {
      padding: 8px !important;
    }

    .metrics-grid {
      gap: 4px;
    }

    .metric-item {
      padding: 6px;
    }

    .metric-value {
      font-size: 13px;
    }

    .option-emoji {
      font-size: 16px;
    }

    .option-name {
      font-size: 8px;
    }

    .form-input {
      font-size: 12px;
      padding: 7px;
    }
  }
</style>