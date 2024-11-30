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

interface Course {
  id: string;
  title: string;
}

/**
 * Dummy courses for now- we don't have the power yet
 */
const courses: Course[] = [
  { id: '1', title: 'Introduction to Software Engineering'},
  { id: '2', title: 'Analysis of Algorithms' },
  { id: '3', title: 'Model-Driven Development' },
  { id: '4', title: 'University Physics'},
  { id: '5', title: 'Software Testing'},
];

const colors = ['#FF5733', '#33C1FF', '#28A745', '#FFC107', '#6F42C1'];

/**
 * Screen containing all of a student's courses
 * @returns SafeAreaView of a list of student courses.
 */
const CourseScreen: React.FC = () => {
  const navigation = useNavigation(); 
  // Render individual course items
  const renderCourseItem = ({ item, index }: { item: Course; index: number }) => {
    const accentColor = colors[index % colors.length]; 

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