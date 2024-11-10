// dataContext.tsx

/**
 * This file defines the DataContext and DataProvider components, which manage user and calendar data for the application.
 * It provides a React Context for components to access and modify user information and calendar entries throughout the app.
 */

import React, { createContext, useState, useContext } from 'react';
import { User, CalendarEntry } from './types';
import { UserRole } from './userRole';
import { CalendarEntryCategory } from './calendarEntryCategory';

/**
 * Initial user data for the application.
 * This mock data represents the users and is used to initialize the application's state.
 */
const initialUserData: User[] = [
  {
    userId: 'as1899',
    name: 'Alice',
    secondName: 'Smith',
    phone: '555-1234',
    email: 'alice@example.com',
    role: UserRole.STUDENT,
    password: 'password',
  },
  {
    userId: 'bj1234',
    name: 'Bob',
    secondName: 'Johnson',
    phone: '555-5678',
    email: 'bobjohnson@example.com',
    role: UserRole.FACULTY,
    password: 'password',
  },
];

/**
 * Initial calendar entries for the application.
 * This mock data represents calendar events and is used to initialize the application's state.
 */
const initialCalendarData: CalendarEntry[] = [
  {
    userId: 'as1899',
    day: '2024-10-28',
    time: '10:00 AM',
    description: 'Grades posted',
    calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT,
    pushNotified: false,
  },
  {
    userId: 'as1899',
    day: '2024-10-29',
    time: '10:00 AM',
    description: 'SWEN 444 class canceled',
    calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT,
    pushNotified: false,
  },
  {
    userId: 'as1899',
    day: '2024-10-29',
    time: '2:00 PM',
    description: 'New assignment posted',
    calendarEntryCategory: CalendarEntryCategory.ASSIGNMENT,
    pushNotified: false,
  },
  {
    userId: 'as1899',
    day: '2024-10-29',
    time: '7:00 PM',
    description: 'Grades posted',
    calendarEntryCategory: CalendarEntryCategory.GRADES,
    pushNotified: false,
  },
];

/**
 * Defines the structure of the DataContext, including state and functions
 * that are provided to consuming components.
 */
interface DataContextType {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  calendarData: CalendarEntry[];
  addCalendarEntry: (entry: CalendarEntry) => void;
  getEntriesByUserId: (userId: string) => CalendarEntry[];
  addUser: (user: User) => boolean;
  getUsers: () => User[];
  authenticateUser: (email: string, password: string) => boolean;
  userExists: (email: string) => boolean;
}

// Create the DataContext with an undefined initial value.
// This context will be used by components to access and manipulate user and calendar data.
const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * DataProvider Component
 * Wraps the application and provides user and calendar data via context.
 *
 * @param children - The child components that will consume the context.
 */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /**
   * State to hold the list of users.
   * Initialized with initialUserData.
   */
  const [users, setUsers] = useState<User[]>(initialUserData);

  /**
   * State to hold the list of calendar entries.
   * Initialized with initialCalendarData.
   */
  const [calendarData, setCalendarData] = useState<CalendarEntry[]>(initialCalendarData);

  /**
   * State to hold the currently authenticated user.
   * Initialized with the first user in initialUserData or null.
   */
  const [currentUser, setCurrentUser] = useState<User | null>(initialUserData[0]);

  /**
   * Adds a new calendar entry to the calendarData state.
   *
   * @param entry - The CalendarEntry to add.
   */
  const addCalendarEntry = (entry: CalendarEntry) => {
    setCalendarData((prevData) => [...prevData, entry]);
  };

  /**
   * Retrieves all calendar entries for a specific user.
   *
   * @param userId - The user ID to filter entries by.
   * @returns An array of CalendarEntry objects for the user.
   */
  const getEntriesByUserId = (userId: string): CalendarEntry[] => {
    return calendarData.filter((entry) => entry.userId === userId);
  };

  /**
   * Adds a new user to the users state if the email does not already exist.
   *
   * @param user - The User to add.
   * @returns True if the user was added, false if the email already exists.
   */
  const addUser = (user: User): boolean => {
    const userExists = users.some((existingUser) => existingUser.email === user.email);
    if (userExists) {
      return false; // Email already exists
    }

    setUsers((prevUsers) => [...prevUsers, user]);
    return true;
  };

  /**
   * Authenticates a user by email and password.
   * If authentication is successful, sets the currentUser state.
   *
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns True if authentication is successful, false otherwise.
   */
  const authenticateUser = (email: string, password: string): boolean => {
    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  /**
   * Retrieves the list of all users.
   *
   * @returns An array of User objects.
   */
  const getUsers = (): User[] => {
    return users;
  };

  /**
   * Retrieves a user by their userId.
   *
   * @param userId - The user ID to search for.
   * @returns The User object if found, undefined otherwise.
   */
  const getUserById = (userId: string): User | undefined => {
    return users.find((user) => user.userId === userId);
  };

  /**
   * Checks if a user with the given email already exists.
   *
   * @param email - The email to check.
   * @returns True if the user exists, false otherwise.
   */
  const userExists = (email: string): boolean => {
    return users.some((user) => user.email === email);
  };

  // Provide the context values to the child components.
  return (
    <DataContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        calendarData,
        addCalendarEntry,
        getEntriesByUserId,
        addUser,
        getUsers,
        authenticateUser,
        userExists,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

/**
 * Custom hook to use the DataContext.
 *
 * @returns The DataContext value.
 * @throws Error if used outside of a DataProvider.
 */
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within a DataProvider');
  return context;
};
