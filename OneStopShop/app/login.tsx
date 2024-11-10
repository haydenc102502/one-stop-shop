// login.tsx

/**
 * This component provides a login interface for users to authenticate themselves.
 * It uses the DataContext to access authentication functions and navigates users upon successful login.
 */

import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { UserRole } from '@/data-store/userRole';
import { RootStackParamList } from '@/data-store/types';
import { useDataContext } from '@/data-store/dataContext';

/**
 * LoginScreen Component
 * Renders the login form and handles user authentication.
 *
 * @returns A React component that renders the login interface.
 */
export default function LoginScreen() {
  // State variables to hold user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);

  // Navigation hook to navigate between screens
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Accessing the authenticateUser function from DataContext
  const { authenticateUser } = useDataContext();

  /**
   * Handles the login process.
   * Calls authenticateUser from the context with the entered email and password.
   * Navigates to the 'calendar' screen upon successful authentication.
   */
  const handleLogin = () => {
    const success = authenticateUser(email, password);
    if (success) {
      navigation.navigate('calendar');
    } else {
      Alert.alert('Login failed', 'Invalid email or password');
      // Reset email and password fields on failure
      setEmail('');
      setPassword('');
    }
  };

  // Render the login form UI
  return (
    <View style={styles.container}>
      {/* Login button at the top-right corner */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* App title; navigating to 'calendar' on press for testing purposes */}
      <Text onPress={() => navigation.navigate('calendar')} style={styles.title}>
        One Stop Shop
      </Text>

      {/* Email input field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password input field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* Role selector (currently not functional) */}
      {/* TODO: Implement role-based authentication if required */}
      <View style={styles.roleButtonsContainer}>
        <View style={styles.roleButtons}>
          {/* Student role button */}
          <TouchableOpacity
            style={[styles.roleButton, role === UserRole.STUDENT && styles.activeButton]}
            onPress={() => setRole(UserRole.STUDENT)}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === UserRole.STUDENT && styles.activeButtonText,
              ]}
            >
              Student
            </Text>
          </TouchableOpacity>

          {/* Faculty role button */}
          <TouchableOpacity
            style={[styles.roleButton, role === UserRole.FACULTY && styles.activeButton]}
            onPress={() => setRole(UserRole.FACULTY)}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === UserRole.FACULTY && styles.activeButtonText,
              ]}
            >
              Faculty
            </Text>
          </TouchableOpacity>

          {/* Course Assistant role button */}
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === UserRole.COURSE_ASSISTANT && styles.activeButton,
            ]}
            onPress={() => setRole(UserRole.COURSE_ASSISTANT)}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === UserRole.COURSE_ASSISTANT && styles.activeButtonText,
              ]}
            >
              Course Assistant
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Link to the registration screen */}
      <TouchableOpacity onPress={() => navigation.navigate('register')}>
        <Text style={styles.registerLinkText}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Stylesheet for the LoginScreen component.
 * Defines styles for layout, text, inputs, buttons, and other UI elements.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
    padding: 20,
  },
  title: {
    position: 'absolute',
    top: 35,
    left: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '85%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
  },
  roleButtonsContainer: {
    width: '85%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 15,
    marginTop: 100,
  },
  roleButtons: {
    flexDirection: 'row', // Arrange role buttons horizontally
  },
  roleButton: {
    flex: 1, // Evenly distribute space among buttons
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 0,
  },
  activeButton: {
    backgroundColor: '#fff', // Highlight active button
  },
  roleButtonText: {
    paddingHorizontal: 10,
    fontSize: 10,
    fontWeight: 'normal',
  },
  activeButtonText: {
    color: '#000', // Text color for active button
  },
  loginButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
  },
  loginButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  registerLinkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
});
