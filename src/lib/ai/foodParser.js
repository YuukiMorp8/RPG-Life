// foodParser.js - Versão Final com Supabase + Validação de Pesos
import { FOODS_DB, FOOD_SYNONYMS } from '../db/foods.js';
import { findFood, saveFood } from '../db/supabase.js';

const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const memoryCache = new Map();
const LOCAL_DB_KEY = 'foods_local_cache';

// ============================================
// 🎨 EMOJIS
// ============================================

const FOOD_EMOJIS = {
  'bolo': '🍰', 'torta': '🥧', 'chocolate': '🍫',
  'pão': '🍞', 'macarrão': '🍝', 'pizza': '🍕',
  'salsicha': '🌭', 'linguiça': '🌭', 'carne': '🥩', 'frango': '🍗',
  'peixe': '🐟', 'mortadela': '🥓', 'presunto': '🥓', 'bacon': '🥓',
  'ovo': '🥚', 'leite': '🥛', 'queijo': '🧀', 'manteiga': '🧈',
  'arroz': '🍚', 'feijão': '🫘',
  'café': '☕', 'chá': '🍵', 'suco': '🧃',
  'coca-cola': '🥤', 'coca cola': '🥤', 'refrigerante': '🥤',
  'miojo': '🍜', 'hambúrguer': '🍔', 'coxinha': '🍗',
  'melancia': '🍉', 'salada': '🥗', 'batata': '🥔',
  'bisteca': '🥩', 'porco': '🥩', 'costela': '🥩',
};

function getFoodEmoji(name) {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(FOOD_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '🍽️';
}

// ============================================
// 📏 MEDIDAS PADRÃO
// ============================================

const DEFAULT_MEASURES = {
  'arroz': 'colher', 'feijão': 'concha', 'macarrão': 'garfada',
  'leite': 'copo', 'café': 'xícara', 'chá': 'xícara', 'suco': 'copo',
  'água': 'copo', 'refrigerante': 'copo', 'coca': 'lata',
  'carne': 'pedaço', 'frango': 'pedaço', 'peixe': 'pedaço',
  'pão': 'unidade', 'ovo': 'unidade', 'bolo': 'fatia', 'torta': 'fatia',
  'sopa': 'prato', 'salada': 'prato', 'queijo': 'fatia',
  'mortadela': 'fatia', 'presunto': 'fatia', 'manteiga': 'colher',
  'batata': 'unidade', 'maçã': 'unidade', 'banana': 'unidade',
  'miojo': 'pacote', 'hambúrguer': 'unidade', 'coxinha': 'unidade',
  'pizza': 'pedaço', 'bisteca': 'unidade',
};

const INDUSTRIALIZED_FOODS = {
  'miojo': { weight: 350, unit: 'pacote preparado' },
  'coca-cola': { weight: 350, unit: 'lata 350ml' },
  'coca cola': { weight: 350, unit: 'lata 350ml' },
  'coca': { weight: 350, unit: 'lata 350ml' },
  'doritos': { weight: 84, unit: 'pacote pequeno' },
  'ruffles': { weight: 100, unit: 'pacote' },
};

// 📏 Limites de peso por medida
const MEASURE_LIMITS = {
  'colher': { min: 15, max: 40, default: 25 },
  'garfo': { min: 25, max: 60, default: 40 },
  'garfada': { min: 25, max: 60, default: 40 },
  'concha': { min: 70, max: 120, default: 90 },
  'fatia': { min: 30, max: 100, default: 60 },
  'copo': { min: 150, max: 350, default: 200 },
  'xicara': { min: 150, max: 250, default: 200 },
  'xícara': { min: 150, max: 250, default: 200 },
  'prato': { min: 150, max: 400, default: 250 },
  'unidade': { min: 30, max: 250, default: 100 },
  'pedaço': { min: 50, max: 200, default: 100 },
  'pedaco': { min: 50, max: 200, default: 100 },
  'bisteca': { min: 100, max: 200, default: 150 },
  'filé': { min: 80, max: 200, default: 120 },
  'file': { min: 80, max: 200, default: 120 },
  'porção': { min: 50, max: 300, default: 100 },
  'porcao': { min: 50, max: 300, default: 100 },
  'lata': { min: 250, max: 400, default: 350 },
  'pacote': { min: 50, max: 500, default: 85 },
};

function getDefaultMeasure(foodName) {
  const name = normalize(foodName);
  for (const [key, measure] of Object.entries(DEFAULT_MEASURES)) {
    if (name.includes(key)) return measure;
  }
  return 'porção';
}

function getIndustrializedInfo(foodName) {
  const name = normalize(foodName);
  for (const [key, info] of Object.entries(INDUSTRIALIZED_FOODS)) {
    if (name.includes(key)) return info;
  }
  return null;
}

function validateMeasureWeight(measure, weight) {
  if (!measure) return weight;
  
  const cleanMeasure = normalize(measure).replace(/es$/, '').replace(/s$/, '');
  
  for (const [key, limits] of Object.entries(MEASURE_LIMITS)) {
    if (cleanMeasure.includes(key) || key.includes(cleanMeasure)) {
      if (weight < limits.min || weight > limits.max) {
        console.log(`⚠️ Peso ajustado: ${measure} ${weight}g → ${limits.default}g`);
        return limits.default;
      }
      return weight;
    }
  }
  
  if (weight < 5 || weight > 500) {
    console.log(`⚠️ Peso suspeito: ${measure} ${weight}g → 100g`);
    return 100;
  }
  
  return weight;
}

// ============================================
// 📚 UTILITÁRIOS
// ============================================

function normalize(str) {
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_/]/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

function findInLocalDB(foodName) {
  const clean = normalize(foodName);
  return FOODS_DB[clean] || null;
}

function persistLocalDB() {
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(FOODS_DB));
  } catch (e) {
    console.log('⚠️ Cache local cheio');
  }
}

