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
      <Text style={styles.title}>One Stop Shop</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Second Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
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
    fontSize: 24,
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
  },
  roleButtons: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#000',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: '#fff',
  },
  loginButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#000',
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});