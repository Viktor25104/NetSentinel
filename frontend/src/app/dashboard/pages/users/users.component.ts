import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserStatsComponent } from './components/user-stats/user-stats.component';
import { User, UserStats } from './interfaces/user.interface';

@Component({
  selector: 'app-users',
  imports: [CommonModule, UserTableComponent, UserDetailsComponent, UserStatsComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  selectedUser: User | null = null;

  users: User[] = [
    {
      id: '1',
      firstName: 'Александр',
      lastName: 'Иванов',
      email: 'a.ivanov@company.com',
      position: 'DevOps Engineer',
      department: 'IT',
      status: 'online',
      employmentStatus: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      lastActive: 'Сейчас',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      firstName: 'Елена',
      lastName: 'Петрова',
      email: 'e.petrova@company.com',
      position: 'Frontend Developer',
      department: 'Development',
      status: 'busy',
      employmentStatus: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      lastActive: '5 минут назад',
      joinDate: '2023-02-01'
    },
    {
      id: '3',
      firstName: 'Михаил',
      lastName: 'Сидоров',
      email: 'm.sidorov@company.com',
      position: 'System Administrator',
      department: 'IT',
      status: 'away',
      employmentStatus: 'vacation',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      lastActive: '2 часа назад',
      joinDate: '2022-11-20'
    },
    {
      id: '4',
      firstName: 'Анна',
      lastName: 'Козлова',
      email: 'a.kozlova@company.com',
      position: 'Backend Developer',
      department: 'Development',
      status: 'offline',
      employmentStatus: 'sick_leave',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      lastActive: '1 день назад',
      joinDate: '2023-03-10'
    },
    {
      id: '5',
      firstName: 'Дмитрий',
      lastName: 'Волков',
      email: 'd.volkov@company.com',
      position: 'Security Engineer',
      department: 'Security',
      status: 'online',
      employmentStatus: 'active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
      lastActive: 'Сейчас',
      joinDate: '2023-04-05'
    }
  ];

  userStats: UserStats = {
    total: 5,
    active: 3,
    onVacation: 1,
    onSickLeave: 1,
    onDayOff: 0,
    byDepartment: {
      'IT': 2,
      'Development': 2,
      'Security': 1
    },
    byPosition: {
      'DevOps Engineer': 1,
      'Frontend Developer': 1,
      'System Administrator': 1,
      'Backend Developer': 1,
      'Security Engineer': 1
    }
  };

  selectUser(user: User) {
    this.selectedUser = user;
  }

  closeDetails() {
    this.selectedUser = null;
  }

  updateUserStatus(data: { userId: string; status: User['employmentStatus'] }) {
    const user = this.users.find(u => u.id === data.userId);
    if (user) {
      user.employmentStatus = data.status;
      // Здесь будет обновление статистики
    }
  }
}
