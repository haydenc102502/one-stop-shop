import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { MaterialIcons } from '@expo/vector-icons'; // Use @expo/vector-icons for hamburger menu icon

interface Course {
  id: string;
  title: string;
  description: string;
}

type CourseDetailsRouteProp = RouteProp<
  { CourseDetails: { course: Course } },
  'CourseDetails'
>;

const CourseDetailsScreen: React.FC = () => {
  const route = useRoute<CourseDetailsRouteProp>();
  const navigation = useNavigation();
  const { course } = route.params;

  // Dynamically set the header title to the course name
  useLayoutEffect(() => {
    navigation.setOptions({
      title: course.title,
      headerRight: () => (
        <Menu>
          <MenuTrigger>
            <MaterialIcons name="menu" size={24} style={styles.hamburgerIcon} />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => console.log('Content selected')}>
              <Text style={styles.menuOption}>Content</Text>
            </MenuOption>
            <MenuOption onSelect={() => console.log('Grades selected')}>
              <Text style={styles.menuOption}>Grades</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      ),
    });
  }, [navigation, course]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.description}>{course.description}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  description: { fontSize: 16, color: '#555' },
  hamburgerIcon: { marginRight: 16, color: '#000' },
  menuOption: { fontSize: 16, padding: 10 },
});

export default CourseDetailsScreen;