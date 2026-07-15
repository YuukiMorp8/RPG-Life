# 🍽️ Life RPG - Diário Alimentar

Diário alimentar inteligente com IA que entende linguagem natural. Escreva frases como "2 ovos, 1 pão com manteiga" e o app calcula automaticamente as calorias.

## ✨ Funcionalidades

- 🧠 **IA com busca na web** - Perplexity API busca dados nutricionais reais
- 💾 **Banco auto-expansível** - Alimentos descobertos são salvos no Supabase
- ⚡ **Cache multicamada** - localStorage → Supabase → IA
- 🕐 **Relógio ajustável** - Corrija o horário das refeições
- 📊 **Detalhamento nutricional** - kcal, proteínas, carboidratos, gorduras
- 🎨 **Emojis automáticos** - Cada alimento recebe o emoji correto
- 📏 **Medidas caseiras** - Colher, concha, fatia, copo, etc
- 🔢 **Linguagem natural** - "meio", "bastante", "1 e meio"

## 🚀 Tecnologias

- **Frontend:** Svelte
- **IA:** Perplexity API (Sonar Pro)
- **Banco:** Supabase (PostgreSQL)
- **Hospedagem:** Render
- **Cache:** localStorage + Map

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/life-rpg.git

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas chaves

# Rode em desenvolvimento
npm run dev
