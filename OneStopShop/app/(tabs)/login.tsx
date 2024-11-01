import { UserRole } from '@/data-store/userRole';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.title}>One Stop Shop</Text>
      <TextInput
        id="email"
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        id="password"
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.roleButtonsContainer}>
        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[styles.roleButton, role === UserRole.STUDENT && styles.activeButton]}
            onPress={() => setRole(UserRole.STUDENT)}
          >
            <Text style={[styles.roleButtonText, role === UserRole.STUDENT && styles.activeButtonText]}>
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === UserRole.FACULTY && styles.activeButton]}
            onPress={() => setRole(UserRole.FACULTY)}
          >
            <Text style={[styles.roleButtonText, role === UserRole.FACULTY && styles.activeButtonText]}>
              Faculty
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === UserRole.COURSE_ASSISTANT && styles.activeButton]}
            onPress={() => setRole(UserRole.COURSE_ASSISTANT)}
          >
            <Text style={[styles.roleButtonText, role === UserRole.COURSE_ASSISTANT && styles.activeButtonText]}>
              Course Assistant
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    position: 'absolute',
    top: 40,
    left: 20,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20, // Added horizontal padding
  },
  roleButtonsContainer: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 5,
    marginVertical: 15, // Adjusted to add vertical margin instead of roleButtons
    marginTop: 100, // Added marginTop to create space above
    paddingHorizontal: 20, // Added horizontal padding
  },
  roleButtons: {
    flexDirection: 'row',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 0,
  },
  activeButton: {
    backgroundColor: '#fff',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  activeButtonText: {
    color: '#000',
  },
  loginButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});