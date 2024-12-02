// src/store/types.ts

import { CalendarEntryCategory } from './calendarEntryCategory';
import { UserRole } from './userRole';

export interface User {
  userId: string;
  name: string;
  secondName: string;
  phone: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface CalendarEntry {
  id: string;
  userId: string;
  day: string;
  time: string;
  title: string;
  description: string;
  calendarEntryCategory: CalendarEntryCategory;
  pushNotified: boolean;
  completed?: boolean;
  completedTime?: string;
}

export type RootStackParamList = {
  login: undefined;
  register: undefined;
  calendar: undefined;
};