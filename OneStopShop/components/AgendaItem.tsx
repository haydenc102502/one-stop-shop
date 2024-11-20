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

/**
 * AgendaItem component to display a single item in the index.tsx
 * @param props contains the item, onComplete, onUpdate, onRemove, and onUncomplete functions
 * @returns a TouchableOpacity component with the item details and buttons to complete, update, and remove the item
 */
const AgendaItem = (props: ItemProps) => {
  const { item, onComplete, onUpdate, onRemove, onUncomplete } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(item.title);
  const [updatedDay, setUpdatedDay] = useState(item.day);
  const [updatedHour, setUpdatedHour] = useState(item.time);
  const [updatedDuration, setUpdatedDuration] = useState(item.duration);
  const [updatedDescription, setUpdatedDescription] = useState(item.description);
  const [updatedCategory, setUpdatedCategory] = useState(item.calendarEntryCategory);

  // Handle the update of a task with the updated data
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

  /* Handle the completion of a task by calling the onComplete function */
  const handleComplete = () => {
    const completedTime = new Date().toLocaleTimeString();
    onComplete(completedTime);
  };

  /** Handle the press of the item
   * If the task is completed, show an alert with the completion time
   * If the task is not completed, show an alert with the description
   */
  const handlePress = () => {
    if (item.completed) {
      Alert.alert('Task Completed', `${item.title}\nCompleted at: ${item.completedTime}`);
    } else {
      Alert.alert('Task Description', item.description || 'No Description');
    }
  };

  /** Truncate the description to 10 characters if it is longer than 10 characters and add '...' at the end
   * @param description the description of the task
   * @returns new description with 10 characters or less
   */
  const truncateDescription = (description: string | undefined) => {
    if (!description) return '';
    return description.length > 10 ? `${description.substring(0, 10)}...` : description;
  };

  /* If the item is empty, return a view with a message saying 'No Events Planned Today' */
  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  // Return the TouchableOpacity component with the item details and buttons
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
            <TouchableOpacity style={styles.button} onPress={onUncomplete}>
              <Text style={styles.buttonText}>Uncomplete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onRemove}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleComplete}>
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onRemove}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        testID="modal-container"
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
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleUpdate}>
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
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
  button: {
    backgroundColor: '#F76902',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
  modalButton: {
    backgroundColor: '#F76902',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
    borderColor: '#F76902',
  },
  categoryText: {
    color: 'black',
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});