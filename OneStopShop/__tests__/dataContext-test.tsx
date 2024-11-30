import React, { useEffect } from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DataProvider, useDataContext } from '@/data-store/dataContext';
import { UserRole } from '@/data-store/userRole';
import { CalendarEntryCategory } from '@/data-store/calendarEntryCategory';

// Mock expo-notifications module
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'mock-push-token' }),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
}));

/**
 * TestComponent is a test component that uses the DataContext to display the count of users and calendar entries.
 * 
 * @returns A React fragment containing Text components displaying the user and calendar data counts.
 */
const TestComponent = () => {
  const { users, calendarData } = useDataContext();

  return (
    <>
      <Text testID="user-count">{users.length}</Text>
      <Text testID="calendar-count">{calendarData.length}</Text>
    </>
  );
};

/**
 * AuthTestComponent is a test component that uses the DataContext to authenticate a user.
 * 
 * @param email - The email of the user to authenticate.
 * @param password - The password of the user to authenticate.
 * 
 * @returns A Text component displaying whether the user is authenticated.
 */
const AuthTestComponent = ({ email, password }: { email: string; password: string }) => {
  const { authenticateUser } = useDataContext();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    setIsAuthenticated(authenticateUser(email, password));
  }, [email, password]);

  return <Text testID="auth-result">{isAuthenticated ? 'true' : 'false'}</Text>;
};

/**
 * AddUserTestComponent is a test component that uses the DataContext to add a new user.
 * 
 * @param user - The user object to add.
 * 
 * @returns A Text component displaying whether the user was successfully added.
 */
const AddUserTestComponent = ({ user }: { user: any }) => {
  const { addUser } = useDataContext();
  const [isAdded, setIsAdded] = React.useState(false);

  useEffect(() => {
    setIsAdded(addUser(user));
  }, [user]);

  return <Text testID="add-user-result">{isAdded ? 'true' : 'false'}</Text>;
};

/**
 * AddExistingUserTestComponent is a test component that uses the DataContext to attempt adding an existing user.
 * 
 * @param user - The user object to add.
 * 
 * @returns A Text component displaying whether the user was successfully added.
 */
const AddExistingUserTestComponent = ({ user }: { user: any }) => {
  const { addUser } = useDataContext();
  const [isAdded, setIsAdded] = React.useState(false);

  useEffect(() => {
    setIsAdded(addUser(user));
  }, [user]);

  return <Text testID="add-existing-user-result">{isAdded ? 'true' : 'false'}</Text>;
};

/**
 * AddCalendarEntryTestComponent is a test component that uses the DataContext to add a new calendar entry.
 * 
 * @param entry - The calendar entry object to add.
 * 
 * @returns A Text component displaying the updated count of calendar entries.
 */
const AddCalendarEntryTestComponent = ({ entry }: { entry: any }) => {
  const { addCalendarEntry, calendarData } = useDataContext();

  useEffect(() => {
    addCalendarEntry(entry);
  }, [entry]);

  return <Text testID="calendar-count">{calendarData.length}</Text>;
};

/**
 * GetUsersTestComponent is a test component that uses the DataContext to retrieve all users.
 * 
 * @returns A Text component displaying the count of users.
 */
const GetUsersTestComponent = () => {
  const { getUsers } = useDataContext();
  const users = getUsers();

  return <Text testID="get-users-count">{users.length}</Text>;
};

/**
 * RoleTestComponent is a test component that uses the DataContext to display the role of the current user.
 * 
 * @returns A Text component displaying the role of the current user.
 */
const RoleTestComponent = () => {
  const { currentUser } = useDataContext();

  return <Text testID="user-role">{currentUser?.role}</Text>;
};

/**
 * GetEntriesByUserIdTestComponent is a test component that uses the DataContext to retrieve calendar entries by user ID.
 * 
 * @param userId - The user ID to filter entries by.
 * 
 * @returns A Text component displaying the count of calendar entries for the user.
 */
const GetEntriesByUserIdTestComponent = ({ userId }: { userId: string }) => {
  const { getEntriesByUserId } = useDataContext();
  const entries = getEntriesByUserId(userId);

  return <Text testID="user-entries-count">{entries.length}</Text>;
};

/**
 * GetUserByIdTestComponent is a test component that uses the DataContext to retrieve a user by their user ID.
 * 
 * @param userId - The user ID to search for.
 * 
 * @returns A Text component displaying the user's name if found, or 'not found' otherwise.
 */
const GetUserByIdTestComponent = ({ userId }: { userId: string }) => {
  const { getUserById } = useDataContext();
  const user = getUserById(userId);

  return <Text testID="user-by-id-result">{user ? user.name : 'not found'}</Text>;
};

/**
 * UserExistsTestComponent is a test component that uses the DataContext to check if a user with a given email exists.
 * 
 * @param email - The email to check.
 * 
 * @returns A Text component displaying 'true' if the user exists, 'false' otherwise.
 */
const UserExistsTestComponent = ({ email }: { email: string }) => {
  const { userExists } = useDataContext();
  const exists = userExists(email);

  return <Text testID="user-exists-result">{exists ? 'true' : 'false'}</Text>;
};

/**
 * SendPushNotificationsTestComponent is a test component that uses the DataContext to trigger push notifications.
 * 
 * @returns A Text component displaying the count of calendar entries that have been push notified.
 */
