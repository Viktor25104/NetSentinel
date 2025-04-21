import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user.interface';
import { trigger, transition, style, animate } from '@angular/animations';
import {HttpClient} from '@angular/common/http';

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
            <span class="status-dot" [class]="user.employmentStatus"></span>
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
          <button class="cyber-button warning"
                  (click)="confirmBlock('blocked')"
                  *ngIf="user.employmentStatus !== 'blocked'">
            <i>⚠️</i> Заблокировать
          </button>
          <button class="cyber-button success"
                  (click)="confirmBlock('active')"
                  *ngIf="user.employmentStatus === 'blocked'">
            <i>✅</i> Разблокировать
          </button>
        </div>

        <!-- МОДАЛЬНОЕ ОКНО -->
        <div class="modal-overlay" *ngIf="showConfirmation">
          <div class="modal">
            <h3>{{ pendingStatus === 'blocked' ? 'Заблокировать' : 'Разблокировать' }} пользователя?</h3>
            <p>Вы уверены, что хотите {{ pendingStatus === 'blocked' ? 'заблокировать' : 'разблокировать' }} {{ user?.firstName }}?</p>
            <div class="modal-actions">
              <button class="cyber-button danger" (click)="updateStatus(pendingStatus)">Подтвердить</button>
              <button class="cyber-button" (click)="cancelConfirmation()">Отмена</button>
            </div>
          </div>
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
                    [disabled]="user.employmentStatus === 'blocked'"
                    (click)="updateStatus('active')">
              Активен
            </button>
            <button class="cyber-button"
                    [class.active]="user.employmentStatus === 'vacation'"
                    [disabled]="user.employmentStatus === 'blocked'"
                    (click)="updateStatus('vacation')">
              Отпуск
            </button>
            <button class="cyber-button"
                    [class.active]="user.employmentStatus === 'sick_leave'"
                    [disabled]="user.employmentStatus === 'blocked'"
                    (click)="updateStatus('sick_leave')">
              Больничный
            </button>
            <button class="cyber-button"
                    [class.active]="user.employmentStatus === 'day_off'"
                    [disabled]="user.employmentStatus === 'blocked'"
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

    .status-dot.active { background-color: var(--accent-green); }
    .status-dot.vacation { background-color: #ffc107; }
    .status-dot.sick_leave { background-color: var(--primary-blue); }
    .status-dot.day_off { background-color: #9e9e9e; }
    .status-dot.inactive { display: none; }
    .status-dot.blocked { background-color: #f44336; }


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

    .status-badge.inactive {
      background: rgba(100, 149, 237, 0.1);
      color: #6495ED;
    }

    .status-badge.blocked {
      background: rgba(255, 0, 0, 0.1);
      color: #f44336;
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

    .cyber-button:disabled {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.3);
      cursor: not-allowed;
      border: 1px dashed rgba(255, 255, 255, 0.1);
      opacity: 0.6;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal {
      background: var(--card-bg);
      border-radius: 10px;
      padding: 2rem;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 0 10px rgba(0,243,255,0.3);
      text-align: center;
      color: white;
    }

    .modal h3 {
      margin-bottom: 1rem;
    }

    .modal-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 1.5rem;
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
  @Output() statusChange = new EventEmitter<{ userId: number; status: User['employmentStatus'] }>();

  showConfirmation = false;
  pendingStatus: User['employmentStatus'] = 'active';

  constructor(private http: HttpClient) {
  }

  getStatusLabel(status?: User['employmentStatus']): string {
    const labels: Record<NonNullable<User['employmentStatus']>, string> = {
      active: 'Активен',
      vacation: 'В отпуске',
      sick_leave: 'На больничном',
      day_off: 'В отгуле',
      inactive: 'Неактивен',
      blocked: 'Заблокирован'
    };
    return status ? labels[status] : 'Неизвестно';
  }

  confirmBlock(status: User['employmentStatus']) {
    this.pendingStatus = status;
    this.showConfirmation = true;
  }

  cancelConfirmation() {
    this.showConfirmation = false;
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
    if (!this.user || this.user.employmentStatus === status) {
      this.showConfirmation = false;
      return;
    }

    this.http.put(`http://localhost:8080/api/users/${this.user.id}/employment-status`, { status })
      .subscribe({
        next: () => {
          this.user!.employmentStatus = status;
          this.showConfirmation = false;

          this.statusChange.emit({
            userId: this.user!.id,
            status: status
          });
        },
        error: err => {
          console.error('❌ Ошибка обновления статуса:', err);
          alert('Ошибка при обновлении статуса пользователя');
          this.showConfirmation = false;
        }
      });
  }

}
