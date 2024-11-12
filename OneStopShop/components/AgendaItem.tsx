import React, { useState } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Button, Modal, TextInput } from 'react-native';
import { CalendarEntryCategory } from '@/data-store/calendarEntryCategory';

// Explicitly type the isEmpty function to accept any object or undefined
const isEmpty = (obj: Record<string, unknown> | undefined | null): boolean => {
  return !obj || Object.keys(obj).length === 0;
};

interface ItemProps {
  item: {
    id: string;
    day: string;
    time?: string;
    duration?: string;
    title?: string;
    description?: string;
    completed?: boolean;
    completedTime?: string;
    calendarEntryCategory?: CalendarEntryCategory;
  };
  onComplete: (completedTime: string) => void;
  onUpdate: (updatedData: any) => void;
  onRemove: () => void;
  onUncomplete: () => void;
}

const AgendaItem = (props: ItemProps) => {
  const { item, onComplete, onUpdate, onRemove, onUncomplete } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(item.title);
  const [updatedDay, setUpdatedDay] = useState(item.day);
  const [updatedHour, setUpdatedHour] = useState(item.time);
  const [updatedDuration, setUpdatedDuration] = useState(item.duration);
  const [updatedDescription, setUpdatedDescription] = useState(item.description);
  const [updatedCategory, setUpdatedCategory] = useState(item.calendarEntryCategory);

  const handleUpdate = () => {
    const updatedData = {
      title: updatedTitle !== undefined ? updatedTitle : item.title,
      day: updatedDay !== undefined ? updatedDay : item.day,
      time: updatedHour !== undefined ? updatedHour : item.time,
      duration: updatedDuration !== undefined ? updatedDuration : item.duration,
      description: updatedDescription !== undefined ? updatedDescription : item.description,
      calendarEntryCategory: updatedCategory !== undefined ? updatedCategory : item.calendarEntryCategory,
    };
    onUpdate(updatedData);
    setModalVisible(false);
  };

  // Handle the completion of a task
  // Called when the 'Complete' button is pressed
  const handleComplete = () => {
    const completedTime = new Date().toLocaleTimeString();
    onComplete(completedTime);
  };

  // Handle the press of the item
  // If the task is completed, show an alert with the completion time
  // If the task is not completed, show an alert with the description
  const handlePress = () => {
    if (item.completed) {
      Alert.alert('Task Completed', `${item.title}\nCompleted at: ${item.completedTime}`);
    } else {
      Alert.alert('Task Description', item.description || 'No Description');
    }
  };

  const truncateDescription = (description: string | undefined) => {
    if (!description) return '';
    return description.length > 10 ? `${description.substring(0, 10)}...` : description;
  };

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.item, item.completed ? styles.completedItem : styles.uncompletedItem]}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitleText}>{item.title}</Text>
        <View>
          <Text style={styles.itemHourText}>{item.time}</Text>
          <Text style={styles.itemDurationText}>{item.duration}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.itemDescriptionText}>{truncateDescription(item.description)}</Text>
      </View>
      {item.completed && (
        <View>
          <Text style={styles.itemCompletedTimeText}>Completed at: {item.completedTime}</Text>
        </View>
      )}
      <View style={styles.itemButtonContainer}>
        {item.completed ? (
          <>
            <Button color={'grey'} title={'Uncomplete'} onPress={onUncomplete} />
            <Button color={'grey'} title={'Remove'} onPress={onRemove} />
          </>
        ) : (
          <>
            <Button color={'grey'} title={'Complete'} onPress={handleComplete} />
            <Button color={'grey'} title={'Update'} onPress={() => setModalVisible(true)} />
            <Button color={'grey'} title={'Remove'} onPress={onRemove} />
          </>
        )}
        </View>

      {/* Modal to update the task */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={updatedTitle}
              onChangeText={setUpdatedTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={updatedDescription}
              onChangeText={setUpdatedDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Day (e.g., 2024-10-29)"
              value={updatedDay}
              onChangeText={setUpdatedDay}
            />
            <TextInput
              style={styles.input}
              placeholder="Hour"
              value={updatedHour}
              onChangeText={setUpdatedHour}
            />
            <TextInput
              style={styles.input}
              placeholder="Duration"
              value={updatedDuration}
              onChangeText={setUpdatedDuration}
            />
            <View style={styles.categoryRow}>
              {Object.values(CalendarEntryCategory).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, updatedCategory === cat && styles.selectedCategoryButton]}
                  onPress={() => setUpdatedCategory(cat)}
                >
                  <Text style={updatedCategory === cat ? styles.selectedCategoryText : styles.categoryText}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="gray" />
              <Button title="Update" onPress={handleUpdate} color="#F76902" />
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'column',
  },
  completedItem: {
    opacity: 0.5,
  },
  uncompletedItem: {
    opacity: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHourText: {
    color: 'grey',
    fontSize: 12,
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
  },
  itemDescriptionText: {
    color: 'black',
    fontSize: 14,
    marginTop: 4,
  },
  itemCompletedTimeText: {
    color: 'black',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14,
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCategoryButton: {
    backgroundColor: '#F76902',
  },
  categoryText: {
    color: '#000',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});