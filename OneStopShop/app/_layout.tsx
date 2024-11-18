// _layout.tsx (root)

/**
 * This file defines the RootLayout component, which sets up the overall structure of the app,
 * including theme settings, font loading, splash screen handling, and navigation stack.
 * It also wraps the application with the DataProvider to provide global state management.
 */

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { DataProvider } from '@/data-store/dataContext'; // Import DataProvider for global state
import { ErrorBoundary } from 'expo-router'; // Catch any errors thrown by the Layout component

/**
 * Unstable settings for Expo Router.
 * Sets the initial route name for the navigation stack.
 */
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

/**
 * RootLayout Component
 * Sets up font loading, splash screen handling, and wraps the navigation stack with DataProvider.
 *
 * @returns The root layout of the application.
 */
export default function RootLayout() {
  // Load custom fonts using Expo's useFonts hook
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Handle font loading errors
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide the splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // If fonts are not loaded yet, render nothing
  if (!loaded) {
    return null;
  }

  // Wrap the navigation stack with DataProvider for global state management
  return (
    <DataProvider>
      <RootLayoutNav />
    </DataProvider>
  );
}

/**
 * RootLayoutNav Component
 * Defines the navigation structure of the app, including theme settings and navigation stack.
 *
 * @returns The navigation stack wrapped with the appropriate theme provider.
 */
function RootLayoutNav() {
  // Determine the current color scheme (light or dark)
  const colorScheme = useColorScheme();

  return (
    // Provide the theme to navigation components
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Define the navigation stack */}
      <Stack>
        {/* Login screen */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        {/* Registration screen */}
        <Stack.Screen name="register" options={{ headerShown: false }} />
        {/* Main tab navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* User Profile screen */}
        <Stack.Screen
          name="userProfile"
          options={{
            title: 'User Profile', // Displayed as the screen title
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
