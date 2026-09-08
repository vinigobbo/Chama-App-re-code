import { getBanco } from './database'

export async function buscarRegistrosDeHoje(data: string) {
  const db = getBanco()
  const rows = await db.getAllAsync(
    'SELECT r.*, h.nome FROM registros_diarios r ' +
    'JOIN habitos h ON h.id = r.habito_id ' +
    'WHERE r.data = ? AND h.ativo = 1',
    [data]
  ) as Array<{
    id: number
    habito_id: number
    data: string
    feito: number
    nome: string
  }>
  return rows
}

export async function marcarHabito(habitoId: number, data: string) {
  const db = getBanco()
  const existe = await db.getFirstAsync(
    'SELECT id FROM registros_diarios WHERE habito_id = ? AND data = ?',
    [habitoId, data]
  ) as { id: number } | null
  if (existe) {
    await db.runAsync(
      'UPDATE registros_diarios SET feito = 1 WHERE id = ?',
      [existe.id]
    )
  } else {
    await db.runAsync(
      'INSERT INTO registros_diarios (habito_id, data, feito) VALUES (?, ?, 1)',
      [habitoId, data]
    )
  }
}

export async function desmarcarHabito(habitoId: number, data: string) {
  const db = getBanco()
  await db.runAsync(
    'UPDATE registros_diarios SET feito = 0 WHERE habito_id = ? AND data = ?',
    [habitoId, data]
  )
}

export async function calcularStreak() {
  const db = getBanco()
  const totalHabitos = await db.getFirstAsync(
    'SELECT COUNT(*) as total FROM habitos WHERE ativo = 1'
  ) as { total: number } | null
  if (!totalHabitos || totalHabitos.total === 0) return 0

  let streak = 0
  let dia = new Date()

  while (true) {
    const dataStr = dia.toISOString().slice(0, 10)
    const feitos = await db.getFirstAsync(
      'SELECT COUNT(*) as total FROM registros_diarios WHERE data = ? AND feito = 1',
      [dataStr]
    ) as { total: number } | null
    if (feitos && feitos.total >= totalHabitos.total) {
      streak++
      dia.setDate(dia.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export async function buscarDiasAcademia(mes: number, ano: number) {
  const db = getBanco()
  const mesStr = String(mes).padStart(2, '0')
  const rows = await db.getAllAsync(
    'SELECT r.data FROM registros_diarios r ' +
    'JOIN habitos h ON h.id = r.habito_id ' +
    'WHERE h.nome = "academia" AND r.feito = 1 ' +
    'AND r.data LIKE ?',
    [`${ano}-${mesStr}-%`]
  ) as Array<{ data: string }>
  return rows
}
