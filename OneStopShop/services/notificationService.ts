// OneStopShop/services/notificationService.ts
// NOTE: May need to run `expo install expo-notifications` if an error is thrown when importing Notifications
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

// Suppress the warning about not specifying a projectId
const originalWarn = console.warn;
console.warn = (message, ...args) => {
  if (typeof message === 'string' && message.includes('Calling getExpoPushTokenAsync without specifying a projectId is deprecated')) {
    return;
  }
  originalWarn(message, ...args);
};

// Request permission for notifications
export const requestUserPermission = async () => {
  const { status: existingStatus } = (await Notifications.getPermissionsAsync()) || {};
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = (await Notifications.requestPermissionsAsync()) || {};
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Failed to get push token for push notification!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync({
    // projectId: Constants.expoConfig?.extra?.eas?.projectId,
  })).data;
  // console.log(token);
  return token;
};

// Set up notification channel for Android
export const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
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
export const sendPushNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: { seconds: 1 },
  });
};