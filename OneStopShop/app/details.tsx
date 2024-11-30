import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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

const CourseDetailsScreen: React.FC = () => {
  const route = useRoute<CourseDetailsRouteProp>();
  const navigation = useNavigation();
  const { course } = route.params;

  // Dynamically set the header title to the course name
  useLayoutEffect(() => {
    navigation.setOptions({
      title: course.title,
    });
  }, [navigation, course]);

  return (
    <Tab.Navigator
      initialRouteName="Content"
      screenOptions={{
        tabBarActiveTintColor: 'orange', // Set active tab text color to orange
        tabBarIndicatorStyle: {
          backgroundColor: 'orange', // Set the active tab underline color to orange
        },
        tabBarLabelStyle: {
          fontWeight: 'bold', // Make tab labels bold
          fontSize: 14, // Adjust font size if needed
        },
        tabBarStyle: {
          backgroundColor: '#fff', // Background color for the tab bar
        },
      }}
    >
      <Tab.Screen
        name="Content"
        component={ContentScreen}
        options={{ tabBarLabel: 'Content' }} // Explicitly define the label
      />
      <Tab.Screen
        name="Grades"
        component={GradesScreen}
        options={{ tabBarLabel: 'Grades' }} // Explicitly define the label
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