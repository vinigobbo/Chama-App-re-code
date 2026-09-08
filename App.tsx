import { View, Text, StyleSheet } from 'react-native'
import { useFonts } from 'expo-font'
import { cores } from './src/theme/colors'
import { fontes, tamanhos } from './src/theme/fonts'

export default function App() {
  const [fontesCarregadas] = useFonts({
    'Inter': require('./assets/fonts/Inter_28pt-Regular.ttf'),
    'JetBrains Mono': require('./assets/fonts/JetBrainsMono-Regular.ttf'),
  })

  if (!fontesCarregadas) return null

  return (
    <View style={styles.container}>
      <Text style={styles.numero}>12</Text>
      <Text style={styles.texto}>dias seguidos</Text>
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
  numero: {
    color: cores.acento,
    fontFamily: fontes.numero,
    fontSize: tamanhos.streak,
  },
  texto: {
    color: cores.textoSuave,
    fontFamily: fontes.corpo,
    fontSize: tamanhos.corpo,
    marginTop: 8,
  },
})