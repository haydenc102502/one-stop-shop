import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { useDataContext } from '@/data-store/dataContext';
import AgendaItem from '@/components/AgendaItem';
import { CalendarEntry } from '@/data-store/types';

/**
 * 'Agenda Screen' component that displays a list of calendar entries grouped by date.
 * @returns a FlatList component with a list of calendar entries grouped by date
 */
export default function TabTwoScreen() {
  const { calendarData, updateCalendarEntry, removeCalendarEntry, completeCalendarEntry, uncompleteCalendarEntry } = useDataContext();
  const [agendaData, setAgendaData] = useState<{ [date: string]: CalendarEntry[] }>({});

  /**
   * Group calendar entries by date and set the grouped data to the state.
   * This effect will run whenever the calendarData changes.
   */
  useEffect(() => {
    const data: { [date: string]: CalendarEntry[] } = {};
    calendarData.forEach((entry) => {
      if (!data[entry.day]) data[entry.day] = [];
      data[entry.day].push(entry);
    });
    setAgendaData(data);
  }, [calendarData]);

  /**
   * Handle the completion of a calendar entry by calling the completeCalendarEntry function 
   * in the data context with the entry ID and the completed time.
   * @param id the ID of the calendar entry to complete
   * @param completedTime current time when the entry is completed (displayed in HH:MM:SS format)
   */
  const handleComplete = (id: string, completedTime: string) => {
    completeCalendarEntry(id, completedTime);
  };

  /**
   * Handle the uncompletion of a calendar entry by calling the uncompleteCalendarEntry function 
   * in the data context with the entry ID.
   * @param id the ID of the calendar entry to uncomplete
   */
  const handleUncomplete = (id: string) => {
    uncompleteCalendarEntry(id);
  };

  /**
   * Handle the update of a calendar entry by calling the updateCalendarEntry function 
   * in the data context with the entry ID and the updated data.
   * @param id the ID of the calendar entry to update
   * @param updatedData the updated data for the calendar entry
   */
  const handleUpdate = (id: string, updatedData: Partial<CalendarEntry>) => {
    updateCalendarEntry(id, updatedData);
  };

  /**
   * Handle the removal of a calendar entry by displaying an alert to confirm the deletion.
   * If the user confirms, the removeCalendarEntry function is called with the entry ID.
   * @param id the ID of the calendar entry to remove
   */
  const handleRemove = (id: string) => {
    Alert.alert('Are you sure you want to delete this event?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeCalendarEntry(id) },
    ]);
  };

  // Render the list of calendar entries grouped by date
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
                onComplete={(completedTime) => handleComplete(event.id, completedTime)}
                onUncomplete={() => handleUncomplete(event.id)}
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