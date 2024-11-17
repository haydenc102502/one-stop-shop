// userProfile.tsx

/**
 * This component displays the user's profile information and provides a logout option.
 * It utilizes the DataContext to access the current user's data and allows the user to log out.
 */

import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useDataContext } from '@/data-store/dataContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/data-store/types';
import { StatusBar } from 'expo-status-bar';

/**
 * UserProfileScreen Component
 * Displays the current user's profile information and a logout button.
 *
 * @returns A React component that renders the user's profile screen.
 */
export default function UserProfileScreen() {
  // Access currentUser and setCurrentUser from the DataContext
  const { currentUser, setCurrentUser } = useDataContext();

  // Navigation hook to navigate between screens
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Render the user's profile information and logout option
  return (
    <View style={styles.container}>
      {/* Separator line for visual separation */}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      {/* Display user information if available */}
      {currentUser ? (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>
            Name: {currentUser.name} {currentUser.secondName}
          </Text>
          <Text style={styles.userInfoText}>Phone: {currentUser.phone}</Text>
          <Text style={styles.userInfoText}>Email: {currentUser.email}</Text>
          <Text style={styles.userInfoText}>Role: {currentUser.role}</Text>
        </View>
      ) : (
        <Text>No user information available</Text>
      )}

      {/* Logout Button */}
      <Pressable
        style={styles.logoutButton}
        onPress={() => {
          // Clear the current user and navigate to the login screen
          setCurrentUser(null);
          navigation.navigate('login');
        }}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

/**
 * Stylesheet for the UserProfileScreen component.
 * Defines styles for layout, text, buttons, and other UI elements.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1, // Allows the container to fill the available space
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center', // Centers content vertically
    padding: 20, // Adds padding around the content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  separator: {
    marginVertical: 20, // Adds vertical spacing around the separator
    height: 1, // Sets the height of the separator line
    width: '80%', // Sets the width relative to the container
  },
  userInfoContainer: {
    alignItems: 'flex-start', // Aligns text to the start (left)
    width: '100%', // Full width to align with padding
    paddingHorizontal: 20,
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007bff', // Blue color for the button background
    borderRadius: 8, // Rounds the corners of the button
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#ffffff', // White text color for contrast
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
