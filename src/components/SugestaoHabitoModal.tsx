import { Modal, View, Text, TouchableOpacity, StyleSheet, SectionList } from 'react-native'
import { cores } from '../theme/colors'
import { fontes, tamanhos } from '../theme/fonts'
import { HABITOS_SUGERIDOS, HabitoSugerido } from '../data/habitosSugeridos'
import { ORDEM_CATEGORIAS, nomeCategoria } from '../data/categorias'

type Props = {
  visivel: boolean
  onFechar: () => void
  onEscolher: (sugestao: HabitoSugerido | null) => void
}

function construirSecoes() {
  const grupos: Record<string, HabitoSugerido[]> = {}
  HABITOS_SUGERIDOS.forEach(item => {
    if (!grupos[item.tipo]) grupos[item.tipo] = []
    grupos[item.tipo].push(item)
  })
  return ORDEM_CATEGORIAS
    .filter(tipo => grupos[tipo]?.length)
    .map(tipo => ({ title: nomeCategoria(tipo), data: grupos[tipo] }))
}

export default function SugestaoHabitoModal({ visivel, onFechar, onEscolher }: Props) {
  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
      <View style={styles.fundo}>
        <View style={styles.card}>
          <Text style={styles.titulo}>novo hábito</Text>
          <Text style={styles.subtitulo}>escolha uma sugestão ou crie o seu</Text>

          <SectionList
            sections={construirSecoes()}
            keyExtractor={item => item.nome}
            renderSectionHeader={({ section }) => (
              <Text style={styles.secaoTitulo}>{section.title}</Text>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.linha} onPress={() => onEscolher(item)}>
                <Text style={styles.linhaEmoji}>{item.emoji}</Text>
                <Text style={styles.linhaNome}>{item.nome}</Text>
              </TouchableOpacity>
            )}
            style={styles.lista}
          />

          <TouchableOpacity style={styles.personalizada} onPress={() => onEscolher(null)}>
            <Text style={styles.personalizadaTexto}>+ criar personalizado</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelar} onPress={onFechar}>
            <Text style={styles.cancelarTexto}>cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  card: { backgroundColor: cores.fundoCartao, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '80%' },
  titulo: { color: cores.texto, fontFamily: fontes.corpo, fontSize: tamanhos.titulo, fontWeight: '600' },
  subtitulo: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub, marginTop: 4, marginBottom: 12 },
  lista: { maxHeight: 380 },
  secaoTitulo: {
    color: cores.acento, fontFamily: fontes.corpo, fontSize: 11,
    fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase',
    marginTop: 14, marginBottom: 6,
  },
  linha: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: cores.fundoInput,
  },
  linhaEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  linhaNome: { color: cores.texto, fontFamily: fontes.corpo, fontSize: tamanhos.corpo },
  personalizada: {
    borderWidth: 1, borderColor: cores.acento, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center', marginTop: 16,
  },
  personalizadaTexto: { color: cores.acento, fontFamily: fontes.corpo, fontSize: tamanhos.corpo, fontWeight: '600' },
  cancelar: { alignItems: 'center', marginTop: 16 },
  cancelarTexto: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub },
})