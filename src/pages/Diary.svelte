<script>
  import { parseFood } from '../lib/ai/foodParser.js';
  import { availablePoints, addPoints } from '../lib/stores/game.js';
  import { profile } from '../lib/stores/profile.js';
  
  let foodInput = '';
  let loading = false;
  let entries = [];
  let totalKcal = 0;
  let errorMsg = '';
  let expandedMeal = null;
  
  // 🕐 Relógio para ajuste manual
  let customTime = '';
  let showTimePicker = false;
  
  function getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  }
  
  function loadEntries() {
    const saved = localStorage.getItem('lifeRpgDiary');
    if (saved) {
      const all = JSON.parse(saved);
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
      entries = all[todayStr] || [];
      totalKcal = entries.reduce((sum, e) => sum + (e.totalKcal || 0), 0);
    }
  }
  
  loadEntries();
  
  function toggleExpand(index) {
    expandedMeal = expandedMeal === index ? null : index;
  }
  
  function toggleTimePicker() {
    showTimePicker = !showTimePicker;
    if (!customTime) customTime = getCurrentTime();
  }
  
  async function addMeal() {
    if (!foodInput.trim()) return;
    
    loading = true;
    errorMsg = '';
    
    try {
      const items = await parseFood(foodInput);
      
      if (items.length === 0) {
        errorMsg = '🤔 Não entendi. Tente: "2 ovos, 1 fatia de bolo"';
        loading = false;
        return;
      }
      
      const mealKcal = items.reduce((sum, i) => sum + (i.kcal || 0), 0);
      
      // Usa horário customizado ou atual
      const timeStr = customTime || getCurrentTime();
      
      const entry = {
        time: timeStr,
        items,
        totalKcal: mealKcal,
        rawText: foodInput,
      };
      
      entries = [...entries, entry];
      totalKcal += mealKcal;
      
      // Salvar
      const saved = localStorage.getItem('lifeRpgDiary');
      const all = saved ? JSON.parse(saved) : {};
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
      all[todayStr] = entries;
      localStorage.setItem('lifeRpgDiary', JSON.stringify(all));
      
      addPoints(1);
      
      foodInput = '';
      customTime = '';
      showTimePicker = false;
      errorMsg = '';
    } catch (e) {
      errorMsg = '❌ Erro ao processar. Tente novamente.';
      console.error(e);
    }
    
    loading = false;
  }
  
  function deleteMeal(index) {
    if (!entries || !entries[index]) return;
    
    totalKcal -= entries[index].totalKcal || 0;
    entries.splice(index, 1);
    entries = [...entries];
    
    const saved = localStorage.getItem('lifeRpgDiary');
    const all = saved ? JSON.parse(saved) : {};
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    all[todayStr] = entries;
    localStorage.setItem('lifeRpgDiary', JSON.stringify(all));
  }
  
  // Agrupa por período
  function getMealPeriod(time) {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 10) return '🌅 Café da Manhã';
    if (hour >= 10 && hour < 12) return '🥪 Lanche da Manhã';
    if (hour >= 12 && hour < 14) return '🍛 Almoço';
    if (hour >= 14 && hour < 17) return '🍎 Lanche da Tarde';
    if (hour >= 17 && hour < 20) return '🍲 Jantar';
    return '🌙 Ceia';
  }
</script>