(function loadLocalDB() {
  try {
    const saved = localStorage.getItem(LOCAL_DB_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(FOODS_DB, parsed);
      console.log(`📚 Cache local: ${Object.keys(parsed).length} alimentos`);
    }
  } catch (e) {
    console.log('⚠️ Sem cache local');
  }
})();

// ============================================
// 🔧 EXTRAI ITENS DO TEXTO
// ============================================

function extractFoodItems(text) {
  text = text.replace(/[""]/g, '');

  text = text.replace(/um\s+ovo\s+e\s+meio\b/gi, '1.5 ovo');
  text = text.replace(/dois\s+ovos\s+e\s+meio\b/gi, '2.5 ovos');
  text = text.replace(/uma\s+(\w+)\s+e\s+meia\b/gi, '1.5 $1');
  text = text.replace(/duas\s+(\w+)\s+e\s+meia\b/gi, '2.5 $1');
  text = text.replace(/^meio\s+/i, '0.5 ');
  text = text.replace(/^meia\s+/i, '0.5 ');

  const numberWords = {
    'um': '1', 'uma': '1', 'dois': '2', 'duas': '2', 'três': '3', 'tres': '3',
    'quatro': '4', 'cinco': '5', 'seis': '6', 'sete': '7', 'oito': '8',
    'nove': '9', 'dez': '10'
  };

  let processedText = ' ' + text + ' ';
  for (const [word, num] of Object.entries(numberWords)) {
    processedText = processedText.replace(new RegExp(`\\s${word}\\s`, 'gi'), ` ${num} `);
  }
  processedText = processedText.trim();

  processedText = processedText.replace(/(\d+)\s+(\w+)\s+e\s+meio\b/gi, '$1.5 $2');
  processedText = processedText.replace(/(\d+)\s+(\w+)\s+e\s+meia\b/gi, '$1.5 $2');

  const contextWords = [
    'hoje', 'ontem', 'amanhã', 'tomei', 'comi', 'almocei', 'jantei', 'lanchei',
    'foram', 'foi', 'À tarde', 'à tarde', 'À noite', 'à noite', 'de manhã',
    'no almoço', 'no jantar', 'no café'
  ];

  for (const word of contextWords) {
    processedText = processedText.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
  }

  processedText = processedText.replace(/\s+/g, ' ').trim();

  const parts = processedText.split(/\s*,\s*|\s+e\s+|\.\s*/);
  const items = [];

  for (const part of parts) {
    let str = part.trim();
    if (!str || str.length < 2) continue;

    let quantity = 1;
    let directGrams = null;
    let directMl = null;

    const gramsMatch = str.match(/^(\d+)\s*g\b/i);
    if (gramsMatch) {
      directGrams = parseInt(gramsMatch[1]);
      quantity = 1;
      str = str.replace(/^\d+\s*g\b\s*/i, '');
    }

    const kgMatch = str.match(/^(\d+)\s*kg\b/i);
    if (kgMatch) {
      directGrams = parseInt(kgMatch[1]) * 1000;
      quantity = 1;
      str = str.replace(/^\d+\s*kg\b\s*/i, '');
    }

    const mlMatch = str.match(/^(\d+)\s*ml\b/i);
    if (mlMatch) {
      directMl = parseInt(mlMatch[1]);
      quantity = 1;
      str = str.replace(/^\d+\s*ml\b\s*/i, '');
    }

    if (!directGrams && !directMl) {
      const fractionMatch = str.match(/^(\d+)\/(\d+)/);
      if (fractionMatch) {
        quantity = parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
        str = str.replace(/^\d+\/\d+\s*/, '');
      }

      if (quantity === 1) {
        const decimalMatch = str.match(/^(\d+)[.,](\d+)/);
        if (decimalMatch) {
          quantity = parseFloat(decimalMatch[0].replace(',', '.'));
          str = str.replace(/^\d+[.,]\d+\s*/, '');
        }
      }

      if (quantity === 1) {
        const intMatch = str.match(/^(\d+)/);
        if (intMatch) {
          quantity = parseInt(intMatch[1]);
          str = str.replace(/^\d+\s*/, '');
        }
      }
    }

    const lowerStr = str.toLowerCase();
    if (lowerStr.startsWith('bastante ') || lowerStr.startsWith('muito ')) {
      if (quantity === 1 && !directGrams && !directMl) quantity = 1.8;
      str = str.replace(/^(bastante|muito)\s+/i, '');
    }
    if (lowerStr.startsWith('pouco ') || lowerStr.startsWith('um pouco ')) {
      if (quantity === 1 && !directGrams && !directMl) quantity = 0.5;
      str = str.replace(/^(pouco|um pouco)\s+/i, '');
    }

    str = str.replace(/^(À tarde|à tarde|À noite|à noite|de manhã)\s*/i, '');

    const words = str.split(' ');

    const removeWords = ['comi', 'almocei', 'jantei', 'tomei', 'bebi', 'lanchei',
                         'só', 'apenas', 'hoje', 'ontem', 'depois', 'então', 'no', 'na',
                         'foram', 'foi', 'tarde', 'noite', 'manhã'];
    while (words.length > 0 && removeWords.includes(words[0].toLowerCase())) {
      words.shift();
    }

    if (words[0]?.toLowerCase() === 'com') {
      words.shift();
    }

    let measure = null;
    const deIndex = words.indexOf('de');
    if (deIndex > 0 && !directGrams && !directMl) {
      measure = words[deIndex - 1];
      measure = measure.replace(/es$/, '').replace(/s$/, '');
      words.splice(0, deIndex + 1);
    }

    const compoundConnectors = ['arroz com feijão', 'café com leite', 'pão com ovo',
                                 'macarrão com queijo', 'cuscuz com leite'];

    const fullName = words.join(' ').trim();
    const isCompound = compoundConnectors.some(c => fullName.includes(c));

    if (!isCompound) {
      const comIndex = words.indexOf('com');
      if (comIndex > 0) {
        const mainFood = words.slice(0, comIndex).join(' ');
        const extras = words.slice(comIndex + 1).join(' ').split(/\s+e\s+/);

        if (mainFood && mainFood.length > 0) {
          items.push({ name: mainFood, quantity, measure, directGrams, directMl });
        }

        for (const extra of extras) {
          const extraTrimmed = extra.trim();
          if (extraTrimmed && extraTrimmed.length > 0) {
            items.push({ name: extraTrimmed, quantity: 0.5, measure: null, directGrams: null, directMl: null });
          }
        }
        continue;
      }
    }

    if (fullName && fullName.length > 0) {
      items.push({ name: fullName, quantity, measure, directGrams, directMl });
      console.log(`   📐 "${part.trim()}" → ${quantity} ${measure || (directGrams ? directGrams + 'g' : directMl ? directMl + 'ml' : 'porção')} de ${fullName}`);
    }
  }

  return items;
}

