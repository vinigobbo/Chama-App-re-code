import { getBanco } from './database'

export async function buscarHabitosAtivos() {
  const db = getBanco()
  return await db.getAllAsync<{
    id: number
    nome: string
    icone: string | null
    ativo: number
  }>('SELECT * FROM habitos WHERE ativo = 1')
}

export async function criarHabito(nome: string, icone?: string) {
  const db = getBanco()
  await db.runAsync(
    'INSERT INTO habitos (nome, icone) VALUES (?, ?)',
    [nome, icone ?? null]
  )
}

export async function desativarHabito(id: number) {
  const db = getBanco()
  await db.runAsync(
    'UPDATE habitos SET ativo = 0 WHERE id = ?',
    [id]
  )
}