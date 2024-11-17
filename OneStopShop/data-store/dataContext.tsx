// dataContext.tsx

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
import { sendPushNotification, setupNotificationChannel, requestUserPermission } from '@/services/notificationService';

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
  { id: '1', userId: 'as1899', day: '2024-11-17', time: '10:00 AM', title: '746 Grades Exam Grades Posted', description: '25/25', calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT, pushNotified: false },
  { id: '2', userId: 'as1899', day: '2024-11-17', time: '10:00 AM', title: 'SWEN 444 class canceled', description: 'Class cancelled sorry lmao', calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT, pushNotified: false },
  { id: '3', userId: 'as1899', day: '2024-11-18', time: '2:00 PM', title: '620 New Assignment', description: 'New assignment posted: Applying OO Principles 2', calendarEntryCategory: CalendarEntryCategory.ASSIGNMENT, pushNotified: false },
  { id: '4', userId: 'as1889', day: '2024-11-19', time: '10:00 AM', title: '620 Grades Exam Grades Posted', description: '13/25', calendarEntryCategory: CalendarEntryCategory.GRADES, pushNotified: false },
  { id: '5', userId: 'as1889', day: '2024-11-19', time: '10:00 AM', title: '777 Announcement', description: 'Hello guys', calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT, pushNotified: false },
  { id: '6', userId: 'as1889', day: '2024-11-19', time: '10:00 AM', title: '777 Assignment', description: 'Goodbye guys', calendarEntryCategory: CalendarEntryCategory.ASSIGNMENT, pushNotified: false },


/**
 * Defines the structure of the DataContext, including state and functions
 * that are provided to consuming components.
 */
interface DataContextType {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentUserId: string | null;
  setCurrentUserId: (userId: string) => void;
  calendarData: CalendarEntry[];
  addCalendarEntry: (entry: CalendarEntry) => void;
  getEntriesByUserId: (userId: string) => CalendarEntry[];
  sendPushNotifications: () => void;
  addUser: (user: User) => boolean;
  getUsers: () => User[];
  authenticateUser: (email: string, password: string) => boolean;
  userExists: (email: string) => boolean;
  updateCalendarEntry: (id: string, updatedData: Partial<CalendarEntry>) => void;
  removeCalendarEntry: (id: string) => void;
  completeCalendarEntry: (id: string) => void;
  uncompleteCalendarEntry: (id: string) => void;
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
  const [currentUserId, setCurrentUserId] = useState<string | null>('as1899'); // Initialize with null or a default user

  /**
   * Implements the addCalendarEntry function to add a new calendar entry to the calendarData state.
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
  const getEntriesByUserId = (userId: string) => {
    return calendarData.filter((entry) => entry.userId === userId);
  };
  
  /**
   * Sends push notifications for calendar entries that have not been notified yet.
   * This function is called whenever the calendarData state changes.
   * It filters the calendar entries by the current user and sends a push notification for each entry.
   * The pushNotified flag is set to true after sending the notification.
   */
  const sendPushNotifications = async () => {
    if (!currentUserId) return;

    const userEntries = calendarData.filter((entry) => entry.userId === currentUserId && !entry.pushNotified);
    if (userEntries.length === 0) return;

    const message = userEntries.map((entry) => `${entry.day} ${entry.time}: ${entry.description}`).join('\n');
    userEntries.forEach((entry) => (entry.pushNotified = true));
    setCalendarData([...calendarData]);

    // Trigger push notification (this is a placeholder, replace with actual push notification logic)
    // console.log(`Push Notification for ${currentUserId}: ${message}`)
    await sendPushNotification('Calendar Notification', message);
  };

  /**
   * UseEffect hook to send push notifications whenever the calendarData state changes.
   */
  useEffect(() => {
    requestUserPermission();
    setupNotificationChannel();
    sendPushNotifications();
  }, [calendarData]);

  /**
   * Updates a calendar entry with new data
   * @param id passed in to find the entry to update
   * @param updatedData new data to update the entry with
   */
  const updateCalendarEntry = (id: string, updatedData: Partial<CalendarEntry>) => {
    setCalendarData((prevData) =>
      prevData.map((entry) => (entry.id === id ? { ...entry, ...updatedData } : entry))
    );
    console.log('Updated calendar entry:', id, updatedData);
  };

  /**
   * Removes a calendar entry from the calendarData state.
   * @param id - The ID of the entry
   */
  const removeCalendarEntry = (id: string) => {
    setCalendarData((prevData) => prevData.filter((entry) => entry.id !== id));
  };

  /**
   * Marks a calendar entry as completed.
   * @param id - The ID of the entry
   * @param completedTime - The time the entry was completed
   */
  const completeCalendarEntry = (id: string, completedTime: string) => {
    setCalendarData((prevData) =>
      prevData.map((entry) => (entry.id === id ? { ...entry, completed: true, completedTime } : entry))
    );
  };

  /**
   * Marks a calendar entry as uncompleted.
   * @param id - The ID of the entry
   */
  const uncompleteCalendarEntry = (id: string) => {
    setCalendarData((prevData) =>
      prevData.map((entry) => (entry.id === id ? { ...entry, completed: false } : entry))
    );
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

    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, user];
      // console.log('Updated Users:', updatedUsers);
      return updatedUsers;
    });

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
        currentUserId: currentUserId,
        setCurrentUserId,
        calendarData,
        addCalendarEntry,
        getEntriesByUserId,
        sendPushNotifications,
        currentUser,
        setCurrentUser,
        addUser,
        getUsers,
        authenticateUser,
        userExists,
        updateCalendarEntry,
        removeCalendarEntry,
        completeCalendarEntry,
        uncompleteCalendarEntry

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
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