// ============================================
// 🧠 BUSCA NA IA
// ============================================

async function searchAndSave(foodName, measure, directGrams, directMl) {
  let query;

  if (directGrams) {
    query = `${directGrams}g de ${foodName}`;
  } else if (directMl) {
    query = `${directMl}ml de ${foodName}`;
  } else {
    query = `1 ${measure} de ${foodName}`;
  }

  console.log(`🔍 Buscando IA: "${query}"`);

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [{
          role: 'system',
          content: `Busque dados nutricionais. Retorne APENAS este JSON:

{
  "name": "nome do alimento PRONTO PARA CONSUMO",
  "state": "cozido|frito|assado|cru|grelhado",
  "kcal_100g": numero,
  "protein_100g": numero,
  "carbs_100g": numero,
  "fat_100g": numero,
  "fiber_100g": numero,
  "measure_weight_g": numero,
  "source_name": "site",
  "source_url": "url"
}

REGRAS:
1. Se for gramas/mL diretos, use o peso/volume exato
2. Para industrializados, use a porção real do pacote
3. NUNCA misture alimento seco com medida cozida
4. measure_weight_g SEMPRE em gramas`
        }, {
          role: 'user',
          content: `Dados nutricionais para: ${query}`
        }],
        temperature: 0.1,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log('📝 IA:', content.substring(0, 150));

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const info = JSON.parse(jsonMatch[0]);

    // 🆕 Valida o peso da medida
    const validatedWeight = validateMeasureWeight(measure, info.measure_weight_g || 100);

    const key = normalize(info.name);
    FOODS_DB[key] = {
      name: info.name,
      state: info.state || 'pronto',
      kcal: info.kcal_100g,
      protein: info.protein_100g || 0,
      carbs: info.carbs_100g || 0,
      fat: info.fat_100g || 0,
      fiber: info.fiber_100g || 0,
      measure_weight_g: validatedWeight,
      emoji: getFoodEmoji(info.name),
      source_name: info.source_name || 'Web',
      source_url: info.source_url || '#',
    };

    persistLocalDB();
    console.log(`✅ Salvo local: ${info.name} | ${validatedWeight}g | ${info.kcal_100g} kcal/100g`);
    return FOODS_DB[key];

  } catch (e) {
    console.log('❌ Erro IA:', e.message);
    return null;
  }
}

