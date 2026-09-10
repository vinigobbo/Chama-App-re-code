import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export async function pedirPermissao() {
  const { status } = await Notifications.getPermissionsAsync()
  if (status === 'granted') return true
  const { status: novoStatus } = await Notifications.requestPermissionsAsync()
  return novoStatus === 'granted'
}

export async function agendarLembrete(horario: string) {
  await cancelarLembrete()
  const [horas, minutos] = horario.split(':').map(Number)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'chama',
      body: 'você ainda tem hábitos pendentes hoje',
    },
    trigger: {
      type: 'daily' as any,
      hour: horas,
      minute: minutos,
    },
  })
}

export async function cancelarLembrete() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}