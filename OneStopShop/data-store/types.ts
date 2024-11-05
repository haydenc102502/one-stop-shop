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
}

export interface CalendarEntry {
  userId: string;
  time: string;
  description: string;
  calendarEntryCategory: CalendarEntryCategory;
  day: string;
  pushNotified: boolean;
}

export type RootStackParamList = {
  login: undefined;
  register: undefined;
};