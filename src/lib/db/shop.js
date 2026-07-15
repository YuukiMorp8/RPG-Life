// shop.js - Loja de Recompensas (Filosofia: evolução de mentalidade)
export const SHOP_TIERS = {
  iniciante: { 
    emoji: '🌱', name: 'Iniciante', desc: 'Pequenos mimos diários', color: '#62c75f', range: [15, 45]
  },
  intermediario: { 
    emoji: '🔥', name: 'Intermediário', desc: 'Experiências e conquistas', color: '#d4a44e', range: [100, 400]
  },
  avancado: { 
    emoji: '👑', name: 'Avançado', desc: 'Construindo uma vida melhor', color: '#d7ba63', range: [500, 50000]
  },
};

export const SHOP_CATEGORIES = {
  iniciante: {
    lazer: { emoji: '🎮', name: 'Lazer Digital' },
    comida: { emoji: '🍕', name: 'Comidas & Bebidas' },
    mimo: { emoji: '🎁', name: 'Mimos' },
    experiencia: { emoji: '🌟', name: 'Experiências' },
  },
  intermediario: {
    lazer: { emoji: '🎬', name: 'Lazer Premium' },
    comida: { emoji: '🍽️', name: 'Gastronomia' },
    mimo: { emoji: '🎁', name: 'Recompensas' },
    consumo: { emoji: '🛍️', name: 'Consumo Consciente' },
    bemestar: { emoji: '🌿', name: 'Bem-Estar' },
    objetivo: { emoji: '🎯', name: 'Objetivos' },
  },
  avancado: {
    experiencia: { emoji: '✈️', name: 'Experiências' },
    gastronomia: { emoji: '🍽️', name: 'Gastronomia Premium' },
    conquista: { emoji: '🛍️', name: 'Conquistas' },
    tecnologia: { emoji: '💻', name: 'Tecnologia' },
    viagem: { emoji: '🌍', name: 'Viagens' },
    autocuidado: { emoji: '❤️', name: 'Autocuidado' },
    grandeObjetivo: { emoji: '🏆', name: 'Grandes Objetivos' },
  },
};

