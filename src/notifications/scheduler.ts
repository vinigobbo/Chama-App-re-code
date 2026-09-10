// Notificações reais ficam pendentes até termos um development build
// (Expo Go não suporta expo-notifications a partir do SDK 53+).
// As funções abaixo são placeholders seguros — não quebram o app.

export async function pedirPermissao() {
  console.log('notificações: pendente (precisa de development build)')
  return false
}

export async function agendarLembrete(horario: string) {
  console.log('notificações: pendente (precisa de development build)')
}

export async function cancelarLembrete() {
  console.log('notificações: pendente (precisa de development build)')
}