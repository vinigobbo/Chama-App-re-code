import { View, Text, StyleSheet } from 'react-native'
import { cores } from '../theme/colors'
import { fontes, tamanhos } from '../theme/fonts'

export default function HojeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Hoje</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    color: cores.texto,
    fontFamily: fontes.corpo,
    fontSize: tamanhos.titulo,
  },
})