export const SHOP_ITEMS = [
  // ==========================================
  // 🌱 INICIANTE (15-45pts) - Pequenos mimos
  // ==========================================
  { id: 'i1', emoji: '🎬', name: '1 episódio de série', cost: 20, tier: 'iniciante', category: 'lazer' },
  { id: 'i2', emoji: '🎮', name: '1h de videogame', cost: 25, tier: 'iniciante', category: 'lazer' },
  { id: 'i3', emoji: '📺', name: '30min de vídeos', cost: 20, tier: 'iniciante', category: 'lazer' },
  { id: 'i4', emoji: '🍫', name: 'Chocolate', cost: 20, tier: 'iniciante', category: 'comida' },
  { id: 'i5', emoji: '🥤', name: 'Refrigerante', cost: 25, tier: 'iniciante', category: 'comida' },
  { id: 'i6', emoji: '🍿', name: 'Pipoca', cost: 20, tier: 'iniciante', category: 'comida' },
  { id: 'i7', emoji: '☕', name: 'Café especial', cost: 25, tier: 'iniciante', category: 'comida' },
  { id: 'i8', emoji: '😴', name: 'Dormir 30min a mais', cost: 20, tier: 'iniciante', category: 'mimo' },
  { id: 'i9', emoji: '🛁', name: 'Banho relaxante longo', cost: 25, tier: 'iniciante', category: 'mimo' },
  { id: 'i10', emoji: '🌅', name: 'Ver o pôr do sol', cost: 20, tier: 'iniciante', category: 'experiencia' },
  { id: 'i11', emoji: '🚶', name: 'Caminhar ouvindo música', cost: 20, tier: 'iniciante', category: 'experiencia' },
  { id: 'i12', emoji: '🍦', name: 'Sorvete', cost: 35, tier: 'iniciante', category: 'comida' },

  // ==========================================
  // 🔥 INTERMEDIÁRIO (100-400pts) - Experiências
  // ==========================================
  { id: 'm1', emoji: '🎬', name: 'Sessão cinema em casa', cost: 120, tier: 'intermediario', category: 'lazer' },
  { id: 'm2', emoji: '📺', name: 'Maratonar temporada (3h)', cost: 180, tier: 'intermediario', category: 'lazer' },
  { id: 'm3', emoji: '🎮', name: 'Noite gamer (4h)', cost: 180, tier: 'intermediario', category: 'lazer' },
  { id: 'm4', emoji: '🍿', name: 'Dia de descanso + filme', cost: 220, tier: 'intermediario', category: 'lazer' },
  { id: 'm5', emoji: '🎉', name: 'Fim de semana livre', cost: 350, tier: 'intermediario', category: 'lazer' },
  { id: 'm10', emoji: '🍕', name: 'Pizza grande', cost: 180, tier: 'intermediario', category: 'comida' },
  { id: 'm11', emoji: '🍔', name: 'Hambúrguer artesanal', cost: 180, tier: 'intermediario', category: 'comida' },
  { id: 'm12', emoji: '🍣', name: 'Sushi', cost: 320, tier: 'intermediario', category: 'comida' },
  { id: 'm13', emoji: '🥩', name: 'Churrasco', cost: 250, tier: 'intermediario', category: 'comida' },
  { id: 'm14', emoji: '🍧', name: 'Açaí completo', cost: 150, tier: 'intermediario', category: 'comida' },
  { id: 'm15', emoji: '☕', name: 'Café em cafeteria', cost: 150, tier: 'intermediario', category: 'comida' },
  { id: 'm16', emoji: '🍰', name: 'Sobremesa especial', cost: 120, tier: 'intermediario', category: 'comida' },
  { id: 'm20', emoji: '🎮', name: 'Comprar jogo barato', cost: 300, tier: 'intermediario', category: 'mimo' },
  { id: 'm21', emoji: '🎬', name: 'Alugar filme', cost: 120, tier: 'intermediario', category: 'mimo' },
  { id: 'm22', emoji: '🎫', name: 'Ir ao cinema', cost: 250, tier: 'intermediario', category: 'mimo' },
  { id: 'm23', emoji: '🛵', name: 'Pedir delivery', cost: 200, tier: 'intermediario', category: 'mimo' },
  { id: 'm24', emoji: '🎲', name: 'Caixa Misteriosa', cost: 300, tier: 'intermediario', category: 'mimo' },
  { id: 'm30', emoji: '📖', name: 'Comprar um livro', cost: 250, tier: 'intermediario', category: 'consumo' },
  { id: 'm31', emoji: '👕', name: 'Comprar uma camiseta', cost: 350, tier: 'intermediario', category: 'consumo' },
  { id: 'm32', emoji: '🎨', name: 'Comprar algo p/ hobby', cost: 300, tier: 'intermediario', category: 'consumo' },
  { id: 'm33', emoji: '🏠', name: 'Decoração p/ casa', cost: 350, tier: 'intermediario', category: 'consumo' },
  { id: 'm40', emoji: '💆', name: 'Massagem', cost: 350, tier: 'intermediario', category: 'bemestar' },
  { id: 'm41', emoji: '🧖', name: 'Spa caseiro', cost: 150, tier: 'intermediario', category: 'bemestar' },
  { id: 'm42', emoji: '🛁', name: 'Banho relaxante completo', cost: 120, tier: 'intermediario', category: 'bemestar' },
  { id: 'm43', emoji: '☀️', name: 'Dia sem obrigações', cost: 400, tier: 'intermediario', category: 'bemestar' },
  { id: 'm44', emoji: '🥐', name: 'Café da manhã especial', cost: 180, tier: 'intermediario', category: 'bemestar' },
  { id: 'm50', emoji: '📖', name: 'Livro novo', cost: 300, tier: 'intermediario', category: 'objetivo' },
  { id: 'm51', emoji: '👕', name: 'Roupa nova', cost: 500, tier: 'intermediario', category: 'objetivo' },
  { id: 'm52', emoji: '👟', name: 'Tênis novo', cost: 1500, tier: 'intermediario', category: 'objetivo' },

  // ==========================================
  // 👑 AVANÇADO (500-50000pts) - Conquistas de vida
  // ==========================================
  // ✈️ Experiências
  { id: 'a1', emoji: '🎫', name: 'Ir ao cinema', cost: 500, tier: 'avancado', category: 'experiencia' },
  { id: 'a2', emoji: '🏛️', name: 'Visitar um museu', cost: 700, tier: 'avancado', category: 'experiencia' },
  { id: 'a3', emoji: '🐠', name: 'Aquário', cost: 1200, tier: 'avancado', category: 'experiencia' },
  { id: 'a4', emoji: '🦁', name: 'Zoológico', cost: 1200, tier: 'avancado', category: 'experiencia' },
  { id: 'a5', emoji: '🎢', name: 'Parque de diversões', cost: 1800, tier: 'avancado', category: 'experiencia' },
  { id: 'a6', emoji: '🎵', name: 'Show/Evento', cost: 2500, tier: 'avancado', category: 'experiencia' },
  { id: 'a7', emoji: '🏕️', name: 'Passeio de fim de semana', cost: 2500, tier: 'avancado', category: 'experiencia' },
  
  // 🍽️ Gastronomia Premium
  { id: 'a10', emoji: '🍽️', name: 'Jantar em restaurante', cost: 800, tier: 'avancado', category: 'gastronomia' },
  { id: 'a11', emoji: '🍣', name: 'Restaurante japonês', cost: 1200, tier: 'avancado', category: 'gastronomia' },
  { id: 'a12', emoji: '🥩', name: 'Churrascaria', cost: 1400, tier: 'avancado', category: 'gastronomia' },
  { id: 'a13', emoji: '☕', name: 'Cafeteria premium', cost: 700, tier: 'avancado', category: 'gastronomia' },
  { id: 'a14', emoji: '👨‍🍳', name: 'Cozinhar receita diferente', cost: 500, tier: 'avancado', category: 'gastronomia' },
  
  // 🛍️ Conquistas
  { id: 'a20', emoji: '📖', name: 'Livro desejado', cost: 700, tier: 'avancado', category: 'conquista' },
  { id: 'a21', emoji: '👕', name: 'Roupa nova', cost: 1800, tier: 'avancado', category: 'conquista' },
  { id: 'a22', emoji: '👟', name: 'Tênis', cost: 3500, tier: 'avancado', category: 'conquista' },
  { id: 'a23', emoji: '🎒', name: 'Mochila', cost: 3000, tier: 'avancado', category: 'conquista' },
  { id: 'a24', emoji: '⌚', name: 'Relógio', cost: 4000, tier: 'avancado', category: 'conquista' },
  
  // 💻 Tecnologia
  { id: 'a30', emoji: '🖱️', name: 'Mouse novo', cost: 2500, tier: 'avancado', category: 'tecnologia' },
  { id: 'a31', emoji: '⌨️', name: 'Teclado', cost: 4500, tier: 'avancado', category: 'tecnologia' },
  { id: 'a32', emoji: '💾', name: 'SSD', cost: 5000, tier: 'avancado', category: 'tecnologia' },
  { id: 'a33', emoji: '🖥️', name: 'Monitor', cost: 12000, tier: 'avancado', category: 'tecnologia' },
  { id: 'a34', emoji: '📱', name: 'Tablet', cost: 18000, tier: 'avancado', category: 'tecnologia' },
  { id: 'a35', emoji: '💻', name: 'Notebook', cost: 35000, tier: 'avancado', category: 'tecnologia' },
  
  // 🌍 Viagens
  { id: 'a40', emoji: '🏙️', name: 'Passeio em outra cidade', cost: 5000, tier: 'avancado', category: 'viagem' },
  { id: 'a41', emoji: '🏖️', name: 'Praia', cost: 8000, tier: 'avancado', category: 'viagem' },
  { id: 'a42', emoji: '🏨', name: 'Hotel', cost: 15000, tier: 'avancado', category: 'viagem' },
  { id: 'a43', emoji: '✈️', name: 'Viagem dos sonhos', cost: 50000, tier: 'avancado', category: 'viagem' },
  
  // ❤️ Autocuidado
  { id: 'a50', emoji: '💇', name: 'Corte de cabelo', cost: 700, tier: 'avancado', category: 'autocuidado' },
  { id: 'a51', emoji: '💆', name: 'Massagem profissional', cost: 1500, tier: 'avancado', category: 'autocuidado' },
  { id: 'a52', emoji: '🧖', name: 'Dia de spa', cost: 2500, tier: 'avancado', category: 'autocuidado' },
  { id: 'a53', emoji: '🥗', name: 'Consulta nutricional', cost: 3000, tier: 'avancado', category: 'autocuidado' },
  { id: 'a54', emoji: '🏋️', name: 'Personal trainer', cost: 3500, tier: 'avancado', category: 'autocuidado' },
  
  // 🏆 Grandes Objetivos
  { id: 'a60', emoji: '🗣️', name: 'Aprender inglês', cost: 10000, tier: 'avancado', category: 'grandeObjetivo' },
  { id: 'a61', emoji: '🚲', name: 'Comprar bicicleta', cost: 15000, tier: 'avancado', category: 'grandeObjetivo' },
  { id: 'a62', emoji: '🚗', name: 'Tirar carteira de motorista', cost: 30000, tier: 'avancado', category: 'grandeObjetivo' },
  { id: 'a63', emoji: '💻', name: 'Comprar computador', cost: 40000, tier: 'avancado', category: 'grandeObjetivo' },
  { id: 'a64', emoji: '🏍️', name: 'Comprar uma moto', cost: 150000, tier: 'avancado', category: 'grandeObjetivo' },
  { id: 'a65', emoji: '✈️', name: 'Viagem internacional', cost: 300000, tier: 'avancado', category: 'grandeObjetivo' },
];