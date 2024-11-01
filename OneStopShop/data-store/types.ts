// src/store/types.ts

import { UserRole } from './userRole';
import { CalendarEntryCategory }  from './calendarEntryCategory';


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
