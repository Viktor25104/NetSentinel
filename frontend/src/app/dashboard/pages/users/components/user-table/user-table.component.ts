import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-table-container" [class.minimized]="minimized">
      <div class="table-header">
        <h2>Сотрудники</h2>
        <div class="table-actions">
          <div class="filters">
            <select class="cyber-input" [(ngModel)]="statusFilter" (ngModelChange)="onFiltersChange()">
              <option value="">Все статусы</option>
              <option value="active">Активные</option>
              <option value="vacation">В отпуске</option>
              <option value="sick_leave">На больничном</option>
              <option value="day_off">В отгуле</option>
              <option value="inactive">Неактивные</option>
            </select>
            <select class="cyber-input" [(ngModel)]="departmentFilter" (ngModelChange)="onFiltersChange()">
              <option value="">Все отделы</option>
              <option *ngFor="let dept of uniqueDepartments" [value]="dept">
                {{ dept }}
              </option>
            </select>
          </div>
          <div class="search-bar">
            <input type="text" 
                   class="cyber-input" 
                   placeholder="Поиск по имени или email..." 
                   [(ngModel)]="searchQuery"
                   (ngModelChange)="onFiltersChange()">
          </div>
          <button class="cyber-button">
            <i>➕</i> Добавить сотрудника
          </button>
        </div>
      </div>

      <table class="users-table">
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Статус</th>
            <th>Должность</th>
            <th>Отдел</th>
            <th>Последняя активность</th>
            <th>Дата начала работы</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of filteredUsers" 
              (click)="onUserSelect(user)"
              [class.selected]="selectedUserId === user.id">
            <td>
              <div class="user-info">
                <div class="user-avatar">
                  <img [src]="user.avatar" [alt]="user.firstName">
                  <span class="status-dot" [class]="user.status"></span>
                </div>
                <div class="user-details">
                  <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="status-badge" [class]="user.employmentStatus">
                {{ getStatusLabel(user.employmentStatus) }}
              </span>
            </td>
            <td>{{ user.position }}</td>
            <td>{{ user.department }}</td>
            <td>{{ user.lastActive }}</td>
            <td>{{ formatDate(user.joinDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .users-table-container {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .users-table-container.minimized {
      margin-top: 1rem;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .table-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .filters {
      display: flex;
      gap: 1rem;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table th,
    .users-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .users-table th {
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .users-table tr {
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .users-table tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .users-table tr.selected {
      background: rgba(0, 243, 255, 0.1);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      position: relative;
      width: 40px;
      height: 40px;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .status-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid var(--card-bg);
    }

    .status-dot.online {
      background: var(--accent-green);
    }

    .status-dot.offline {
      background: #9e9e9e;
    }

    .status-dot.away {
      background: #ffc107;
    }

    .status-dot.busy {
      background: var(--accent-red);
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .user-name {
      color: #fff;
      font-weight: 500;
    }

    .user-email {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      text-transform: capitalize;
    }

    .status-badge.active {
      background: rgba(0, 255, 157, 0.1);
      color: var(--accent-green);
    }

    .status-badge.vacation {
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }

    .status-badge.sick_leave {
      background: rgba(0, 243, 255, 0.1);
      color: var(--primary-blue);
    }

    .status-badge.day_off {
      background: rgba(158, 158, 158, 0.1);
      color: #9e9e9e;
    }

    .status-badge.inactive {
      background: rgba(255, 77, 77, 0.1);
      color: var(--accent-red);
    }

    @media (max-width: 1200px) {
      .table-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .filters {
        flex-direction: column;
      }
    }
  `]
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Input() minimized = false;
  @Input() selectedUserId: string | null = null;
  @Output() userSelect = new EventEmitter<User>();

  statusFilter = '';
  departmentFilter = '';
  searchQuery = '';

  get uniqueDepartments() {
    return [...new Set(this.users.map(user => user.department))];
  }

  get filteredUsers() {
    return this.users.filter(user => {
      const matchesSearch = 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = !this.statusFilter || user.employmentStatus === this.statusFilter;
      const matchesDepartment = !this.departmentFilter || user.department === this.departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }

  getStatusLabel(status: User['employmentStatus']): string {
    const labels: Record<User['employmentStatus'], string> = {
      active: 'Активен',
      vacation: 'В отпуске',
      sick_leave: 'На больничном',
      day_off: 'В отгуле',
      inactive: 'Неактивен'
    };
    return labels[status];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onUserSelect(user: User) {
    this.userSelect.emit(user);
  }

  onFiltersChange() {
    // Можно добавить дополнительную логику при изменении фильтров
  }
}