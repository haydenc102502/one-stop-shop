import { UserRole } from '@/data-store/userRole';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);

  const handleRegister = () => {
    // TODO: Implement registration logic
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create Your Account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          id="registerFirstName"
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          autoComplete="given-name"
        />
        <TextInput
          id="registerLastName"
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          autoComplete="family-name"
        />
        <TextInput
          id="registerEmail"
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextInput
          id="registerPassword"
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoComplete="new-password"
        />
      </View>
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
    top: 35,
    left: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 70,
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
    flexDirection: 'row',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#fff',
  },
  roleButtonText: {
    fontSize: 12,
  },
  activeButtonText: {
    color: '#000',
  },
  registerButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
  },
  registerButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
});
