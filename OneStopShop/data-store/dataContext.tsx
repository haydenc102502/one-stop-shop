/**
 * Centralized Data Store and State Management for calendarData and users. 
 * This ensures that when any component updates calendarData, all components that use the context
 * are notified and re-render automatically.
 * 
 * 
 */
import React, { createContext, useState, useContext } from 'react';
import { User, CalendarEntry } from './types';
import { UserRole } from './userRole';
import { CalendarEntryCategory } from './calendarEntryCategory';



// Initial User data
const initialUserData: User[] = [
  { userId: 'as1899', name: 'Alice', secondName: 'Smith', phone: '555-1234', email: 'alice@example.com', role: UserRole.STUDENT },
  { userId: 'bj1234', name: 'Bob', secondName: 'Johnson', phone: '555-5678', email: 'bobjohnson@example.com', role: UserRole.FACULTY },
];

// Initial Calendar data
const initialCalendarData: Record<string, CalendarEntry[]> = {
  '2024-10-28': [
    { userId: 'as1899', time: '10:00 AM', description: 'Grades posted', calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT },
  ],
  '2024-10-29': [
    { userId: 'as1899', time: '10:00 AM', description: 'SWEN 444 class canceled', calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT },
    { userId: 'as1899', time: '2:00 PM', description: 'New assignment posted', calendarEntryCategory: CalendarEntryCategory.ASSIGNMENT },
    { userId: 'as1899', time: '7:00 PM', description: 'Grades posted', calendarEntryCategory: CalendarEntryCategory.GRADES },
  ],
};

// Define context types
interface DataContextType {
  users: User[];
  currentUserId: string | null; // Store only the userId
  setCurrentUserId: (user: string) => void;
  calendarData: Record<string, CalendarEntry[]>;
  addCalendarEntry: (date: string, entry: CalendarEntry) => void;
  getEntriesByUserId: (userId: string) => CalendarEntry[];
}

// Context for data store and functions
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(initialUserData);
  const [calendarData, setCalendarData] = useState<Record<string, CalendarEntry[]>>(initialCalendarData);
  const [currentUserId, setCurrentUserId] = useState<string | null>('as1899');// Initialize with null or a default user

  // Add a new entry to the calendar
  const addCalendarEntry = (date: string, entry: CalendarEntry) => {
    setCalendarData((prevData) => ({
      ...prevData,
      [date]: prevData[date] ? [...prevData[date], entry] : [entry],
    }));
  };

  // Get entries by userId
  const getEntriesByUserId = (userId: string): CalendarEntry[] => {
    const entries: CalendarEntry[] = [];
    for (const date in calendarData) {
      const userEntries = calendarData[date].filter(entry => entry.userId === userId);
      entries.push(...userEntries);
    }
    return entries;
  };

  return (
    <DataContext.Provider value={{ users, currentUserId: currentUserId, setCurrentUserId, calendarData, addCalendarEntry, getEntriesByUserId }}>
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
