import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
} from 'react-native';
import { useDataContext } from '@/data-store/dataContext';
import { CalendarEntryCategory } from '@/data-store/calendarEntryCategory';

export default function AddCalendarEntry() {
  const { users, addCalendarEntry } = useDataContext();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CalendarEntryCategory>(CalendarEntryCategory.ANNOUNCEMENT);
  const [pushNotified, setPushNotified] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddEntry = () => {
    if (!selectedUserId || !day || !time || !description) {
      Alert.alert('All fields are required.');
      return;
    }

    const newEntry = {
      userId: selectedUserId,
      day,
      time,
      description,
      calendarEntryCategory: category,
      pushNotified,
    };

    addCalendarEntry(newEntry);
    Alert.alert('Entry added successfully!');

    // Clear inputs after adding
    setSelectedUserId('');
    setDay('');
    setTime('');
    setDescription('');
    setCategory(CalendarEntryCategory.ANNOUNCEMENT);
    setPushNotified(false);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Calendar Entry</Text>

      {/* User Selection */}
      <Text style={styles.label}>Select User:</Text>
      <TouchableOpacity style={styles.userSelector} onPress={() => setModalVisible(true)}>
        <Text style={styles.userSelectorText}>
          {selectedUserId
            ? `${users.find((user) => user.userId === selectedUserId)?.name} ${users.find((user) => user.userId === selectedUserId)?.secondName
            }`
            : 'Select a User'}
        </Text>
      </TouchableOpacity>

      {/* Modal for User Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a User</Text>
            <FlatList
              data={users}
              keyExtractor={(item) => item.userId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleUserSelect(item.userId)}
                >
                  <Text style={styles.modalItemText}>{`${item.name} ${item.secondName}`}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.input}
        placeholder="Day (e.g., 2024-10-29)"
        value={day}
        onChangeText={setDay}
      />
      <TextInput
        style={styles.input}
        placeholder="Time (e.g., 10:00 AM)"
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Category:</Text>
      <View style={styles.categoryRow}>
        {Object.values(CalendarEntryCategory).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, category === cat && styles.selectedCategoryButton]}
            onPress={() => setCategory(cat)}
          >
            <Text style={category === cat ? styles.selectedCategoryText : styles.categoryText}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Add Entry" onPress={handleAddEntry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  userSelector: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  userSelectorText: {
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCategoryButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    color: 'black',
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});