const SendPushNotificationsTestComponent = () => {
  const { sendPushNotifications, calendarData } = useDataContext();

  useEffect(() => {
    sendPushNotifications();
  }, []);

  const notifiedCount = calendarData.filter(entry => entry.pushNotified).length;

  return <Text testID="push-notified-count">{notifiedCount}</Text>;
};

/**
 * DataContext test suite.
 * 
 * This suite contains tests for the DataContext, including:
 * - Providing initial user and calendar data.
 * - Authenticating a user with correct and incorrect credentials.
 * - Adding a new user.
 * - Adding a new calendar entry.
 */
describe('DataContext', () => {
  test('should provide initial user and calendar data', () => {
    const { getByTestId } = render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(getByTestId('user-count').props.children).toBe(2);

    expect(getByTestId('calendar-count').props.children).toBe(6); // Updated count to match initial data
  });

  test('should authenticate a user with correct credentials', () => {
    const { getByTestId } = render(
      <DataProvider>
        <AuthTestComponent email="alice@example.com" password="password" />
      </DataProvider>
    );

    expect(getByTestId('auth-result').props.children).toBe('true');
  });

  test('should not authenticate a user with incorrect credentials', () => {
    const { getByTestId } = render(
      <DataProvider>
        <AuthTestComponent email="alice@example.com" password="wrongpassword" />
      </DataProvider>
    );

    expect(getByTestId('auth-result').props.children).toBe('false');
  });

  test('should add a new user', () => {
    const newUser = {
      userId: 'cj5678',
      name: 'Charlie',
      secondName: 'Jones',
      phone: '555-8765',
      email: 'charlie@example.com',
      role: UserRole.STUDENT,
      password: 'password',
    };

    const { getByTestId } = render(
      <DataProvider>
        <AddUserTestComponent user={newUser} />
      </DataProvider>
    );

    expect(getByTestId('add-user-result').props.children).toBe('true');
  });

  test('should not add a user with an existing email', () => {
    const existingUser = {
      userId: 'as1899',
      name: 'Alice',
      secondName: 'Smith',
      phone: '555-1234',
      email: 'alice@example.com',
      role: UserRole.STUDENT,
      password: 'password',
    };

    const { getByTestId } = render(
      <DataProvider>
        <AddExistingUserTestComponent user={existingUser} />
      </DataProvider>
    );

    expect(getByTestId('add-existing-user-result').props.children).toBe('false');
  });

  test('should add a new calendar entry', () => {
    const newEntry = {
      userId: 'as1899',
      day: '2024-10-30',
      time: '9:00 AM',
      description: 'Team meeting',
      calendarEntryCategory: CalendarEntryCategory.ANNOUNCEMENT,
      pushNotified: false,
    };

    const { getByTestId } = render(
      <DataProvider>
        <AddCalendarEntryTestComponent entry={newEntry} />
      </DataProvider>
    );

    expect(getByTestId('calendar-count').props.children).toBe(7); // Updated count to match initial data
  });

  test('should retrieve all users', () => {
    const { getByTestId } = render(
      <DataProvider>
        <GetUsersTestComponent />
      </DataProvider>
    );

    expect(getByTestId('get-users-count').props.children).toBe(2);
  });

  test('should display the correct role for the current user', () => {
    const { getByTestId } = render(
      <DataProvider>
        <RoleTestComponent />
      </DataProvider>
    );

    expect(getByTestId('user-role').props.children).toBe(UserRole.STUDENT);
  });

  test('should retrieve calendar entries by user ID', () => {
    const { getByTestId } = render(
      <DataProvider>
        <GetEntriesByUserIdTestComponent userId="as1899" />
      </DataProvider>
    );

    expect(getByTestId('user-entries-count').props.children).toBe(3); // Updated count to match initial data
  });

  test('should retrieve a user by their user ID', () => {
    const { getByTestId } = render(
      <DataProvider>
        <GetUserByIdTestComponent userId="as1899" />
      </DataProvider>
    );

    expect(getByTestId('user-by-id-result').props.children).toBe('Alice');
  });

  test('should return undefined for a non-existent user ID', () => {
    const { getByTestId } = render(
      <DataProvider>
        <GetUserByIdTestComponent userId="nonexistent" />
      </DataProvider>
    );

    expect(getByTestId('user-by-id-result').props.children).toBe('not found');
  });

  test('should check if a user with a given email exists', () => {
    const { getByTestId } = render(
      <DataProvider>
        <UserExistsTestComponent email="alice@example.com" />
      </DataProvider>
    );

    expect(getByTestId('user-exists-result').props.children).toBe('true');
  });

  test('should return false for a non-existent email', () => {
    const { getByTestId } = render(
      <DataProvider>
        <UserExistsTestComponent email="nonexistent@example.com" />
      </DataProvider>
    );

    expect(getByTestId('user-exists-result').props.children).toBe('false');
  });

  test('should send push notifications for calendar entries', async () => {
    const { getByTestId, findByTestId } = render(
      <DataProvider>
        <SendPushNotificationsTestComponent />
      </DataProvider>
    );

    // Wait for the useEffect to complete
    await findByTestId('push-notified-count');

    expect(getByTestId('push-notified-count').props.children).toBeGreaterThan(0);
  });
});