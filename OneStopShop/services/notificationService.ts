// OneStopShop/services/notificationService.ts
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

// Request permission for notifications
export const requestUserPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.manifest?.extra?.eas?.projectId,
  })).data;
  console.log(token);
  return token;
};

// Set up notification channel for Android
export const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Send a push notification with the given message
export const sendPushNotification = async (message: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Calendar Notification",
      body: message,
      sound: true,
    },
    trigger: { seconds: 0 },
  });
};