<div class="content-area diary-page">
  <!-- CABEÇALHO -->
  <div class="glass-card" style="text-align: center; margin-bottom: 14px; padding: 16px;">
    <div style="display: flex; justify-content: center; align-items: center; gap: 12px;">
      <div style="font-size: 36px;">🍽️</div>
      <div style="text-align: left;">
        <div style="font-size: 16px; font-weight: 700;" class="gold">Diário Alimentar</div>
        <div style="font-size: 10px; color: var(--text-muted);">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
    </div>
    
    <div style="margin-top: 12px; display: flex; justify-content: center; gap: 20px;">
      <div style="text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: #d4a44e;">{totalKcal}</div>
        <div style="font-size: 9px; color: var(--text-muted);">kcal hoje</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: var(--accent);">{$profile.kcalDiaria}</div>
        <div style="font-size: 9px; color: var(--text-muted);">meta diária</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 24px; font-weight: 700; color: {totalKcal > $profile.kcalDiaria ? '#c45548' : 'var(--accent)'};">
          {totalKcal > $profile.kcalDiaria ? '⚠️' : totalKcal > $profile.kcalDiaria * 0.7 ? '✅' : '📉'}
        </div>
        <div style="font-size: 9px; color: var(--text-muted);">
          {totalKcal > $profile.kcalDiaria ? 'Acima' : totalKcal > $profile.kcalDiaria * 0.7 ? 'Dentro' : 'Abaixo'}
        </div>
      </div>
    </div>
  </div>

  <!-- INPUT -->
  <div class="glass-card" style="margin-bottom: 14px; padding: 14px;">
    <textarea 
      bind:value={foodInput}
      placeholder="Ex: 2 ovos, 4 garfos de macarrão, 1 fatia de bolo..."
      class="diary-input"
      rows="3"
      on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && addMeal()}
    ></textarea>
    
    <div style="display: flex; gap: 8px; margin-top: 10px;">
      <!-- Botão de relógio -->
      <button 
        class="btn btn-sm {showTimePicker ? 'btn-accent' : 'btn-ghost'}" 
        style="flex-shrink: 0; min-width: 44px;"
        on:click={toggleTimePicker}
        title="Ajustar horário da refeição"
      >
        🕐 {customTime || getCurrentTime()}
      </button>
      
      <!-- Seletor de horário -->
      {#if showTimePicker}
        <input 
          type="time" 
          bind:value={customTime}
          class="time-input"
          style="width: 100px;"
        />
        <button class="btn btn-sm btn-ghost" on:click={() => { showTimePicker = false; customTime = ''; }}>
          ✕
        </button>
      {/if}
      
      <button class="btn btn-primary btn-block" on:click={addMeal} disabled={loading}>
        {loading ? '🧠 Analisando com IA...' : '🍽️ Registrar'}
      </button>
    </div>
    
    {#if errorMsg}
      <div style="font-size: 11px; color: #c45548; margin-top: 8px; text-align: center;">
        {errorMsg}
      </div>
    {/if}
    
    <div style="font-size: 9px; color: var(--text-muted); margin-top: 8px; text-align: center;">
      🧠 IA Perplexity + Supabase • Linguagem natural • Ajuste o horário no 🕐
    </div>
  </div>

  <!-- HISTÓRICO -->
  <div class="section-title">📅 Refeições de Hoje</div>
  
  {#if entries.length === 0}
    <div class="glass-card" style="text-align: center; padding: 30px;">
      <div style="font-size: 48px;">🍽️</div>
      <div style="color: var(--text-muted); font-size: 12px; margin-top: 8px;">Nenhuma refeição registrada hoje</div>
      <div style="color: var(--text-muted); font-size: 10px; margin-top: 4px;">
        Experimente: "2 ovos, 1 pão, 1 café"
      </div>
    </div>
  {:else}
    {#each entries as entry, i}
      <div class="card diary-card" style="margin-bottom: 8px; padding: 12px;" on:click={() => toggleExpand(i)}>
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-weight: 700; font-size: 13px; color: #d4a44e;">{entry.time}</span>
              <span style="font-size: 9px; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px;">
                {getMealPeriod(entry.time)}
              </span>
              <span style="font-size: 9px; color: var(--text-muted);">
                {entry.items.length} {entry.items.length === 1 ? 'item' : 'itens'}
              </span>
              <!-- Indicador de cache vs IA -->
              {#if entry.items[0]?.fromAI}
                <span style="font-size: 8px; background: rgba(212,164,78,0.2); color: #d4a44e; padding: 1px 6px; border-radius: 4px;">🤖 IA</span>
              {:else}
                <span style="font-size: 8px; background: rgba(98,199,95,0.2); color: var(--accent); padding: 1px 6px; border-radius: 4px;">💾 Cache</span>
              {/if}
            </div>
            
            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 6px;">
              {entry.items.map(item => `${item.emoji} ${item.name} ×${item.quantity}`).join(' • ')}
            </div>
            
            {#if expandedMeal === i}
              <div style="margin-top: 8px; padding: 10px; background: rgba(0,0,0,0.25); border-radius: 8px; border: 1px solid rgba(255,255,255,0.03);">
                <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">📊 Detalhamento:</div>
                {#each entry.items as item}
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; padding: 3px 0;">
                    <span>
                      {item.emoji} {item.name} ×{item.quantity}
                      {#if item.totalGrams}
                        <span style="font-size: 8px; color: var(--text-muted);"> ({item.totalGrams}g)</span>
                      {/if}
                    </span>
                    <span style="color: #d4a44e; font-weight: 600;">≈ {item.kcal} kcal</span>
                  </div>
                  {#if item.source_url && item.source_url !== '#'}
                    <div style="font-size: 8px; color: var(--text-muted); padding-left: 16px; margin-bottom: 2px;">
                      🔗 <a href={item.source_url} target="_blank" rel="noopener" style="color: var(--accent); text-decoration: none;">{item.source_name || 'fonte'}</a>
                    </div>
                  {/if}
                {/each}
                <div style="border-top: 1px solid rgba(255,255,255,0.08); margin-top: 8px; padding-top: 6px; display: flex; justify-content: space-between; font-size: 11px;">
                  <span style="color: var(--text-muted);">Total</span>
                  <span style="font-weight: 700; color: #d4a44e;">{entry.totalKcal} kcal</span>
                </div>
              </div>
            {/if}
            
            <div style="font-size: 9px; color: var(--text-muted); margin-top: 4px; font-style: italic;">
              "{entry.rawText}"
            </div>
          </div>
          
          <div style="text-align: right; flex-shrink: 0; margin-left: 12px;">
            <div style="font-weight: 700; color: #d4a44e; font-size: 16px;">{entry.totalKcal}</div>
            <div style="font-size: 9px; color: var(--text-muted);">kcal</div>
            <button 
              class="btn btn-sm btn-ghost" 
              style="margin-top: 4px; font-size: 10px; padding: 4px 8px; opacity: 0.6;" 
              on:click|stopPropagation={() => deleteMeal(i)}
              title="Remover refeição"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    {/each}
    
    <!-- Resumo do dia -->
    <div class="glass-card" style="margin-top: 12px; padding: 12px; text-align: center;">
      <div style="font-size: 10px; color: var(--text-muted);">
        {entries.length} refeições • {entries.reduce((s, e) => s + e.items.length, 0)} alimentos • 
        Meta: {totalKcal > $profile.kcalDiaria ? `${totalKcal - $profile.kcalDiaria} kcal acima` : `${$profile.kcalDiaria - totalKcal} kcal restantes`}
      </div>
    </div>
  {/if}
</div>

<style>
  .diary-input {
    width: 100%;
    padding: 10px;
    background: #13271c;
    border: 1px solid rgba(255,255,255,0.05);
    color: var(--text-primary);
    border-radius: 8px;
    font-size: 13px;
    resize: vertical;
    font-family: inherit;
  }
  
  .diary-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(98,199,95,0.12);
    outline: none;
  }
  
  .diary-input::placeholder {
    color: rgba(255,255,255,0.2);
  }
  
  .time-input {
    padding: 6px 8px;
    background: #13271c;
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--text-primary);
    border-radius: 6px;
    font-size: 12px;
    font-family: inherit;
  }
  
  .time-input:focus {
    border-color: var(--accent);
    outline: none;
  }
  
  .diary-card {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .diary-card:hover {
    border-color: var(--border-light);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .diary-page {
      padding: 8px !important;
    }
    
    .diary-card {
      padding: 10px !important;
    }
  }
</style>