<script>
  import Header from './components/Header.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import Missions from './pages/Missions.svelte';
  import Shop from './pages/Shop.svelte';
  import ProfileConfig from './pages/ProfileConfig.svelte';
  import Attributes from './pages/Attributes.svelte';
  import Analytics from './pages/Analytics.svelte';
  import About from './pages/About.svelte';
  import { currentTab } from './lib/stores/game.js';
  import Diary from './pages/Diary.svelte';
  import { onMount } from 'svelte';
  
  onMount(() => {
    console.log('⚔️ Life RPG iniciado!');
    console.log('💾 Dados carregados automaticamente');
  });
</script>

<div class="app-container">
  <Sidebar />
  
  <main class="main-content">
    <Header />
    <div class="content-area">
      {#if $currentTab === 'dashboard'}
        <Dashboard />
      {:else if $currentTab === 'missions'}
        <Missions />
      {:else if $currentTab === 'attributes'}
        <Attributes />
      {:else if $currentTab === 'shop'}
        <Shop />
      {:else if $currentTab === 'profile'}
        <ProfileConfig />
      {:else if $currentTab === 'analytics'}
        <Analytics />
      {:else if $currentTab === 'about'}
        <About />
      {:else if $currentTab === 'diary'}
        <Diary />
      {:else if $currentTab === 'diary'}
        <div class="glass-card" style="text-align: center; padding: 30px;">
          <div style="font-size: 40px;">🍽️</div>
          <div style="color: var(--text-muted); margin: 8px 0; font-size: 14px;">Diário em breve...</div>
        </div>
      {:else}
        <div class="glass-card" style="text-align: center; padding: 30px;">
          <div style="font-size: 40px;">📦</div>
          <div style="color: var(--text-muted); margin: 8px 0; font-size: 14px;">Em breve...</div>
        </div>
      {/if}
    </div>
  </main>
</div>