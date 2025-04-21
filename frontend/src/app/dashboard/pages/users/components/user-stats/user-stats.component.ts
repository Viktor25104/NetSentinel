import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {User, UserStats} from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <div class="cyber-card stats-overview">
        <div class="stat-header">
          <h2>Сотрудники</h2>
        </div>

        <div class="stat-counters">
          <div class="stat-pill total">👥 {{ stats.total }} Всего</div>
          <div class="stat-pill success">🟢 {{ stats.active }} Активных</div>
          <div class="stat-pill warning">🌴 {{ stats.onVacation }} Отпуск</div>
          <div class="stat-pill info">🤒 {{ stats.onSickLeave }} Больничный</div>
          <div class="stat-pill neutral">☕ {{ stats.onDayOff }} Отгул</div>
          <div class="stat-pill danger">⛔ {{ stats.blocked }} Заблок.</div>
          <div class="stat-pill muted">💤 {{ stats.inactive }} Неактивных</div>
        </div>
      </div>

      <div class="detailed-stats">
        <div class="cyber-card">
          <h3>По отделам</h3>
          <div class="stats-list">
            <div class="stat-row" *ngFor="let dept of departmentStats">
              <span class="stat-name">{{ dept.name }}</span>
              <div class="stat-bar-container">
                <div class="stat-bar" [style.width.%]="(dept.count / stats.total) * 100"></div>
                <span class="stat-count">{{ dept.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="cyber-card">
          <h3>По должностям</h3>
          <div class="stats-list">
            <div class="stat-row" *ngFor="let pos of positionStats">
              <span class="stat-name">{{ pos.name }}</span>
              <div class="stat-bar-container">
                <div class="stat-bar" [style.width.%]="(pos.count / stats.total) * 100"></div>
                <span class="stat-count">{{ pos.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      display: grid;
      gap: 2rem;
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .total-label {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .stats-overview {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    .stat-counters {
      display: grid;
      gap: 1rem;
      width: 100%;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      justify-content: center;
      align-items: stretch;
    }

    .stat-pill {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1rem;
      font-weight: 500;
      font-size: 0.95rem;
      text-align: center;
      transition: background 0.3s ease;
      animation: fadeInUp 0.3s ease;
      white-space: nowrap;
    }

    .stat-pill.total {
      background: rgba(255, 255, 255, 0.08);
      color: var(--primary-blue);
      font-weight: 600;
      font-size: 1rem;
      border: 1px solid var(--primary-blue);
    }

    .stat-pill.success { color: var(--accent-green); }
    .stat-pill.warning { color: #ffc107; }
    .stat-pill.info    { color: var(--primary-blue); }
    .stat-pill.neutral { color: #9e9e9e; }
    .stat-pill.danger  { color: var(--accent-red); }
    .stat-pill.muted   { color: #aaa; }

    .detailed-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .detailed-stats .cyber-card {
      padding: 1.5rem;
    }

    .stats-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stat-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-name {
      min-width: 150px;
      color: rgba(255, 255, 255, 0.9);
    }

    .stat-bar-container {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-bar {
      height: 8px;
      background: var(--primary-blue);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .stat-count {
      min-width: 30px;
      text-align: right;
      color: rgba(255, 255, 255, 0.7);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .detailed-stats {
        grid-template-columns: 1fr;
      }

      .stat-pill {
        width: 100%;
        justify-content: space-between;
        display: flex;
      }
    }

  `]
})
export class UserStatsComponent {
  @Input() stats!: UserStats;

  get departmentStats() {
    return Object.entries(this.stats.byDepartment).map(([name, count]) => ({
      name,
      count
    }));
  }

  get positionStats() {
    return Object.entries(this.stats.byPosition).map(([name, count]) => ({
      name,
      count
    }));
  }
}
