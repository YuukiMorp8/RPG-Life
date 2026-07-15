<script>
  import { playerLevel, levelName, xpProgress, availablePoints, streakDays } from '../lib/stores/game.js';
</script>

<header class="top-header">
  <div style="display: flex; align-items: center; gap: 16px; width: 100%;">
    <div style="
      width: 44px; height: 44px;
      background: linear-gradient(135deg, #6366f1, #818cf8);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; flex-shrink: 0; border: 2px solid #6366f1;
    ">⚔️</div>
    
    <div style="flex: 1; min-width: 0;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 700; font-size: 13px; color: #6366f1;">{$levelName}</span>
        <span class="badge badge-info">Nv.{$playerLevel}</span>
      </div>
      <div class="progress" style="margin-top: 6px; height: 6px;">
        <div class="progress-fill progress-accent" style="width: {$xpProgress}%;"></div>
      </div>
    </div>

    <div style="display: flex; gap: 12px;">
      <div style="text-align: center;">
        <div style="font-size: 11px; color: #686880;">💰</div>
        <div style="font-weight: 700; color: #fbbf24; font-size: 15px;">{$availablePoints}</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 11px; color: #686880;">🔥</div>
        <div style="font-weight: 700; color: #f59e0b; font-size: 15px;">{$streakDays}</div>
      </div>
    </div>
  </div>
</header>