export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  role?: string;
  avatar: string;
  phone?: string;
  location?: string;
  timezone?: string;
  bio?: string;
  joinDate: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  employmentStatus?: 'active' | 'vacation' | 'sick_leave' | 'day_off' | 'inactive' | 'blocked';
  lastActive?: string;
  notifications: {
    email: boolean;
    push: boolean;
    telegram: boolean;
  };
}

export interface UserStats {
  total: number;
  active: number;
  onVacation: number;
  onSickLeave: number;
  onDayOff: number;
  blocked: number;
  inactive: number;
  byDepartment: Record<string, number>;
  byPosition: Record<string, number>;
}
