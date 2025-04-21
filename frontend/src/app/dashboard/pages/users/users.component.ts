import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserStatsComponent } from './components/user-stats/user-stats.component';
import { User, UserStats } from './interfaces/user.interface';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-users',
  imports: [CommonModule, UserTableComponent, UserDetailsComponent, UserStatsComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  selectedUser: User | null = null;
  users: User[] = [];
  userStats: UserStats = this.emptyStats();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  private emptyStats(): UserStats {
    return {
      total: 0,
      active: 0,
      onVacation: 0,
      onSickLeave: 0,
      onDayOff: 0,
      blocked: 0,
      inactive: 0,
      byDepartment: {},
      byPosition: {}
    };
  }

  private calculateUserStats(users: User[]): UserStats {
    const stats: UserStats = this.emptyStats();
    stats.total = users.length;

    for (const user of users) {
      switch (user.employmentStatus) {
        case 'active': stats.active++; break;
        case 'vacation': stats.onVacation++; break;
        case 'sick_leave': stats.onSickLeave++; break;
        case 'day_off': stats.onDayOff++; break;
        case 'blocked': stats.blocked++; break;
        case 'inactive': stats.inactive++; break;
      }

      const dept = user.department || 'Без отдела';
      stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;

      const pos = user.position || 'Без должности';
      stats.byPosition[pos] = (stats.byPosition[pos] || 0) + 1;
    }

    return stats;
  }

  private updateUsers(users: User[]) {
    this.users = users;
    this.userStats = this.calculateUserStats(users);
  }

  private loadUsers() {
    this.http.get<User[]>(`http://localhost:8080/api/users/all`, {
      withCredentials: true
    }).subscribe({
      next: users => this.updateUsers(users),
      error: err => console.error('❌ Ошибка загрузки пользователей:', err)
    });
  }

  updateUserStatus(data: { userId: number; status: User['employmentStatus'] }) {
    const user = this.users.find(u => u.id === data.userId);
    if (user) {
      user.employmentStatus = data.status;
      this.userStats = this.calculateUserStats(this.users);
    }
  }

  refreshUserList() {
    this.loadUsers();
  }

  selectUser(user: User) {
    this.selectedUser = user;
  }

  closeDetails() {
    this.selectedUser = null;
  }
}
