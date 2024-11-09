import React, { useCallback } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Button } from 'react-native';

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
  };
  onComplete: () => void;
  onUpdate: (updatedData: any) => void;
  onRemove: () => void;
}

const AgendaItem = (props: ItemProps) => {
  const { item, onComplete, onUpdate, onRemove } = props;

  const itemPressed = useCallback(() => {
    Alert.alert(item.title || 'No Title');
  }, [item.title]);

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={itemPressed} style={styles.item}>
      <View>
        <Text style={styles.itemHourText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.duration}</Text>
      </View>
      <Text style={styles.itemTitleText}>{item.title}</Text>
      <View style={styles.itemButtonContainer}>
        <Button color={'grey'} title={'Complete'} onPress={onComplete} />
        <Button color={'grey'} title={'Update'} onPress={() => onUpdate({ title: 'Updated Title' })} />
        <Button color={'grey'} title={'Remove'} onPress={onRemove} />
      </View>
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
});