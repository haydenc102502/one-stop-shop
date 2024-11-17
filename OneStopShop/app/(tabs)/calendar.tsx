import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useDataContext } from '@/data-store/dataContext';
import { CalendarEntry } from '@/data-store/types';
import { CalendarEntryCategory } from '@/data-store/calendarEntryCategory';

// Define colors for each category
const categoryColors = {
  [CalendarEntryCategory.GRADES]: 'red',
  [CalendarEntryCategory.ANNOUNCEMENT]: 'yellow',
  [CalendarEntryCategory.ASSIGNMENT]: 'green',
};

export default function CalendarScreen() {
  const [selected, setSelected] = useState('');
  const [selectedDateDetails, setSelectedDateDetails] = useState<CalendarEntry[] | null>(null);
  const { currentUser, calendarData, sendPushNotifications } = useDataContext();

  useEffect(() => {
    sendPushNotifications();
  }, [calendarData]);

  // Convert `calendarData` to `markedDates` with color-coded dots for each category
  const markedDates = {} as Record<string, any>;
  calendarData.forEach((entry) => {
    if (!markedDates[entry.day]) {
      markedDates[entry.day] = { dots: [] };
    }
    markedDates[entry.day].dots.push({
      key: `${entry.day}-${markedDates[entry.day].dots.length}`,
      color: categoryColors[entry.calendarEntryCategory] || 'blue', // Default color if not matched
    });
  });

  // Handler for date selection
  const handleDayPress = (day: DateData) => {
    setSelected(day.dateString);
    // Filter calendarData to show details for the selected date
    const dateEntries = calendarData.filter((entry) => entry.day === day.dateString);
    setSelectedDateDetails(dateEntries.length > 0 ? dateEntries : null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current User ID: {currentUser?.userId}</Text>
      <View style={[styles.separator, { backgroundColor: '#eee' }]} />

      {/* Calendar Component */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            ...markedDates,
            [selected]: {
              ...(markedDates[selected] || { dots: [] }),
              selected: true,
              disableTouchEvent: true,
              selectedColor: 'orange',
            },
          }}
          markingType={'multi-dot'} // Allows for multiple dots
          style={styles.calendar}
        />
      </View>

      {/* Display Selected Date Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Details for {selected}</Text>
        <ScrollView>
          {selectedDateDetails && selectedDateDetails.length > 0 ? (
            selectedDateDetails.map((entry, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailText}>Time: {entry.time}</Text>
                <Text style={styles.detailText}>Description: {entry.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDetailsText}>No events for this date</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  calendarContainer: {
    width: '100%',
    paddingHorizontal: 10,
    flex: 1,
  },
  calendar: {
    borderWidth: 1,
    borderColor: 'gray',
    height: 350,
  },
  detailsContainer: {
    width: '90%',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailItem: {
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
  },
  noDetailsText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
  },
});
