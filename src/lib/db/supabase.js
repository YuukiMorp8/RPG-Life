// db/supabase.js - Versão melhorada
const SUPABASE_URL = 'https://lecewuhurvuuujeuafzt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlY2V3dWh1cnZ1dXVqZXVhZnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMjQ2MTcsImV4cCI6MjA5OTcwMDYxN30.rmQeaNa_IK3oWIHr3dbxYDDmEEdXT1tHDdG4wyC38eo';

function normalize(str) {
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_/]/g, ' ')  // 🔧 Coca-Cola → coca cola
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

function calculateScore(searchTerm, foundName) {
  const search = normalize(searchTerm);
  const found = normalize(foundName);
  
  let score = 0;
  
  // Correspondência exata
  if (search === found) return 100;
  
  // Contém o termo inteiro
  if (found.includes(search)) {
    score += 80;
    // Bônus se começa com o termo
    if (found.startsWith(search)) score += 10;
  }
  
  // Palavras em comum
  const searchWords = search.split(' ');
  const foundWords = found.split(' ');
  
  for (const sw of searchWords) {
    for (const fw of foundWords) {
      if (fw === sw) score += 20;
      else if (fw.includes(sw) || sw.includes(fw)) score += 10;
    }
  }
  
  return score;
}

export async function findFood(name, minScore = 30) {
  const clean = normalize(name);
  
  try {
    // Busca com ilike para correspondência parcial
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/foods?or=(name_normalized.ilike.*${encodeURIComponent(clean.split(' ')[0])}*)&limit=5`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    
    const data = await res.json();
    
    if (!data || data.length === 0) return null;
    
    // Calcula score e pega o melhor
    const scored = data.map(food => ({
      food,
      score: calculateScore(name, food.name)
    }));
    
    scored.sort((a, b) => b.score - a.score);
    
    if (scored[0].score >= minScore) {
      console.log(`🌐 Supabase: "${scored[0].food.name}" (score: ${scored[0].score})`);
      return scored[0].food;
    }
    
    return null;
  } catch (e) {
    console.log('⚠️ Supabase offline');
    return null;
  }
}

export async function saveFood(food) {
  try {
    const clean = normalize(food.name);
    
    // Verifica se já existe
    const existing = await fetch(
      `${SUPABASE_URL}/rest/v1/foods?name_normalized=eq.${encodeURIComponent(clean)}&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    
    const existingData = await existing.json();
    
    if (existingData && existingData.length > 0) {
      // Update
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/foods?name_normalized=eq.${encodeURIComponent(clean)}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            kcal: food.kcal,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            fiber: food.fiber,
            updated_at: new Date().toISOString(),
          }),
        }
      );
      console.log(`🔄 Atualizado: ${food.name}`);
      return res.ok;
    }
    
    // Insert
    const res = await fetch(`${SUPABASE_URL}/rest/v1/foods`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        name: food.name,
        name_normalized: clean,
        kcal: food.kcal,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fat: food.fat || 0,
        fiber: food.fiber || 0,
        state: food.state || 'pronto',
        measure_weight_g: food.measure_weight_g || 100,
        emoji: food.emoji || '🍽️',
        source_name: food.source_name || 'IA',
        source_url: food.source_url || '#',
        created_at: new Date().toISOString(),
      }),
    });
    
    if (res.ok) console.log(`☁️ Salvo: ${food.name}`);
    return res.ok;
  } catch (e) {
    console.log('⚠️ Erro ao salvar no Supabase');
    return false;
  }
}