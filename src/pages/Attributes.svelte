<script>
  import { attributes, dominantAttribute, weakestAttribute } from '../lib/stores/attributes.js';
  import { onMount } from 'svelte';
  
  let levelUpMsg = '';
  let glowCard = false;
  
  onMount(() => {
    const pending = attributes.checkLevelUp();
    if (pending) {
      levelUpMsg = `${pending.emoji} ${pending.name} subiu para Nível ${pending.level}!`;
      glowCard = true;
      setTimeout(() => {
        levelUpMsg = '';
        glowCard = false;
      }, 3500);
    }
  });
</script>

<div class="content-area">
  <!-- CABEÇALHO -->
  <div class="glass-card" style="text-align: center; margin-bottom: 14px; padding: 16px;">
    <div style="font-size: 36px;">⚔️</div>
    <div style="font-size: 18px; font-weight: 700;" class="gold">Atributos do Personagem</div>
    <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">
      Cada ação molda quem você é
    </div>
  </div>

  <!-- LEVEL UP -->
  {#if levelUpMsg}
    <div class="glass-card" style="text-align: center; margin-bottom: 14px; border-color: rgba(215,186,99,0.3); animation: levelUpGlow 3.5s ease-out;">
      <div style="font-size: 16px; font-weight: 700; color: #d7ba63;">
        🎉 {levelUpMsg}
      </div>
    </div>
  {/if}

  <!-- DESTAQUE -->
  {#if $dominantAttribute && $weakestAttribute}
    <div class="glass-card" style="margin-bottom: 14px; padding: 14px;">
      <div style="display: flex; justify-content: space-around; text-align: center;">
        <div>
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">🏆 Mais Forte</div>
          <div style="font-size: 28px;">{$dominantAttribute.emoji}</div>
          <div style="font-weight: 700; color: {$dominantAttribute.color}; font-size: 13px;">
            {$dominantAttribute.name}
          </div>
          <div style="font-size: 10px; color: var(--text-muted);">Nv.{$dominantAttribute.level}</div>
        </div>
        <div style="width: 1px; background: var(--border);"></div>
        <div>
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">🎯 A Melhorar</div>
          <div style="font-size: 28px;">{$weakestAttribute.emoji}</div>
          <div style="font-weight: 700; color: {$weakestAttribute.color}; font-size: 13px;">
            {$weakestAttribute.name}
          </div>
          <div style="font-size: 10px; color: var(--text-muted);">Nv.{$weakestAttribute.level}</div>
        </div>
      </div>
    </div>
  {/if}

  <!-- ATRIBUTOS -->
  <div class="section-title">📊 Atributos</div>

  {#each Object.entries($attributes) as [key, attr]}
    {@const progress = Math.round(((attr.xp || 0) % 50) / 50 * 100)}
    {@const isDominant = $dominantAttribute?.key === key}
    {@const isWeakest = $weakestAttribute?.key === key}
    
    <div class="card" 
         style="margin-bottom: 8px; padding: 12px; border-left: 3px solid {attr.color}; 
                {isDominant ? 'box-shadow: 0 0 20px ' + attr.color + '22;' : ''}"
         class:level-up={glowCard && isDominant}>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 26px; flex-shrink: 0;">{attr.emoji}</div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; font-size: 13px; color: {attr.color};">
              {attr.name} {isDominant ? '👑' : ''} {isWeakest ? '🎯' : ''}
            </span>
            <span class="badge" style="font-size: 9px; background: {attr.color}22; color: {attr.color};">
              Nv.{attr.level}/10
            </span>
          </div>
          <div style="font-size: 10px; color: var(--text-muted); margin: 3px 0;">{attr.desc}</div>
          <div class="progress" style="height: 5px; margin-top: 4px;">
            <div class="progress-fill" style="width: {progress}%; background: {attr.color};"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 9px; color: var(--text-muted); margin-top: 3px;">
            <span>{attr.xp || 0} XP</span>
            <span>+{50 - ((attr.xp || 0) % 50)} p/ próximo</span>
          </div>
        </div>
      </div>
    </div>
  {/each}

  <!-- DICA -->
  <div class="glass-card" style="text-align: center; margin-top: 16px; padding: 12px;">
    <div style="font-size: 10px; color: var(--text-muted);">
      💡 Complete missões para evoluir seus atributos!
    </div>
  </div>
</div>

<style>
  @keyframes levelUpGlow {
    0% { box-shadow: 0 0 0 rgba(215,186,99,0); }
    30% { box-shadow: 0 0 40px rgba(215,186,99,0.5); border-color: rgba(215,186,99,0.5); }
    70% { box-shadow: 0 0 60px rgba(215,186,99,0.3); }
    100% { box-shadow: 0 0 0 rgba(215,186,99,0); }
  }
</style>