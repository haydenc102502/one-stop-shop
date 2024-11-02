/**
 * Centralized Data Store and State Management for calendarData and users. 
 * This ensures that when any component updates calendarData, all components that use the context
 * are notified and re-render automatically.
 * 
 * 
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, CalendarEntry } from './types';
import { UserRole } from './userRole';
import { CalendarEntryCategory } from './calendarEntryCategory';
import {sendPushNotification, setupNotificationChannel, requestUserPermission } from '@/services/notificationService';



// Initial User data
const initialUserData: User[] = [
  { userId: 'as1899', name: 'Alice', secondName: 'Smith', phone: '555-1234', email: 'alice@example.com', role: UserRole.STUDENT },
  { userId: 'bj1234', name: 'Bob', secondName: 'Johnson', phone: '555-5678', email: 'bobjohnson@example.com', role: UserRole.FACULTY },
];

// Initial Calendar data
// Initial Calendar data as an array of CalendarEntry objects
const initialCalendarData: CalendarEntry[] = [
  { userId: 'as1899', day: '2024-10-28', time: '10:00 AM', description: 'Grades posted', calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT, pushNotified: false },
  { userId: 'as1899', day: '2024-10-29', time: '10:00 AM', description: 'SWEN 444 class canceled', calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT, pushNotified: false },
  { userId: 'as1899', day: '2024-10-29', time: '2:00 PM', description: 'New assignment posted', calendarEntryCategory: CalendarEntryCategory.ASSIGNMENT, pushNotified: false },
  { userId: 'as1899', day: '2024-11-2', time: '2:09 PM', description: 'Grades posted', calendarEntryCategory: CalendarEntryCategory.GRADES, pushNotified: false },
  { userId: 'as1899', day: '2024-11-2', time: '2:25 PM', description: 'Grades posted', calendarEntryCategory: CalendarEntryCategory.GRADES, pushNotified: false },
  { userId: 'as1899', day: '2024-10-29', time: '7:00 PM', description: 'Grades posted', calendarEntryCategory: CalendarEntryCategory.GRADES, pushNotified: false },

];


// Define context types
interface DataContextType {
  users: User[];
  currentUserId: string | null;
  setCurrentUserId: (user: string) => void;
  calendarData: CalendarEntry[];  // Change from Record<string, CalendarEntry[]>
  addCalendarEntry: (entry: CalendarEntry) => void;
  getEntriesByUserId: (userId: string) => CalendarEntry[];
  sendPushNotifications: () => void;
}


// Context for data store and functions
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider to wrap the app and provide data to all components
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(initialUserData);
  const [calendarData, setCalendarData] = useState<CalendarEntry[]>(initialCalendarData);
  const [currentUserId, setCurrentUserId] = useState<string | null>('as1899');// Initialize with null or a default user

  // Add a new entry to the calendar
  const addCalendarEntry = (entry: CalendarEntry) => {
    setCalendarData((prevData) => [...prevData, entry]);
  };

  // Get entries by userId
  const getEntriesByUserId = (userId: string): CalendarEntry[] => {
    return calendarData.filter(entry => entry.userId === userId);
  };
  
  const sendPushNotifications = async () => {
    if (!currentUserId) return;

    const userEntries = calendarData.filter((entry) => entry.userId === currentUserId && !entry.pushNotified);
    if (userEntries.length === 0) return;

    const message = userEntries.map((entry) => `${entry.time}: ${entry.description}`).join('\n');
    userEntries.forEach((entry) => (entry.pushNotified = true));
    setCalendarData([...calendarData]);

    // Trigger push notification (this is a placeholder, replace with actual push notification logic)
    console.log(`Push Notification for ${currentUserId}: ${message}`)
    await sendPushNotification(message);
  };

  
  useEffect(() => {
    requestUserPermission();
    setupNotificationChannel();
    sendPushNotifications();
  }, [calendarData]);

  return (
    <DataContext.Provider value={{ users, currentUserId: currentUserId, setCurrentUserId, calendarData, addCalendarEntry, getEntriesByUserId, sendPushNotifications }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook to use context data
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
  return context;
};
