import React, { useCallback, useState } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Button, Modal, TextInput } from 'react-native';

// Explicitly type the isEmpty function to accept any object or undefined
const isEmpty = (obj: Record<string, unknown> | undefined | null): boolean => {
  return !obj || Object.keys(obj).length === 0;
};

interface ItemProps {
  item: {
    id: string;
    hour?: string;
    duration?: string;
    title?: string;
    description?: string; // Add description field
    completed?: boolean;
    completedTime?: string;
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
  const [updatedHour, setUpdatedHour] = useState(item.hour);
  const [updatedDuration, setUpdatedDuration] = useState(item.duration);

  const handleUpdate = () => {
    onUpdate({ title: updatedTitle, hour: updatedHour, duration: updatedDuration });
    setModalVisible(false);
  };

  {/** Handle the completion of a task
    * Called when the 'Complete' button is pressed */}
  const handleComplete = () => {
    const completedTime = new Date().toLocaleTimeString(); // Get the current time
    onComplete(completedTime);
  };

  {/** Handle the press of the item
    * If the task is completed, show an alert with the completion time
    * If the task is not completed, show an alert with the description */}
  const handlePress = () => {
    if (item.completed) {
      Alert.alert('Task Completed', `${item.title}\nCompleted at: ${item.completedTime}`);
    } else {
      Alert.alert('Task Description', item.description || 'No Description');
    }
  };

  {/* Empty case when the user is lame */}
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
        <Text style={styles.itemHourText}>{item.hour}</Text>
      </View>
      {item.completed && (
        <View>
          <Text style={styles.itemCompletedTimeText}>Completed at: {item.completedTime}</Text>
        </View>
      )}
      {!item.completed && (
        <View>
          <Text style={styles.itemDurationText}>{item.duration}</Text>
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
    opacity: 0.5, // Reduce opacity for completed items
    filter: 'blur(2px)', // Apply blur effect for completed items
  },
  uncompletedItem: {
    opacity: 1, // Full opacity for uncompleted items
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
    marginLeft: 4,
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
});