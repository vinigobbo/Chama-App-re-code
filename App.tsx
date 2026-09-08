import { useState, useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useFonts } from 'expo-font'
import { Ionicons } from '@expo/vector-icons'

import { cores } from './src/theme/colors'
import { abrirBanco } from './src/db/database'

import HojeScreen from './src/screens/HojeScreen'
import MetasScreen from './src/screens/MetasScreen'
import AcademiaScreen from './src/screens/AcademiaScreen'
import ConfigScreen from './src/screens/ConfigScreen'

const Tab = createBottomTabNavigator()

export default function App() {
  const [bancoPronto, setBancoPronto] = useState(false)

  const [fontesCarregadas] = useFonts({
    'Inter': require('./assets/fonts/Inter_28pt-Regular.ttf'),
    'JetBrains Mono': require('./assets/fonts/JetBrainsMono-Regular.ttf'),
  })

  useEffect(() => {
    async function iniciar() {
      await abrirBanco()
      setBancoPronto(true)
    }
    iniciar()
  }, [])

  if (!fontesCarregadas || !bancoPronto) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={cores.acento} size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: cores.fundo,
            borderTopColor: cores.fundoInput,
            height: 60,
          },
          tabBarActiveTintColor: cores.acento,
          tabBarInactiveTintColor: cores.textoSuave,
          tabBarIcon: ({ color, size }) => {
            const icones: Record<string, any> = {
              Hoje: 'today-outline',
              Metas: 'flag-outline',
              Academia: 'barbell-outline',
              Config: 'settings-outline',
            }
            return <Ionicons name={icones[route.name]} size={size} color={color} />
          },
        })}
      >
        <Tab.Screen name="Hoje" component={HojeScreen} />
        <Tab.Screen name="Metas" component={MetasScreen} />
        <Tab.Screen name="Academia" component={AcademiaScreen} />
        <Tab.Screen name="Config" component={ConfigScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
