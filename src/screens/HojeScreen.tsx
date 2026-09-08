import { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { cores } from '../theme/colors'
import { fontes, tamanhos } from '../theme/fonts'
import { buscarHabitosAtivos, criarHabito } from '../db/habitos'
import { buscarRegistrosDeHoje, marcarHabito, desmarcarHabito, calcularStreak } from '../db/registros'

function hojeISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function HojeScreen() {
  const [habitos, setHabitos] = useState<any[]>([])
  const [streak, setStreak] = useState(0)
  const [novoNome, setNovoNome] = useState('')
  const [mostrarInput, setMostrarInput] = useState(false)

  async function carregarDados() {
    const hoje = hojeISO()
    const lista = await buscarHabitosAtivos()
    const registros = await buscarRegistrosDeHoje(hoje)

    const habitosComStatus = lista.map(h => ({
      ...h,
      feito: registros.some(r => r.habito_id === h.id && r.feito === 1)
    }))

    setHabitos(habitosComStatus)
    setStreak(await calcularStreak())
  }

  useFocusEffect(
    useCallback(() => {
      carregarDados()
    }, [])
  )

  async function toggleHabito(id: number, feitoAtual: boolean) {
    const hoje = hojeISO()
    if (feitoAtual) {
      await desmarcarHabito(id, hoje)
    } else {
      await marcarHabito(id, hoje)
    }
    await carregarDados()
  }

  async function adicionarHabito() {
    const nome = novoNome.trim()
    if (!nome) return
    await criarHabito(nome)
    setNovoNome('')
    setMostrarInput(false)
    await carregarDados()
  }

  return (
    <View style={styles.container}>
      <View style={styles.streakBox}>
        <Text style={styles.streakNumero}>{streak}</Text>
        <Text style={styles.streakLabel}>dias seguidos</Text>
      </View>

      <View style={styles.secao}>
        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>hábitos de hoje</Text>
          <TouchableOpacity onPress={() => setMostrarInput(!mostrarInput)}>
            <Text style={styles.addBtn}>{mostrarInput ? '×' : '+'}</Text>
          </TouchableOpacity>
        </View>

        {mostrarInput && (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="nome do hábito"
              placeholderTextColor={cores.textoSuave}
              value={novoNome}
              onChangeText={setNovoNome}
              onSubmitEditing={adicionarHabito}
            />
            <TouchableOpacity style={styles.salvarBtn} onPress={adicionarHabito}>
              <Text style={styles.salvarTxt}>salvar</Text>
            </TouchableOpacity>
          </View>
        )}

        {habitos.length === 0 ? (
          <Text style={styles.vazio}>nenhum hábito cadastrado ainda</Text>
        ) : (
          <FlatList
            data={habitos}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.habitoRow}
                onPress={() => toggleHabito(item.id, item.feito)}
              >
                <View style={[
                  styles.marcador,
                  item.feito && styles.marcadorAceso
                ]} />
                <Text style={[
                  styles.habitoNome,
                  item.feito && styles.habitoFeito
                ]}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  streakBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  streakNumero: {
    color: cores.acento,
    fontFamily: fontes.numero,
    fontSize: tamanhos.streak,
  },
  streakLabel: {
    color: cores.textoSuave,
    fontFamily: fontes.corpo,
    fontSize: tamanhos.sub,
    marginTop: 4,
  },
  secao: {
    flex: 1,
  },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  secaoTitulo: {
    color: cores.texto,
    fontFamily: fontes.corpo,
    fontSize: tamanhos.corpo,
  },
  addBtn: {
    color: cores.acento,
    fontSize: 28,
    lineHeight: 28,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: cores.fundoInput,
    color: cores.texto,
    fontFamily: fontes.corpo,
    fontSize: tamanhos.corpo,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  salvarBtn: {
    backgroundColor: cores.acento,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  salvarTxt: {
    color: cores.fundo,
    fontFamily: fontes.corpo,
    fontSize: tamanhos.sub,
    fontWeight: '600',
  },
  vazio: {
    color: cores.textoSuave,
    fontFamily: fontes.corpo,
    fontSize: tamanhos.sub,
    textAlign: 'center',
    marginTop: 40,
  },
  habitoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.fundoInput,
  },
  marcador: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: cores.textoSuave,
  },
  marcadorAceso: {
    backgroundColor: cores.acento,
    borderColor: cores.acento,
  },
  habitoNome: {
    color: cores.texto,
    fontFamily: fontes.corpo,
    fontSize: tamanhos.corpo,
  },
  habitoFeito: {
    color: cores.textoSuave,
  },
})