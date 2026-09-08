import { getBanco } from './database'

export async function buscarConfig(chave: string) {
  const db = getBanco()
  const row = await db.getFirstAsync<{ valor: string }>(
    'SELECT valor FROM config WHERE chave = ?',
    [chave]
  )
  return row ? row.valor : null
}

export async function salvarConfig(chave: string, valor: string) {
  const db = getBanco()
  const existe = await db.getFirstAsync<{ chave: string }>(
    'SELECT chave FROM config WHERE chave = ?',
    [chave]
  )
  if (existe) {
    await db.runAsync(
      'UPDATE config SET valor = ? WHERE chave = ?',
      [valor, chave]
    )
  } else {
    await db.runAsync(
      'INSERT INTO config (chave, valor) VALUES (?, ?)',
      [chave, valor]
    )
  }
}