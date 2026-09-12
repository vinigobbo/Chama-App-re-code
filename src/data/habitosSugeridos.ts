export type HabitoSugerido = {
  nome: string
  tipo: string
  emoji: string
}

export const HABITOS_SUGERIDOS: HabitoSugerido[] = [
  { nome: 'Academia', tipo: 'saude', emoji: '🏋️' },
  { nome: 'Beber água', tipo: 'saude', emoji: '💧' },
  { nome: 'Dormir cedo', tipo: 'saude', emoji: '😴' },
  { nome: 'Meditar', tipo: 'saude', emoji: '🧘' },
  { nome: 'Arrumar a cama', tipo: 'saude', emoji: '🛏️' },
  { nome: 'Estudar', tipo: 'estudo', emoji: '📚' },
  { nome: 'Ler', tipo: 'estudo', emoji: '📖' },
  { nome: 'Inglês', tipo: 'estudo', emoji: '🗣️' },
  { nome: 'Investir', tipo: 'financeiro', emoji: '📈' },
  { nome: 'Trabalho', tipo: 'trabalho', emoji: '💻' },
]