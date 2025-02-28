import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="user-details" *ngIf="user" @slideInOut>
      <div class="details-header">
        <div class="user-info">
          <button class="back-button" (click)="onClose()">←</button>
          <div class="user-avatar">
            <img [src]="user.avatar" [alt]="user.firstName">
            <span class="status-dot" [class]="user.status"></span>
          </div>
          <div class="user-main-info">
            <h2>{{ user.firstName }} {{ user.lastName }}</h2>
            <p class="user-position">{{ user.position }}</p>
          </div>
        </div>
        <div class="user-actions">
          <button class="cyber-button">
            <i>✉️</i> Написать
          </button>
          <button class="cyber-button">
            <i>📞</i> Позвонить
          </button>
          <button class="cyber-button warning">
            <i>⚠️</i> Заблокировать
          </button>
        </div>
      </div>

      <div class="details-grid">
        <!-- Основная информация -->
        <div class="cyber-card">
          <h3>Основная информация</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Email</span>
              <span class="value">{{ user.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">Отдел</span>
              <span class="value">{{ user.department }}</span>
            </div>
            <div class="info-item">
              <span class="label">Статус</span>
              <span class="value status-badge" [class]="user.employmentStatus">
                {{ getStatusLabel(user.employmentStatus) }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">Дата начала работы</span>
              <span class="value">{{ formatDate(user.joinDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Управление статусом -->
        <div class="cyber-card">
          <h3>Управление статусом</h3>
          <div class="status-controls">
            <button class="cyber-button"
                    [class.active]="user.employmentStatus === 'active'"
                    (click)="updateStatus('active')">
              Активен
            </button>
            <button class="cyber-button"
                    [class.active]="user.employmentStatus === 'vacation'"
                    (click)="updateStatus('vacation')">
              Отпуск
            </button>
            <button class="cyber-button"
                    [class.active]="user.employmentStatus === 'sick_leave'"
                    (click)="updateStatus('sick_leave')">
              Больничный
            </button>
            <button class="cyber-button"
                    [class.active]="user.employmentStatus === 'day_off'"
                    (click)="updateStatus('day_off')">
              Отгул
            </button>
          </div>
        </div>

        <!-- Активность -->
        <div class="cyber-card">
          <h3>Последняя активность</h3>
          <div class="activity-list">
            <div class="activity-item">
              <i>🔑</i>
              <div class="activity-content">
                <span class="activity-text">Вход в систему</span>
                <span class="activity-time">{{ user.lastActive }}</span>
              </div>
            </div>
            <div class="activity-item">
              <i>📊</i>
              <div class="activity-content">
                <span class="activity-text">Просмотр отчетов</span>
                <span class="activity-time">2 часа назад</span>
              </div>
            </div>
            <div class="activity-item">
              <i>💾</i>
              <div class="activity-content">
                <span class="activity-text">Обновление данных</span>
                <span class="activity-time">Вчера, 15:30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-details {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      position: relative;
      z-index: 10;
    }

    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .back-button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary-blue);
    }

    .user-avatar {
      position: relative;
      width: 64px;
      height: 64px;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary-blue);
    }

    .status-dot {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--card-bg);
    }

    .status-dot.online { background: var(--accent-green); }
    .status-dot.offline { background: #9e9e9e; }
    .status-dot.away { background: #ffc107; }
    .status-dot.busy { background: var(--accent-red); }

    .user-main-info h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #fff;
    }

    .user-position {
      margin: 0.25rem 0 0 0;
      color: rgba(255, 255, 255, 0.7);
    }

    .user-actions {
      display: flex;
      gap: 1rem;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
    }

    .value {
      color: #fff;
      font-weight: 500;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
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

    .status-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
    }

    .cyber-button.active {
      background: rgba(0, 243, 255, 0.2);
      color: #fff;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      border-radius: 8px;
      transition: background 0.3s ease;
    }

    .activity-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .activity-item i {
      font-size: 1.25rem;
    }

    .activity-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .activity-text {
      color: #fff;
    }

    .activity-time {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .details-header {
        flex-direction: column;
        gap: 1rem;
      }

      .user-actions {
        width: 100%;
        justify-content: stretch;
      }

      .user-actions button {
        flex: 1;
      }
    }
  `]
})
export class UserDetailsComponent {
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<{ userId: string; status: User['employmentStatus'] }>();

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

  onClose() {
    this.close.emit();
  }

  updateStatus(status: User['employmentStatus']) {
    if (this.user) {
      this.statusChange.emit({ userId: this.user.id, status });
    }
  }
}
