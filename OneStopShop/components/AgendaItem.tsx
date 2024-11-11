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
    completed?: boolean;
  };
  onComplete: () => void;
  onUpdate: (updatedData: any) => void;
  onRemove: () => void;
  onUncomplete: () => void;
}

const AgendaItem = (props: ItemProps) => {
  const { item, onComplete, onUpdate, onRemove, onUncomplete } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(item.title);

  const itemPressed = useCallback(() => {
    Alert.alert(item.title || 'No Title');
  }, [item.title]);

  const handleUpdate = () => {
    onUpdate({ title: updatedTitle });
    setModalVisible(false);
  };

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={itemPressed} style={[styles.item, item.completed ? styles.completedItem : styles.uncompletedItem]}>
      <View>
        <Text style={styles.itemHourText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.duration}</Text>
      </View>
      <Text style={styles.itemTitleText}>{item.title}</Text>
      <View style={styles.itemButtonContainer}>
        {item.completed ? (
          <>
            <Button color={'grey'} title={'Uncomplete'} onPress={onUncomplete} />
            <Button color={'grey'} title={'Remove'} onPress={onRemove} />
          </>
        ) : (
          <>
            <Button color={'grey'} title={'Complete'} onPress={onComplete} />
            <Button color={'grey'} title={'Remove'} onPress={onRemove} />
            <Button color={'grey'} title={'Update'} onPress={() => setModalVisible(true)} />
          </>
        )}
      </View>

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
            <Button title="Update" onPress={handleUpdate} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
    transform: [{ scaleY: 0.75 }], // Scale down completed items
    filter: 'blur(2px)', // Apply blur effect for completed items
  },
  uncompletedItem: {
    opacity: 1, // Full opacity for uncompleted items
  },
  itemHourText: {
    color: 'black',
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
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
});