// ============================================
// 🎯 FUNÇÃO PRINCIPAL
// ============================================

export async function parseFood(text) {
  if (!text || text.trim().length === 0) return [];

  const cacheKey = normalize(text);
  if (memoryCache.has(cacheKey)) {
    console.log('📦 Cache memória');
    return memoryCache.get(cacheKey);
  }

  try {
    console.log('📝 Texto:', text);

    const foodItems = extractFoodItems(text);
    if (foodItems.length === 0) return [];

    const results = [];

    for (const item of foodItems) {
      const measure = item.measure || getDefaultMeasure(item.name);

      let food = findInLocalDB(item.name);
      if (food) console.log(`💾 Local: ${item.name}`);

      if (!food) {
        const remote = await findFood(item.name);
        if (remote) {
          food = remote;
          FOODS_DB[normalize(remote.name)] = remote;
          persistLocalDB();
          console.log(`🌐 Supabase: ${item.name}`);
        }
      }

      if (!food) {
        food = await searchAndSave(item.name, measure, item.directGrams, item.directMl);

        if (food) {
          saveFood(food).then(ok => {
            if (ok) console.log(`☁️ Supabase salvo: ${food.name}`);
          });
        }
      }

      if (food) {
        let totalGrams;
        if (item.directGrams) {
          totalGrams = item.directGrams;
        } else if (item.directMl) {
          totalGrams = item.directMl;
        } else {
          const industrial = getIndustrializedInfo(item.name);
          if (industrial && item.quantity === 1 && !item.measure) {
            totalGrams = industrial.weight;
          } else {
            totalGrams = item.quantity * (food.measure_weight_g || 100);
          }
        }

        const factor = totalGrams / 100;

        results.push({
          name: food.name,
          quantity: item.quantity,
          unit: item.directGrams ? 'g' : item.directMl ? 'ml' : measure,
          totalGrams: Math.round(totalGrams),
          kcal: Math.round(food.kcal * factor),
          protein: Math.round((food.protein || 0) * factor * 10) / 10,
          carbs: Math.round((food.carbs || 0) * factor * 10) / 10,
          fat: Math.round((food.fat || 0) * factor * 10) / 10,
          fiber: Math.round((food.fiber || 0) * factor * 10) / 10,
          emoji: food.emoji || getFoodEmoji(food.name),
          source_name: food.source_name || 'Web',
          source_url: food.source_url || '#',
          fromAI: true,
        });
      }
    }

    if (results.length === 0) return [];

    memoryCache.set(cacheKey, results);

    console.log('━━━━━━━━━━━━━━━━━━━━━━');
    results.forEach(item => {
      console.log(`${item.emoji} ${item.name} ×${item.quantity} ${item.unit} (${item.totalGrams}g)`);
      console.log(`   🔥 ${item.kcal} kcal`);
    });
    console.log(`📊 Total: ${results.reduce((s, i) => s + i.kcal, 0)} kcal`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━');

    return results;

  } catch (e) {
    console.log('❌ Erro:', e.message);
    return [];
  }
}

setInterval(() => memoryCache.clear(), 30 * 60 * 1000);