// index.js - Exporta tudo unificado
import { EXERCICIOS_CASA } from './casa.js';
import { EXERCICIOS_AR_LIVRE } from './arLivre.js';
import { EXERCICIOS_ACADEMIA } from './academia.js';

export { EXERCICIOS_CASA, EXERCICIOS_AR_LIVRE, EXERCICIOS_ACADEMIA };

export { 
  TIPOS_EXERCICIO, 
  GRUPOS_MUSCULARES, 
  EQUIPAMENTOS, 
  LOCAIS, 
  IMPACTO,
  GOAL_CONFIG,
  INTENSITY_CONFIG,
  WEEKLY_SPLITS
} from './classificacao.js';

// Banco completo unificado
export const ALL_EXERCISES = {
  casa: EXERCICIOS_CASA,
  ar_livre: EXERCICIOS_AR_LIVRE,
  academia: EXERCICIOS_ACADEMIA,
};