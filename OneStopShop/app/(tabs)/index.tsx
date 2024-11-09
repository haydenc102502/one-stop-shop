import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { useDataContext } from '@/data-store/dataContext';
import AgendaItem from '@/components/AgendaItem';

export default function TabTwoScreen() {
  const { calendarData, updateCalendarEntry, removeCalendarEntry, completeCalendarEntry } = useDataContext(); // Access calendar data from the context
  const [agendaData, setAgendaData] = useState<{ [date: string]: any[] }>({});

  useEffect(() => {
    // Format calendarData for the agenda
    const data: { [date: string]: any[] } = {};
    calendarData.forEach((entry) => {
      if (!data[entry.day]) data[entry.day] = [];
      data[entry.day].push({
        title: entry.description,
        hour: entry.time,
        duration: '1h', // Customize as needed
      });
    });
    setAgendaData(data);
  }, [calendarData]);

  const handleComplete = (id: string) => {
    completeCalendarEntry(id);
  };

  const handleUpdate = (id: string, updatedData: any) => {
    updateCalendarEntry(id, updatedData);
  };

  const handleRemove = (id: string) => {
    Alert.alert('Are you sure you want to delete this event?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeCalendarEntry(id) },
    ]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(agendaData)}
        keyExtractor={(item) => item}
        renderItem={({ item: date }) => (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{date}</Text>
            {agendaData[date].map((event, index) => (
              <AgendaItem
                key={index}
                item={event}
                onComplete={() => handleComplete(event.id)}
                onUpdate={(updatedData) => handleUpdate(event.id, updatedData)}
                onRemove={() => handleRemove(event.id)}
              />
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});
