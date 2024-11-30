import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define the Course interface
interface Course {
  id: string;
  title: string;
  description: string;
}

// Mock data for courses
const courses: Course[] = [
  { id: '1', title: 'Introduction to Software Engineering', description: 'Nothing to see here!' },
  { id: '2', title: 'Analysis of Algorithms', description: 'Nothing to see here!' },
  { id: '3', title: 'Model-Driven Development', description: 'Nothing to see here!' },
  { id: '4', title: 'University Physics', description: 'Nothing to see here!' },
  { id: '5', title: 'Software Testing', description: 'Nothing to see here!' },
];

// Array of colors for accenting courses
const colors = ['#FF5733', '#33C1FF', '#28A745', '#FFC107', '#6F42C1'];

const CourseScreen: React.FC = () => {
  const navigation = useNavigation(); // Hook to navigate between screens

  // Render individual course items
  const renderCourseItem = ({ item, index }: { item: Course; index: number }) => {
    const accentColor = colors[index % colors.length]; // Cycle through colors

    return (
      <TouchableOpacity
        style={[styles.courseItem, { borderColor: accentColor }]}
        onPress={() => navigation.navigate('details', { course: item })}
      >
        <Text style={[styles.courseTitle]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={renderCourseItem}
        contentContainerStyle={styles.courseList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  courseList: {
    paddingBottom: 16,
  },
  courseItem: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dddddd',
    backgroundColor: '#ffffff',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CourseScreen;