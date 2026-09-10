import { useState, useCallback, useRef } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { cores } from '../theme/colors'
import { fontes, tamanhos } from '../theme/fonts'
import { buscarDiasAcademiaRange } from '../db/registros'

const SEMANAS_VISIVEIS = 26
const CELULA = 15
const GAP = 4
const MESES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']

function gerarSemanas(numSemanas: number) {
  const hoje = new Date()
  const domingoAtual = new Date(hoje)
  domingoAtual.setDate(hoje.getDate() - hoje.getDay())

  const inicio = new Date(domingoAtual)
  inicio.setDate(domingoAtual.getDate() - (numSemanas - 1) * 7)

  const semanas: Date[][] = []
  for (let s = 0; s < numSemanas; s++) {
    const semana: Date[] = []
    for (let d = 0; d < 7; d++) {
      const data = new Date(inicio)
      data.setDate(inicio.getDate() + s * 7 + d)
      semana.push(data)
    }
    semanas.push(semana)
  }
  return { semanas, inicio, hoje }
}

function paraISO(data: Date) {
  return data.toISOString().slice(0, 10)
}

export default function AcademiaScreen() {
  const [diasMarcados, setDiasMarcados] = useState<string[]>([])
  const scrollRef = useRef<ScrollView>(null)

  const { semanas, inicio, hoje } = gerarSemanas(SEMANAS_VISIVEIS)

  async function carregarDados() {
    const dados = await buscarDiasAcademiaRange(paraISO(inicio), paraISO(hoje))
    setDiasMarcados(dados.map(d => d.data))
  }

  useFocusEffect(
    useCallback(() => {
      carregarDados()
    }, [])
  )

  function mesLabelDaColuna(semana: Date[]) {
    const diaUm = semana.find(d => d.getDate() === 1)
    return diaUm ? MESES[diaUm.getMonth()] : null
  }

  const totalMarcados = diasMarcados.length

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>academia</Text>

      <View style={styles.gridRow}>
  <View style={styles.diasSemana}>
    <Text style={styles.mesLabel}> </Text>
    {['D','S','T','Q','Q','S','S'].map((letra, i) => (
      <Text key={i} style={styles.diaLabel}>{letra}</Text>
    ))}
  </View>

  <ScrollView
    ref={scrollRef}
    horizontal
    showsHorizontalScrollIndicator={false}
    onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
  >
    <View>
      <View style={styles.mesesRow}>
        {semanas.map((semana, i) => (
          <View key={i} style={{ width: CELULA + GAP }}>
            <Text style={styles.mesLabel}>{mesLabelDaColuna(semana) ?? ''}</Text>
          </View>
        ))}
      </View>

      <View style={styles.semanasRow}>
        {semanas.map((semana, i) => (
          <View key={i} style={{ marginRight: GAP }}>
            {semana.map((data, j) => {
              const futura = data > hoje
              const iso = paraISO(data)
              const marcado = diasMarcados.includes(iso)
              return (
                <View
                  key={j}
                  style={[
                    styles.celula,
                    marcado && styles.celulaAcesa,
                    futura && styles.celulaFutura,
                  ]}
                />
              )
            })}
          </View>
        ))}
      </View>
    </View>
  </ScrollView>
</View>

      <View style={styles.resumo}>
        <Text style={styles.resumoNumero}>{totalMarcados}</Text>
        <Text style={styles.resumoLabel}>dias nas últimas {SEMANAS_VISIVEIS} semanas</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, paddingTop: 60, paddingHorizontal: 24 },
  titulo: { color: cores.texto, fontFamily: fontes.corpo, fontSize: tamanhos.titulo, marginBottom: 24 },
  gridRow: { flexDirection: 'row' },
  mesesRow: { flexDirection: 'row' },
  mesLabel: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: 10, height: 16 },
  semanasRow: { flexDirection: 'row' },
  celula: {
    width: CELULA,
    height: CELULA,
    marginBottom: GAP,
    borderRadius: 3,
    backgroundColor: cores.apagado,
  },
  celulaAcesa: { backgroundColor: cores.acento },
  celulaFutura: { opacity: 0 },
  diasSemana: { marginRight: 8, justifyContent: 'flex-start' },
diaLabel: {
  color: cores.textoSuave,
  fontFamily: fontes.corpo,
  fontSize: 10,
  height: CELULA + GAP,
  textAlignVertical: 'center',
},
  resumo: { alignItems: 'center', marginTop: 32 },
  resumoNumero: { color: cores.acento, fontFamily: fontes.numero, fontSize: 36 },
  resumoLabel: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub, marginTop: 4 },
})