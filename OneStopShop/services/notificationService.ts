// OneStopShop/services/notificationService.ts
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Register for push notifications and return the token
export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);
  return token;
};

// Send a push notification with the given message
export const sendPushNotification = async (message: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Calendar Notification",
      body: message,
    },
    trigger: { seconds: 1 },
  });
};