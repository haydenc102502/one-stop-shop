// OneStopShop/services/notificationService.ts
import { Alert } from 'react-native';

export const showLocalNotification = async (title: string, body: string) => {
  Alert.alert(title, body);
}