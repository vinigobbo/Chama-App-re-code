import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { cores } from '../theme/colors'
import { fontes, tamanhos } from '../theme/fonts'

type Props = {
  visivel: boolean
  titulo: string
  mensagem: string
  textoConfirmar?: string
  onCancelar: () => void
  onConfirmar: () => void
}

export default function ConfirmModal({
  visivel, titulo, mensagem, textoConfirmar = 'excluir', onCancelar, onConfirmar,
}: Props) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={styles.fundo}>
        <View style={styles.card}>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.mensagem}>{mensagem}</Text>
          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botaoCancelar} onPress={onCancelar}>
              <Text style={styles.textoCancelar}>cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoConfirmar} onPress={onConfirmar}>
              <Text style={styles.textoConfirmarTxt}>{textoConfirmar}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  card: { width: '100%', backgroundColor: cores.fundoCartao, borderRadius: 16, padding: 24 },
  titulo: { color: cores.texto, fontFamily: fontes.corpo, fontSize: tamanhos.corpo, fontWeight: '600', marginBottom: 8 },
  mensagem: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub, lineHeight: 18, marginBottom: 24 },
  botoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20 },
  botaoCancelar: { paddingVertical: 8, paddingHorizontal: 4 },
  textoCancelar: { color: cores.textoSuave, fontFamily: fontes.corpo, fontSize: tamanhos.sub },
  botaoConfirmar: { backgroundColor: cores.acento, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  textoConfirmarTxt: { color: cores.fundo, fontFamily: fontes.corpo, fontSize: tamanhos.sub, fontWeight: '600' },
})