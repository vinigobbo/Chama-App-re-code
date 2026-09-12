export function habitoAplicavelNaData(habito: any, dataISO: string) {
  if (habito.frequencia_tipo === 'semana') {
    const dias: number[] = habito.frequencia_dias ? JSON.parse(habito.frequencia_dias) : []
    const data = new Date(dataISO + 'T00:00:00')
    return dias.includes(data.getDay())
  }

  if (habito.frequencia_tipo === 'intervalo') {
    const referencia = new Date((habito.data_referencia ?? dataISO) + 'T00:00:00')
    const data = new Date(dataISO + 'T00:00:00')
    const diffDias = Math.round((data.getTime() - referencia.getTime()) / (1000 * 60 * 60 * 24))
    return diffDias % 2 === 0
  }

  return true // 'diario' ou sem frequência definida
}