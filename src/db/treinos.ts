import { getBanco } from './database'

export async function buscarTreinos() {
  const db = getBanco()
  return await db.getAllAsync(
    'SELECT * FROM treinos ORDER BY id ASC'
  ) as Array<{ id: number; nome: string }>
}

export async function criarTreino(nome: string) {
  const db = getBanco()
  await db.runAsync('INSERT INTO treinos (nome) VALUES (?)', [nome])
}

export async function excluirTreino(id: number) {
  const db = getBanco()
  await db.runAsync('DELETE FROM treino_exercicios WHERE treino_id = ?', [id])
  await db.runAsync('DELETE FROM treinos WHERE id = ?', [id])
}

export async function buscarExerciciosDoTreino(treinoId: number) {
  const db = getBanco()
  return await db.getAllAsync(
    'SELECT * FROM treino_exercicios WHERE treino_id = ? ORDER BY ordem ASC, id ASC',
    [treinoId]
  ) as Array<{ id: number; treino_id: number; nome: string; grupo: string; notas: string | null; ordem: number }>
}

export async function adicionarExercicio(treinoId: number, nome: string, grupo: string) {
  const db = getBanco()
  const ultimo = await db.getFirstAsync(
    'SELECT MAX(ordem) as maxOrdem FROM treino_exercicios WHERE treino_id = ?',
    [treinoId]
  ) as { maxOrdem: number | null } | null
  const proximaOrdem = (ultimo?.maxOrdem ?? -1) + 1
  await db.runAsync(
    'INSERT INTO treino_exercicios (treino_id, nome, grupo, ordem) VALUES (?, ?, ?, ?)',
    [treinoId, nome, grupo, proximaOrdem]
  )
}

export async function removerExercicio(id: number) {
  const db = getBanco()
  await db.runAsync('DELETE FROM treino_exercicios WHERE id = ?', [id])
}

export async function atualizarNotas(id: number, notas: string) {
  const db = getBanco()
  await db.runAsync('UPDATE treino_exercicios SET notas = ? WHERE id = ?', [notas, id])
}