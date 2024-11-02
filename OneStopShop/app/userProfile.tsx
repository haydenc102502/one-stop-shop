import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useDataContext } from '@/data-store/dataContext';

export default function UserProfileScreen() {
  const { users, currentUserId } = useDataContext();
  const currentUser = users.find(user => user.userId === currentUserId);

  return (
    <View style={styles.container}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      {/* Display user information if available */}
      {currentUser ? (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Name: {currentUser.name} {currentUser.secondName}</Text>
          <Text style={styles.userInfoText}>Phone: {currentUser.phone}</Text>
          <Text style={styles.userInfoText}>Email: {currentUser.email}</Text>
          <Text style={styles.userInfoText}>Role: {currentUser.role}</Text>
        </View>
      ) : (
        <Text>No user information available</Text>
      )}
      
      {/* Logout Button */}
      <Pressable style={styles.logoutButton} onPress={() => { /* Add logout logic here */ }}>
        <Text style={styles.logoutButtonText}>Program this button to return to the login screen to change a user for demo.</Text>
      </Pressable>
      
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  userInfoContainer: {
    alignItems: 'flex-start',
    width: '100%',
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
    backgroundColor: '#007bff', // Blue color
    borderRadius: 8,
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
