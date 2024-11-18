// OneStopShop/services/notificationService.ts
// NOTE: May need to run `expo install expo-notifications` if an error is thrown when importing Notifications
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

// Request permission for notifications
export const requestUserPermission = async () => {
  const { status: existingStatus } = (await Notifications.getPermissionsAsync()) || {};
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = (await Notifications.requestPermissionsAsync()) || {};
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  /** The warning  "WARN  Calling getExpoPushTokenAsync without specifying a projectId is deprecated and will no longer be supported in SDK 49+ "
  * below is expected and stems from the following lines in this const.  They can be ignored because it stems from the fact that the `projectId` 
  * is not defined in the `app.json` file.
  * To resolve this warning, add the following to your `app.json` file however adding this is not necessary for the push notification to work and 
  * adding this will create the need for an EAS account and Im not too sure if thats free or not.:
    "extra": {
      "eas": {
        "projectId": "your-project-id"
    } },
  */
  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
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