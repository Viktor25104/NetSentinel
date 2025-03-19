export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  employmentStatus: 'active' | 'vacation' | 'sick_leave' | 'day_off' | 'inactive';
  avatar: string;
  lastActive: string;
  joinDate: string;
}

export interface UserStats {
  total: number;
  active: number;
  onVacation: number;
  onSickLeave: number;
  onDayOff: number;
  byDepartment: {
    [key: string]: number;
  };
  byPosition: {
    [key: string]: number;
  };
}