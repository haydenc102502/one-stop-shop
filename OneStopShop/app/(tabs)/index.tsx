import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState } from 'react';
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
  const { currentUserId, calendarData } = useDataContext();

  // Convert calendarData to markedDates format with multiple dots support
 // Convert calendarData to markedDates format with multiple dots support and color coding
 const markedDates = Object.keys(calendarData).reduce((acc, date) => {
  const entries = calendarData[date];
  acc[date] = {
    dots: entries.map((entry, index) => ({
      key: `${date}-${index}`,
      color: categoryColors[entry.calendarEntryCategory]  || 'blue' // Color based on category
    })),
    selected: date === selected,
    ...(date === selected && {
      disableTouchEvent: true,
      selectedColor: 'orange',
    }),
  };
  return acc;
}, {} as Record<string, any>);
  // Handler for date selection
  const handleDayPress = (day: DateData) => {
    setSelected(day.dateString);
    setSelectedDateDetails(calendarData[day.dateString] || null); // Update details for selected date
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current User ID: {currentUserId}</Text>
      <View style={[styles.separator, { backgroundColor: '#eee' }]} />

      {/* Calendar Component */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
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
