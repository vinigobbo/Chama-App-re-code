import { Modal, View, Text, TouchableOpacity, StyleSheet, SectionList } from 'react-native'
import { cores } from '../theme/colors'
import { fontes, tamanhos } from '../theme/fonts'
import { EXERCICIOS_DISPONIVEIS } from '../data/exercicios'
import { ORDEM_GRUPOS, nomeGrupo, EMOJI_GRUPO } from '../data/gruposMusculares'

type Props = {
  visivel: boolean
  jaAdicionados: string[]
  onFechar: () => void
  onEscolher: (nome: string, grupo: string) => void
}

function construirSecoes(jaAdicionados: string[]) {
  const grupos: Record<string, { nome: string; grupo: string }[]> = {}
  EXERCICIOS_DISPONIVEIS
    .filter(ex => !jaAdicionados.includes(ex.nome))
    .forEach(ex => {
      if (!grupos[ex.grupo]) grupos[ex.grupo] = []
      grupos[ex.grupo].push(ex)
    })
  return ORDEM_GRUPOS
    .filter(g => grupos[g]?.length)
    .map(g => ({ title: `${EMOJI_GRUPO[g] ?? ''}  ${nomeGrupo(g)}`, data: grupos[g] }))
}

export default function SugestaoExercicioModal({ visivel, jaAdicionados, onFechar, onEscolher }: Props) {
  const secoes = construirSecoes(jaAdicionados)
  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
      <View style={styles.fundo}>
        <View style={styles.card}>
          <Text style={styles.titulo}>adicionar exercício</Text>
          <Text style={styles.subtitulo}>escolha por grupo muscular</Text>

          {secoes.length === 0 ? (
            <Text style={styles.vazio}>todos os exercícios já foram adicionados</Text>
          ) : (
            <SectionList
              sections={secoes}
              keyExtractor={item => item.nome}
              renderSectionHeader={({ section }) => (
                <Text style={styles.secaoTitulo}>{section.title}</Text>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.linha} onPress={() => onEscolher(item.nome, item.grupo)}>
                  <Text style={styles.linhaNome}>{item.nome}</Text>
                </TouchableOpacity>
              )}
              style={styles.lista}
            />
          )}

          <TouchableOpacity style={styles.cancelar} onPress={onFechar}>
            <Text style={styles.cancelarTexto}>fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  card: { backgroundColor: cores.fundoCartao, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '85%' },
  titulo: { color: cores.texto, fontFamily: fontes.corpo, fontSize: tamanhos.titulo, fontWeight: '600' },
  subtitulo: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub, marginTop: 4, marginBottom: 12 },
  lista: { maxHeight: 460 },
  vazio: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub, textAlign: 'center', marginVertical: 24 },
  secaoTitulo: {
    color: cores.acento, fontFamily: fontes.corpo, fontSize: 11,
    fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase',
    marginTop: 14, marginBottom: 6,
  },
  linha: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: cores.fundoInput },
  linhaNome: { color: cores.texto, fontFamily: fontes.corpo, fontSize: tamanhos.corpo },
  cancelar: { alignItems: 'center', marginTop: 16 },
  cancelarTexto: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub },
})