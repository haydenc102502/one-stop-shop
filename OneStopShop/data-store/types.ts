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
  id: string;
  userId: string;
  day: string;
  time: string;
  title: string;
  description: string;
  calendarEntryCategory: CalendarEntryCategory;
  pushNotified: boolean;
}
