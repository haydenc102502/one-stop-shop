import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

/**
 * Defines a course
 */
interface Course {
  id: string;
  title: string;
  description: string;
}

type CourseDetailsRouteProp = RouteProp<
  { CourseDetails: { course: Course } },
  'CourseDetails'
>;

const Tab = createMaterialTopTabNavigator();


const ContentScreen: React.FC = () => (
  <SafeAreaView style={styles.screenContainer}>
    <Text style={styles.text}>Content for the course will be displayed here.</Text>
  </SafeAreaView>
);

const GradesScreen: React.FC = () => (
  <SafeAreaView style={styles.screenContainer}>
    <Text style={styles.text}>Grades and assessments will be displayed here.</Text>
  </SafeAreaView>
);

/**
 * Course details screen that has a course content and grades when clicking on a course.
 * @returns TabNavigator object with two distinct course details- content and grades
 */
const CourseDetailsScreen: React.FC = () => {
  const route = useRoute<CourseDetailsRouteProp>();
  const navigation = useNavigation();
  const { course } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: course.title,
    });
  }, [navigation, course]);

  return (
    <Tab.Navigator
      initialRouteName="Content"
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        tabBarIndicatorStyle: {
          backgroundColor: 'orange', 
        },
        tabBarLabelStyle: {
          fontWeight: 'bold', 
          fontSize: 14, 
        },
        tabBarStyle: {
          backgroundColor: '#fff', 
        },
      }}
    >
      <Tab.Screen
        name="Content"
        component={ContentScreen}
        options={{ tabBarLabel: 'Content' }} 
      />
      <Tab.Screen
        name="Grades"
        component={GradesScreen}
        options={{ tabBarLabel: 'Grades' }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
});

export default CourseDetailsScreen;