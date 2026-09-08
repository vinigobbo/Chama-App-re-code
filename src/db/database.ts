import * as SQLite from 'expo-sqlite'
import { CRIAR_TABELAS } from './schema'

let db: SQLite.SQLiteDatabase | null = null

export async function abrirBanco() {
  if (db) return db
  db = await SQLite.openDatabaseAsync('chama.db')
  for (const sql of CRIAR_TABELAS) {
    await db.execAsync(sql)
  }
  return db
}

export function getBanco() {
  if (!db) throw new Error('Banco não foi aberto ainda')
  return db
}