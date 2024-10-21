import { StyleSheet } from 'react-native';
import { useState } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Calendar, DateData } from 'react-native-calendars'; // Import DateData type

export default function CalendarScreen() {
  const [selected, setSelected] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Calendar Component */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day: DateData) => { // Explicitly typing 'day' as DateData
            setSelected(day.dateString);
            console.log('selected day', day);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: 'orange',
            },
          }}
          style={styles.calendar}
        />
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
});
