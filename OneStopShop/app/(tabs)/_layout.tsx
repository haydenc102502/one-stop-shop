import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { DataProvider } from '@/data-store/dataContext';

// TabBarIcon component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// HeaderRightProfileButton component
function HeaderRightProfileButton() {
  const colorScheme = useColorScheme();

  return (
    <Link href="/userProfile" asChild>
      <Pressable>
        {({ pressed }) => (
          <FontAwesome
            name="user" 
            size={25}
            color={Colors[colorScheme ?? 'light'].text}
            style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
    </Link>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <DataProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        {/* Agenda Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Agenda',
            tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
            headerRight: () => <HeaderRightProfileButton />,
          }}
        />
        {/* Calendar Tab */}
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
            headerRight: () => <HeaderRightProfileButton />,
          }}
        />
        {/* Add Event Tab */}
        <Tabs.Screen
          name="addEvent"
          options={{
            title: 'Add Event',
            tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
            headerRight: () => <HeaderRightProfileButton />,
          }}
        />
      </Tabs>
    </DataProvider>
  );
}
