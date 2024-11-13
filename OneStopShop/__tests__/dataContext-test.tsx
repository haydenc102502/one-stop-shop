/**
 * TestComponent is a test component that uses the DataContext to display the count of users and calendar entries.
 * 
 * @returns A React fragment containing Text components displaying the user and calendar data counts.
 */

/**
 * AuthTestComponent is a test component that uses the DataContext to authenticate a user.
 * 
 * @param email - The email of the user to authenticate.
 * @param password - The password of the user to authenticate.
 * 
 * @returns A Text component displaying whether the user is authenticated.
 */

/**
 * AddUserTestComponent is a test component that uses the DataContext to add a new user.
 * 
 * @param user - The user object to add.
 * 
 * @returns A Text component displaying whether the user was successfully added.
 */

/**
 * AddCalendarEntryTestComponent is a test component that uses the DataContext to add a new calendar entry.
 * 
 * @param entry - The calendar entry object to add.
 * 
 * @returns A Text component displaying the updated count of calendar entries.
 */

/**
 * DataContext test suite.
 * 
 * This suite contains tests for the DataContext, including:
 * - Providing initial user and calendar data.
 * - Authenticating a user with correct and incorrect credentials.
 * - Adding a new user.
 * - Adding a new calendar entry.
 */
import React, { useEffect } from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DataProvider, useDataContext } from '@/data-store/dataContext';
import { UserRole } from '@/data-store/userRole';
import { CalendarEntryCategory } from '@/data-store/calendarEntryCategory';

const TestComponent = () => {
  const { users, calendarData } = useDataContext();

  return (
    <>
      <Text testID="user-count">{users.length}</Text>
      <Text testID="calendar-count">{calendarData.length}</Text>
    </>
  );
};

const AuthTestComponent = ({ email, password }: { email: string; password: string }) => {
  const { authenticateUser } = useDataContext();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    setIsAuthenticated(authenticateUser(email, password));
  }, [email, password]);

  return <Text testID="auth-result">{isAuthenticated ? 'true' : 'false'}</Text>;
};

const AddUserTestComponent = ({ user }: { user: any }) => {
  const { addUser } = useDataContext();
  const [isAdded, setIsAdded] = React.useState(false);

  useEffect(() => {
    setIsAdded(addUser(user));
  }, [user]);

  return <Text testID="add-user-result">{isAdded ? 'true' : 'false'}</Text>;
};

const AddCalendarEntryTestComponent = ({ entry }: { entry: any }) => {
  const { addCalendarEntry, calendarData } = useDataContext();

  useEffect(() => {
    addCalendarEntry(entry);
  }, [entry]);

  return <Text testID="calendar-count">{calendarData.length}</Text>;
};

describe('DataContext', () => {
  test('should provide initial user and calendar data', () => {
    const { getByTestId } = render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(getByTestId('user-count').props.children).toBe(2);
    expect(getByTestId('calendar-count').props.children).toBe(4);
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

    expect(getByTestId('calendar-count').props.children).toBe(5);
  });
});
