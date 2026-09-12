import { getBanco } from './database'
import { habitoAplicavelNaData } from '../utils/frequencia'

export async function buscarRegistrosDeHoje(data: string) {
  const db = getBanco()
  const habitos = await db.getAllAsync(
    'SELECT * FROM habitos WHERE ativo = 1'
  ) as any[]

  const habitosDeHoje = habitos.filter(h => habitoAplicavelNaData(h, data))

  const registros = await db.getAllAsync(
    'SELECT * FROM registros_diarios WHERE data = ?',
    [data]
  ) as Array<{ id: number; habito_id: number; data: string; feito: number }>

  return habitosDeHoje.map(h => ({
    ...h,
    feito: registros.some(r => r.habito_id === h.id && r.feito === 1) ? 1 : 0,
  }))
}

export async function marcarHabito(habitoId: number, data: string) {
  const db = getBanco()
  const existe = await db.getFirstAsync(
    'SELECT id FROM registros_diarios WHERE habito_id = ? AND data = ?',
    [habitoId, data]
  ) as { id: number } | null
  if (existe) {
    await db.runAsync('UPDATE registros_diarios SET feito = 1 WHERE id = ?', [existe.id])
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
  const habitos = await db.getAllAsync('SELECT * FROM habitos WHERE ativo = 1') as any[]
  if (habitos.length === 0) return 0

  let streak = 0
  let dia = new Date()

  while (true) {
    const dataStr = dia.toISOString().slice(0, 10)
    const habitosDoDia = habitos.filter(h => habitoAplicavelNaData(h, dataStr))

    if (habitosDoDia.length === 0) {
      dia.setDate(dia.getDate() - 1)
      continue
    }

    const registros = await db.getAllAsync(
      'SELECT habito_id FROM registros_diarios WHERE data = ? AND feito = 1',
      [dataStr]
    ) as Array<{ habito_id: number }>

    const todosFeitos = habitosDoDia.every(h => registros.some(r => r.habito_id === h.id))

    if (todosFeitos) {
      streak++
      dia.setDate(dia.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export async function buscarDiasAcademiaRange(dataInicio: string, dataFim: string) {
  const db = getBanco()
  return await db.getAllAsync(
    'SELECT r.data FROM registros_diarios r ' +
    'JOIN habitos h ON h.id = r.habito_id ' +
    'WHERE h.nome = "academia" AND r.feito = 1 ' +
    'AND r.data BETWEEN ? AND ?',
    [dataInicio, dataFim]
  ) as Array<{ data: string }>
}