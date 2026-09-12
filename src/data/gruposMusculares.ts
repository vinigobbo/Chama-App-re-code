export const GRUPOS_MUSCULARES: Record<string, string> = {
  peito: 'Peito',
  costas: 'Costas',
  pernas: 'Pernas',
  gluteos: 'Glúteos',
  ombros: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  abdomen: 'Abdômen',
  panturrilha: 'Panturrilha',
}

export const EMOJI_GRUPO: Record<string, string> = {
  peito: '🏋️',
  costas: '🎽',
  pernas: '🦵',
  gluteos: '🍑',
  ombros: '🤸',
  biceps: '💪',
  triceps: '🦾',
  abdomen: '🔥',
  panturrilha: '🦶',
}

export const ORDEM_GRUPOS = ['peito', 'costas', 'pernas', 'gluteos', 'ombros', 'biceps', 'triceps', 'abdomen', 'panturrilha']

export function nomeGrupo(grupo: string) {
  return GRUPOS_MUSCULARES[grupo] ?? grupo
}