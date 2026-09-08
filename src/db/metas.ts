import { getBanco } from './database'

export async function buscarMetas() {
  const db = getBanco()
  return await db.getAllAsync<{
    id: number
    nome: string
    tipo: string
    valor_alvo: number
    unidade: string | null
    data_inicio: string
    data_fim: string
  }>('SELECT * FROM metas_semestrais ORDER BY data_fim ASC')
}

export async function criarMeta(
  nome: string,
  tipo: string,
  valorAlvo: number,
  unidade: string | null,
  dataInicio: string,
  dataFim: string
) {
  const db = getBanco()
  await db.runAsync(
    'INSERT INTO metas_semestrais (nome, tipo, valor_alvo, unidade, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, tipo, valorAlvo, unidade, dataInicio, dataFim]
  )
}

export async function excluirMeta(id: number) {
  const db = getBanco()
  await db.runAsync('DELETE FROM registros_progresso WHERE meta_id = ?', [id])
  await db.runAsync('DELETE FROM metas_semestrais WHERE id = ?', [id])
}

export async function buscarUltimoProgresso(metaId: number) {
  const db = getBanco()
  return await db.getFirstAsync<{ valor: number; data: string }>(
    'SELECT valor, data FROM registros_progresso WHERE meta_id = ? ORDER BY data DESC LIMIT 1',
    [metaId]
  )
}

export async function registrarProgresso(metaId: number, data: string, valor: number) {
  const db = getBanco()
  await db.runAsync(
    'INSERT INTO registros_progresso (meta_id, data, valor) VALUES (?, ?, ?)',
    [metaId, data, valor]
  )
}