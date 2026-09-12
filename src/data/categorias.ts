export const CATEGORIAS: Record<string, string> = {
  saude: 'Saúde',
  estudo: 'Estudo',
  financeiro: 'Dinheiro',
  trabalho: 'Trabalho',
  geral: 'Outras',
}

export const ORDEM_CATEGORIAS = ['saude', 'estudo', 'financeiro', 'trabalho', 'geral']

export function nomeCategoria(tipo: string) {
  return CATEGORIAS[tipo] ?? 'Outras'
}