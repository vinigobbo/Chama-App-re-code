import * as SQLite from 'expo-sqlite'
import { CRIAR_TABELAS } from './schema'

let db: SQLite.SQLiteDatabase | null = null

export async function abrirBanco() {
  if (db) return db
  db = await SQLite.openDatabaseAsync('chama.db')
  for (const sql of CRIAR_TABELAS) {
    await db.execAsync(sql)
  }
  await migrar(db)
  return db
}

async function migrar(banco: SQLite.SQLiteDatabase) {
  const colunas = [
    'ALTER TABLE metas_semestrais ADD COLUMN emoji TEXT',
    'ALTER TABLE habitos ADD COLUMN emoji TEXT',
    "ALTER TABLE habitos ADD COLUMN frequencia_tipo TEXT NOT NULL DEFAULT 'diario'",
    'ALTER TABLE habitos ADD COLUMN frequencia_dias TEXT',
    'ALTER TABLE habitos ADD COLUMN data_referencia TEXT',
  ]
  for (const sql of colunas) {
    try {
      await banco.execAsync(sql)
    } catch (e) {
      // coluna já existe, ignora
    }
  }
}

export function getBanco() {
  if (!db) throw new Error('Banco não foi aberto ainda')
  return db
}