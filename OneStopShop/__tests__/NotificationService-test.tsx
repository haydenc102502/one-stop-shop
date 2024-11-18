/**
 * This test file is for testing the notificationService.ts file.
 */

import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
    requestUserPermission,
    setupNotificationChannel,
    sendPushNotification,
} from '@/services/notificationService';

// Mock expo-notifications module
jest.mock('expo-notifications', () => ({
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
    setNotificationChannelAsync: jest.fn(),
    scheduleNotificationAsync: jest.fn(),
    setNotificationHandler: jest.fn(),
    AndroidImportance: {
        MAX: 'max',
    },
}));

// Mock global alert function
beforeAll(() => {
    global.alert = jest.fn();
});

// Restore global alert function
afterAll(() => {
    global.alert.mockRestore();
});

/**
 * Test suite for notificationService functions.
 * Contains test cases for requestUserPermission, setupNotificationChannel, and sendPushNotification.
 */
describe('notificationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test cases for requestUserPermission
    describe('requestUserPermission', () => {
        it('should request user permission and return granted status', async () => {
            (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'undetermined' });
            (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'granted' });
            (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValueOnce({ data: 'mock-token' });

            const result = await requestUserPermission();

            expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
            expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
            expect(result).toBe('mock-token');
        });

        it('should return existing granted status without requesting permission again', async () => {
            (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'granted' });
            (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValueOnce({ data: 'mock-token' });

            const result = await requestUserPermission();

            expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
            expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
            expect(result).toBe('mock-token');
        });

        it('should alert if permission is not granted', async () => {
            const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
            (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'undetermined' });
            (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'denied' });

            const token = await requestUserPermission();

            expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
            expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
            expect(alertSpy).toHaveBeenCalledWith('Failed to get push token for push notification!');
            expect(token).toBeUndefined();

            alertSpy.mockRestore();
        });
    });

    // Test cases for setupNotificationChannel
    describe('setupNotificationChannel', () => {
        it('should set notification channel for Android', async () => {
            Platform.OS = 'android';
            await setupNotificationChannel();
            expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith('default', expect.any(Object));
        });
    });

    // Test cases for sendPushNotification
    describe('sendPushNotification', () => {
        it('should schedule a notification', async () => {
            await sendPushNotification('Test Title', 'Test Body');
            expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
                content: {
                    title: 'Test Title',
                    body: 'Test Body',
                    sound: true,
                },
                trigger: { seconds: 1 },
            });
        });
    });
});