// register.tsx

/**
 * This file defines the RegisterScreen component, which allows users to create a new account.
 * It includes input fields for user details and handles user registration logic.
 */

import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { UserRole } from '@/data-store/userRole';
import { RootStackParamList } from '@/data-store/types';
import { useDataContext } from '@/data-store/dataContext';

/**
 * RegisterScreen Component
 * Provides a user interface for new users to register an account.
 *
 * @returns A React component that renders the registration form.
 */
export default function RegisterScreen() {
  // State variables to hold user input
  const [name, setName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);

  // Navigation object to handle screen transitions
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Destructure functions from the data context for user management
  const { addUser, userExists } = useDataContext();

  /**
   * Handles the registration process when the user taps the "Register" button.
   * Validates input, checks for existing users, adds new user, and navigates to login screen.
   */
  const handleRegister = () => {
    // Check if a user with the provided email already exists
    if (userExists(email)) {
      Alert.alert('Registration failed', 'User already exists');
      return;
    }

    // Create a new user object with the provided input
    const newUser = {
      userId: email.split('@')[0],
      name: name,
      secondName: secondName,
      phone: '',
      email: email,
      role: role || UserRole.STUDENT,
      password: password,
    };

    // Attempt to add the new user to the data store
    const userAdded = addUser(newUser);

    // Provide feedback based on whether the user was successfully added
    if (userAdded) {
      navigation.navigate('login');
      Alert.alert('Registration successful!', 'Please log in to access your account.');
    } else {
      Alert.alert('Registration failed', 'User could not be added');
    }
  };

  // Render the registration form UI
  return (
    <View style={styles.container}>
      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* Screen Title */}
      <Text onPress={() => navigation.navigate('calendar')} style={styles.title}>
        Create Your Account
      </Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={name}
          onChangeText={setName}
          autoComplete="given-name"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={secondName}
          onChangeText={setSecondName}
          autoComplete="family-name"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoComplete="new-password"
        />
      </View>

      {/* Role Selection Buttons */}
      <View style={styles.roleButtonsContainer}>
        <View style={styles.roleButtons}>
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
          <TouchableOpacity
            style={[styles.roleButton, role === UserRole.COURSE_ASSISTANT && styles.activeButton]}
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

      {/* Navigation Link to Login Screen */}
      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={styles.loginLinkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Stylesheet for the RegisterScreen component.
 * Defines styles for layout, text, inputs, buttons, and other UI elements.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1, // Allows the container to fill the available space
    alignItems: 'center', // Centers content horizontally
    justifyContent: 'center', // Centers content vertically
    padding: 20, // Adds padding around the content
  },
  title: {
    position: 'absolute',
    top: 75,
    left: 30,
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 70, // Positions the input fields below the title
    width: '100%',
    alignItems: 'center',
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
    marginTop: 50,
  },
  roleButtons: {
    flexDirection: 'row', // Arranges buttons horizontally
  },
  roleButton: {
    flex: 1, // Each button takes up equal space
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#fff', // Highlights the selected role button
  },
  roleButtonText: {
    fontSize: 12,
  },
  activeButtonText: {
    color: '#000', // Changes text color for the active role
  },
  registerButton: {
    position: 'absolute',
    top: 70,
    right: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  registerButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginLinkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  testLinkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
});
