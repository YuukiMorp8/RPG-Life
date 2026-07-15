// attributeMapping.js - Mapeamento de missões para atributos

export const MISSION_ATTRIBUTE_MAP = {
  // 🏋️ Corpo → Vigor
  'free_s1': 'vigor', 'free_s2': 'vigor', 'free_s3': 'vigor',
  'free_s4': 'vigor', 'free_s5': 'vigor', 'free_s6': 'vigor',
  'free_s7': 'vigor', 'free_s8': 'vigor',
  'daily_s1': 'vigor', 'daily_s2': 'vigor', 'daily_s3': 'vigor',
  'daily_s4': 'vigor', 'daily_s5': 'vigor', 'daily_s6': 'vigor',
  'insp_s1': 'vigor', 'insp_s2': 'vigor', 'insp_s3': 'vigor', 'insp_s4': 'vigor',
  
  // 🧠 Mente → Mente
  'm_l_1': 'mente', 'm_l_2': 'mente', 'm_l_3': 'mente', 'm_l_4': 'mente',
  'm_i_1': 'mente', 'm_i_2': 'mente', 'm_i_3': 'mente', 'm_i_4': 'mente',
  'm_p_1': 'mente', 'm_p_2': 'mente', 'm_p_3': 'mente', 'm_p_4': 'mente', 'm_p_5': 'mente', 'm_p_6': 'mente',
  'm_e_1': 'mente', 'm_e_2': 'mente', 'm_e_3': 'mente',
  'm_c_1': 'mente', 'm_c_2': 'mente', 'm_c_3': 'mente', 'm_c_4': 'mente',
  'm_mt_1': 'mente', 'm_mt_2': 'mente',
  
  // ❤️ Saúde → Disciplina
  's_h_1': 'disciplina', 's_h_2': 'disciplina', 's_h_3': 'disciplina',
  's_a_1': 'vigor', 's_a_2': 'vigor', 's_a_3': 'vigor', 's_a_4': 'disciplina', 's_a_5': 'disciplina',
  's_s_1': 'disciplina', 's_s_2': 'disciplina', 's_s_3': 'disciplina',
  's_hi_1': 'disciplina', 's_hi_2': 'disciplina', 's_hi_3': 'disciplina', 's_hi_4': 'disciplina',
  's_sm_1': 'alma', 's_sm_2': 'alma', 's_sm_3': 'alma', 's_sm_4': 'disciplina',
  's_o_1': 'disciplina', 's_o_2': 'disciplina', 's_o_3': 'disciplina', 's_o_4': 'disciplina', 's_o_5': 'disciplina',
  
  // 🌱 Bem-Estar → Alma
  'b_n_1': 'alma', 'b_n_2': 'alma', 'b_n_3': 'alma', 'b_n_4': 'alma',
  'b_s_1': 'alma', 'b_s_2': 'alma', 'b_s_3': 'alma', 'b_s_4': 'alma',
  'b_f_1': 'disciplina', 'b_f_2': 'disciplina', 'b_f_3': 'disciplina', 'b_f_4': 'mente',
  'b_l_1': 'disciplina', 'b_l_2': 'disciplina', 'b_l_3': 'disciplina', 'b_l_4': 'disciplina',
  'b_lz_1': 'alma', 'b_lz_2': 'alma', 'b_lz_3': 'alma',
};

// Quantidade de XP por atributo ao completar missão
export const ATTRIBUTE_XP_GAIN = {
  vigor: 5,
  mente: 5,
  disciplina: 5,
  alma: 5,
};