<script>
  import { availablePoints, spendPoints } from '../lib/stores/game.js';
  import { SHOP_ITEMS, SHOP_TIERS, SHOP_CATEGORIES } from '../lib/db/shop.js';
  
  let currentTier = 'iniciante';
  let currentCategory = 'all';
  let toastMsg = '';
  let toastShow = false;
  
  function showToast(msg) {
    toastMsg = msg;
    toastShow = true;
    setTimeout(() => toastShow = false, 2000);
  }
  
  function buyItem(item) {
    if ($availablePoints < item.cost) {
      showToast('💸 Pontos insuficientes!');
      return;
    }
    spendPoints(item.cost);
    showToast(`🎉 ${item.emoji} ${item.name} comprado!`);
  }
  
  $: filteredItems = SHOP_ITEMS.filter(i => {
    if (i.tier !== currentTier) return false;
    if (currentCategory !== 'all' && i.category !== currentCategory) return false;
    return true;
  });
  
  // Categorias do tier atual
  $: currentCategories = SHOP_CATEGORIES[currentTier] || SHOP_CATEGORIES.iniciante;
  
  // Descrição do tier
  $: tierDescription = {
    iniciante: 'Pequenos mimos que você compra no mesmo dia. Consumo rápido, felicidade instantânea.',
    intermediario: 'Experiências e conquistas. Você está economizando para algo que realmente importa.',
    avancado: 'Grandes objetivos. Transforme seu esforço em conquistas reais.',
  };
</script>

<div class="content-area shop-page">
  <!-- TOAST -->
  {#if toastShow}
    <div class="toast-popup">{toastMsg}</div>
  {/if}

  <!-- SALDO -->
  <div class="glass-card" style="text-align: center; margin-bottom: 12px; padding: 14px;">
    <div style="font-size: 28px;">🏪</div>
    <div style="font-size: 10px; color: var(--text-muted);">Mercador do Reino</div>
    <div style="font-size: 24px; font-weight: 700;" class="gold">{$availablePoints} pts</div>
  </div>

  <!-- ABAS DE TIER -->
  <div class="tier-tabs">
    {#each Object.entries(SHOP_TIERS) as [key, tier]}
      <div
        class="tier-tab"
        class:active={currentTier === key}
        style="border-color: {currentTier === key ? tier.color + '44' : 'var(--border)'};
               background: {currentTier === key ? tier.color + '18' : 'var(--bg-card)'};"
        on:click={() => { currentTier = key; currentCategory = 'all'; }}
      >
        <span style="color: {currentTier === key ? tier.color : 'var(--text-muted)'};">
          {tier.emoji} {tier.name}
        </span>
      </div>
    {/each}
  </div>

  <!-- DESCRIÇÃO DO TIER -->
  <div style="font-size: 10px; color: var(--text-muted); text-align: center; margin-bottom: 10px; font-style: italic;">
    {tierDescription[currentTier]}
  </div>

  <!-- ABAS DE CATEGORIA -->
  <div class="category-tabs">
    <div class="category-tab" class:active={currentCategory === 'all'} on:click={() => currentCategory = 'all'}>
      📦 Todos
    </div>
    {#each Object.entries(currentCategories) as [key, cat]}
      <div class="category-tab" class:active={currentCategory === key} on:click={() => currentCategory = key}>
        {cat.emoji} {cat.name}
      </div>
    {/each}
  </div>

  <!-- ITENS -->
  {#each filteredItems as item}
    {@const canAfford = $availablePoints >= item.cost}
    <div class="card shop-card" 
         style="opacity: {canAfford ? '1' : '0.5'};"
         on:click={() => canAfford && buyItem(item)}>
      <div class="shop-row">
        <div class="shop-emoji">{item.emoji}</div>
        <div class="shop-body">
          <div class="shop-name">{item.name}</div>
        </div>
        <div class="shop-action">
          <div class="shop-cost" style="color: {SHOP_TIERS[currentTier].color};">
            {item.cost}pts
          </div>
          <button class="btn btn-sm shop-btn"
            class:btn-primary={canAfford}
            class:btn-ghost={!canAfford}
            disabled={!canAfford}>
            {canAfford ? 'Comprar' : `Faltam ${item.cost - $availablePoints}`}
          </button>
        </div>
      </div>
    </div>
  {/each}

  {#if filteredItems.length === 0}
    <div class="glass-card" style="text-align: center; padding: 30px;">
      <div style="font-size: 36px;">📭</div>
      <div style="color: var(--text-muted); font-size: 12px;">Nenhum item nesta categoria</div>
    </div>
  {/if}
</div>

<style>
  .toast-popup {
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
    background: var(--bg-card); color: var(--text-primary); padding: 10px 18px;
    border-radius: 25px; font-size: 13px; font-weight: 600; z-index: 1000;
    box-shadow: var(--shadow-lg); border: 1px solid var(--accent);
    animation: toastIn 0.3s ease; white-space: nowrap;
  }
  .tier-tabs {
    display: flex; gap: 4px; margin-bottom: 8px; overflow-x: auto;
    -webkit-overflow-scrolling: touch; padding-bottom: 2px;
  }
  .tier-tab {
    padding: 8px 12px; border-radius: 16px; font-size: 11px; font-weight: 600;
    cursor: pointer; flex-shrink: 0; white-space: nowrap;
    border: 1px solid var(--border); background: var(--bg-card);
    transition: all 0.2s ease;
  }
  .category-tabs {
    display: flex; gap: 3px; margin-bottom: 12px; overflow-x: auto;
    -webkit-overflow-scrolling: touch; padding-bottom: 2px;
  }
  .category-tab {
    padding: 4px 8px; border-radius: 10px; font-size: 9px; cursor: pointer;
    flex-shrink: 0; white-space: nowrap; background: var(--bg-card);
    color: var(--text-muted); border: 1px solid var(--border); transition: all 0.2s ease;
  }
  .category-tab.active {
    background: rgba(98,199,95,0.15); color: #62c75f; border-color: rgba(98,199,95,0.3);
  }
  .shop-card { margin-bottom: 6px; padding: 10px; }
  .shop-row { display: flex; align-items: center; gap: 10px; }
  .shop-emoji { font-size: 24px; flex-shrink: 0; }
  .shop-body { flex: 1; min-width: 0; }
  .shop-name { font-weight: 600; font-size: 12px; }
  .shop-action { text-align: right; flex-shrink: 0; }
  .shop-cost { font-weight: 700; font-size: 13px; }
  .shop-btn { margin-top: 3px; font-size: 9px; padding: 3px 8px; }
  @keyframes toastIn {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
  @media (max-width: 768px) {
    .shop-page { padding: 8px !important; }
    .tier-tab { padding: 6px 8px; font-size: 10px; }
    .category-tab { padding: 3px 6px; font-size: 8px; }
    .shop-emoji { font-size: 20px; }
    .shop-name { font-size: 11px; }
    .shop-cost { font-size: 11px; }
  }
</style>