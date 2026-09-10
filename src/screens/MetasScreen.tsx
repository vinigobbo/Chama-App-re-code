import { useState, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { cores } from '../theme/colors'
import { fontes, tamanhos } from '../theme/fonts'
import { buscarMetas, criarMeta, buscarUltimoProgresso, registrarProgresso, excluirMeta } from '../db/metas'

function diasRestantes(dataFim: string) {
  const hoje = new Date()
  const fim = new Date(dataFim + 'T00:00:00')
  const diff = Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function MetasScreen() {
  const [metas, setMetas] = useState<any[]>([])
  const [metaAberta, setMetaAberta] = useState<number | null>(null)
  const [novoValor, setNovoValor] = useState('')
  const [criando, setCriando] = useState(false)
  const [formNome, setFormNome] = useState('')
  const [formTipo, setFormTipo] = useState('')
  const [formAlvo, setFormAlvo] = useState('')
  const [formUnidade, setFormUnidade] = useState('')
  const [formFim, setFormFim] = useState('')

  async function carregarDados() {
    const lista = await buscarMetas()
    const comProgresso = await Promise.all(
      lista.map(async (m) => {
        const ultimo = await buscarUltimoProgresso(m.id)
        return {
          ...m,
          valorAtual: ultimo ? ultimo.valor : 0,
          dias: diasRestantes(m.data_fim),
        }
      })
    )
    setMetas(comProgresso)
  }

  useFocusEffect(
    useCallback(() => {
      carregarDados()
    }, [])
  )

  async function salvarProgresso(metaId: number) {
    const valor = parseFloat(novoValor)
    if (isNaN(valor)) return
    const hoje = new Date().toISOString().slice(0, 10)
    await registrarProgresso(metaId, hoje, valor)
    setNovoValor('')
    setMetaAberta(null)
    await carregarDados()
  }

  async function adicionarMeta() {
    const alvo = parseFloat(formAlvo)
    if (!formNome.trim() || isNaN(alvo) || !formFim.trim()) return
    const hoje = new Date().toISOString().slice(0, 10)
    await criarMeta(
      formNome.trim(),
      formTipo.trim() || 'geral',
      alvo,
      formUnidade.trim() || null,
      hoje,
      formFim.trim()
    )
    setFormNome('')
    setFormTipo('')
    setFormAlvo('')
    setFormUnidade('')
    setFormFim('')
    setCriando(false)
    await carregarDados()
  }

  async function removerMeta(id: number) {
    await excluirMeta(id)
    await carregarDados()
  }

  function progresso(atual: number, alvo: number) {
    if (alvo === 0) return 0
    return Math.min((atual / alvo) * 100, 100)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>metas semestrais</Text>
        <TouchableOpacity onPress={() => setCriando(!criando)}>
          <Text style={styles.addBtn}>{criando ? '×' : '+'}</Text>
        </TouchableOpacity>
      </View>

      {criando && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="nome da meta"
            placeholderTextColor={cores.textoSuave}
            value={formNome}
            onChangeText={setFormNome}
          />
          <View style={styles.formRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="valor alvo"
              placeholderTextColor={cores.textoSuave}
              value={formAlvo}
              onChangeText={setFormAlvo}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="unidade (kg, R$...)"
              placeholderTextColor={cores.textoSuave}
              value={formUnidade}
              onChangeText={setFormUnidade}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="data fim (2026-12-31)"
            placeholderTextColor={cores.textoSuave}
            value={formFim}
            onChangeText={setFormFim}
          />
          <TouchableOpacity style={styles.salvarBtn} onPress={adicionarMeta}>
            <Text style={styles.salvarTxt}>criar meta</Text>
          </TouchableOpacity>
        </View>
      )}

      {metas.length === 0 ? (
        <Text style={styles.vazio}>nenhuma meta cadastrada ainda</Text>
      ) : (
        <FlatList
          data={metas}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setMetaAberta(metaAberta === item.id ? null : item.id)}
              onLongPress={() => removerMeta(item.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardNome}>{item.nome}</Text>
                <Text style={[styles.cardDias, item.dias < 0 && { color: cores.erro }]}>
                  {item.dias >= 0 ? `faltam ${item.dias} dias` : 'encerrada'}
                </Text>
              </View>

              <View style={styles.barraFundo}>
                <View style={[styles.barraProgresso, { width: `${progresso(item.valorAtual, item.valor_alvo)}%` }]} />
              </View>

              <Text style={styles.cardValor}>
                {item.valorAtual} / {item.valor_alvo} {item.unidade || ''}
              </Text>

              {metaAberta === item.id && (
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="valor atual"
                    placeholderTextColor={cores.textoSuave}
                    value={novoValor}
                    onChangeText={setNovoValor}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity style={styles.salvarBtn} onPress={() => salvarProgresso(item.id)}>
                    <Text style={styles.salvarTxt}>salvar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, paddingTop: 60, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  titulo: { color: cores.texto, fontFamily: fontes.corpo, fontSize: tamanhos.titulo },
  addBtn: { color: cores.acento, fontSize: 28, lineHeight: 28 },
  form: { gap: 10, marginBottom: 24 },
  formRow: { flexDirection: 'row', gap: 10 },
  input: {
    backgroundColor: cores.fundoInput, color: cores.texto, fontFamily: fontes.corpo,
    fontSize: tamanhos.corpo, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8,
  },
  salvarBtn: { backgroundColor: cores.acento, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  salvarTxt: { color: cores.fundo, fontFamily: fontes.corpo, fontSize: tamanhos.sub, fontWeight: '600' },
  vazio: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub, textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: cores.fundoCartao, borderRadius: 10, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardNome: { color: cores.texto, fontFamily: fontes.corpo, fontSize: tamanhos.corpo },
  cardDias: { color: cores.textoSuave, fontFamily: fontes.numero, fontSize: tamanhos.sub },
  barraFundo: { height: 6, backgroundColor: cores.apagado, borderRadius: 3, marginBottom: 8 },
  barraProgresso: { height: 6, backgroundColor: cores.acento, borderRadius: 3 },
  cardValor: { color: cores.textoSuave, fontFamily: fontes.numero, fontSize: tamanhos.sub },
  inputRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
})