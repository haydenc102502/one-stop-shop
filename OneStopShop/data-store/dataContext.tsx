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
  { userId: 'as1899', name: 'Alice', secondName: 'Smith', phone: '555-1234', email: 'alice@example.com', role: UserRole.STUDENT, password: 'password' },
  { userId: 'bj1234', name: 'Bob', secondName: 'Johnson', phone: '555-5678', email: 'bobjohnson@example.com', role: UserRole.FACULTY, password: 'password' },
];

// Initial Calendar data
// Initial Calendar data as an array of CalendarEntry objects
const initialCalendarData: CalendarEntry[] = [
  { userId: 'as1899', day: '2024-10-28', time: '10:00 AM', description: 'Grades posted', calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT, pushNotified: false },
  { userId: 'as1899', day: '2024-10-29', time: '10:00 AM', description: 'SWEN 444 class canceled', calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT, pushNotified: false },
  { userId: 'as1899', day: '2024-10-29', time: '2:00 PM', description: 'New assignment posted', calendarEntryCategory: CalendarEntryCategory.ASSIGNMENT, pushNotified: false },
  { userId: 'as1899', day: '2024-10-29', time: '7:00 PM', description: 'Grades posted', calendarEntryCategory: CalendarEntryCategory.GRADES, pushNotified: false },
];


// Define context types
interface DataContextType {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  calendarData: CalendarEntry[];
  addCalendarEntry: (entry: CalendarEntry) => void;
  getEntriesByUserId: (userId: string) => CalendarEntry[];
  addUser: (user: User) => void;
  getUsers: () => User[];
  authenticateUser: (email: string, password: string) => boolean;
  userExists: (email: string) => boolean;
}


// Context for data store and functions
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUserData);
  const [calendarData, setCalendarData] = useState<CalendarEntry[]>(initialCalendarData);
  const [currentUser, setCurrentUser] = useState<User | null>(initialUserData[0]);

  // Add a new entry to the calendar
  const addCalendarEntry = (entry: CalendarEntry) => {
    setCalendarData((prevData) => [...prevData, entry]);
  };

  // Get entries by userId
  const getEntriesByUserId = (userId: string): CalendarEntry[] => {
    return calendarData.filter(entry => entry.userId === userId);
  };

  // Add a new user
  const addUser = (user: User) => {
    setUsers((prevUsers) => {
      // Check if the user already exists
      const userExists = prevUsers.some(existingUser => existingUser.email === user.email);
      if (userExists) {
        throw new Error('User already exists');
      }
      return [...prevUsers, user];
    });
  };

  // Authenticate a user by email and password
  const authenticateUser = (email: string, password: string) => {
    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  // Get the current list of users
  const getUsers = (): User[] => {
    return users;
  };

  // Get user by userId
  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.userId === userId);
  };

  // Check if a user already exists by email
  const userExists = (email: string): boolean => {
    return users.some(user => user.email === email);
  };

  return (
    <DataContext.Provider value={{ users, currentUser, setCurrentUser, calendarData, addCalendarEntry, getEntriesByUserId, addUser, getUsers, authenticateUser, userExists }}>
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
