<script>
  import { currentTab } from '../lib/stores/game.js';
  
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Início' },
    { id: 'missions', icon: '📋', label: 'Missões' },
    { id: 'diary', icon: '🍽️', label: 'Diário' },
    { id: 'attributes', icon: '⚔️', label: 'Atributos' }, 
    { id: 'shop', icon: '🛒', label: 'Loja' },
    { id: 'profile', icon: '⚙️', label: 'Perfil' },
    { id: 'analytics', icon: '📊', label: 'Crônicas' },
    { id: 'about', icon: 'ℹ️', label: 'Sobre' },
  ];
</script>

<nav class="sidebar">
  <div class="sidebar-header">
    <div class="avatar-small">⚔️</div>
    <div class="sidebar-title">Life RPG</div>
  </div>
  <div class="sidebar-nav">
    {#each navItems as item}
      <div 
        class="nav-item" 
        class:active={$currentTab === item.id}
        on:click={() => currentTab.set(item.id)}
        role="button"
        tabindex="0"
        on:keypress={(e) => e.key === 'Enter' && currentTab.set(item.id)}
      >
        <span class="nav-icon">{item.icon}</span>
        <span class="nav-label">{item.label}</span>
      </div>
    {/each}
  </div>
</nav>