import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { cores } from '../theme/colors'
import { fontes, tamanhos } from '../theme/fonts'
import { METAS_SUGERIDAS, MetaSugerida } from '../data/metasSugeridas'

type Props = {
  visivel: boolean
  onFechar: () => void
  onEscolher: (sugestao: MetaSugerida | null) => void
}

export default function SugestaoMetaModal({ visivel, onFechar, onEscolher }: Props) {
  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
      <View style={styles.fundo}>
        <View style={styles.card}>
          <Text style={styles.titulo}>nova meta</Text>
          <Text style={styles.subtitulo}>escolha uma sugestão ou crie a sua</Text>

          <FlatList
            data={METAS_SUGERIDAS}
            keyExtractor={item => item.nome}
            numColumns={3}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => onEscolher(item)}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <Text style={styles.itemNome}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.personalizada} onPress={() => onEscolher(null)}>
            <Text style={styles.personalizadaTexto}>+ criar personalizada</Text>
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
  card: { backgroundColor: cores.fundoCartao, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '75%' },
  titulo: { color: cores.texto, fontFamily: fontes.corpo, fontSize: tamanhos.titulo, fontWeight: '600' },
  subtitulo: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub, marginTop: 4, marginBottom: 16 },
  grid: { gap: 10 },
  item: {
    flex: 1, alignItems: 'center', backgroundColor: cores.fundoInput,
    borderRadius: 12, paddingVertical: 16, marginHorizontal: 5, marginBottom: 10,
  },
  itemEmoji: { fontSize: 28, marginBottom: 6 },
  itemNome: { color: cores.texto, fontFamily: fontes.corpo, fontSize: 11, textAlign: 'center' },
  personalizada: {
    borderWidth: 1, borderColor: cores.acento, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center', marginTop: 8,
  },
  personalizadaTexto: { color: cores.acento, fontFamily: fontes.corpo, fontSize: tamanhos.corpo, fontWeight: '600' },
  cancelar: { alignItems: 'center', marginTop: 16 },
  cancelarTexto: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub },
})