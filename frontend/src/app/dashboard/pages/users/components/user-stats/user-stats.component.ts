import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStats } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <div class="cyber-card stats-overview">
        <h2>Сводка по сотрудникам</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">Всего сотрудников</div>
          </div>
          <div class="stat-item">
            <div class="stat-value success">{{ stats.active }}</div>
            <div class="stat-label">Активных</div>
          </div>
          <div class="stat-item">
            <div class="stat-value warning">{{ stats.onVacation }}</div>
            <div class="stat-label">В отпуске</div>
          </div>
          <div class="stat-item">
            <div class="stat-value info">{{ stats.onSickLeave }}</div>
            <div class="stat-label">На больничном</div>
          </div>
          <div class="stat-item">
            <div class="stat-value neutral">{{ stats.onDayOff }}</div>
            <div class="stat-label">В отгуле</div>
          </div>
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

    .stats-overview {
      padding: 2rem;
    }

    .stats-overview h2 {
      margin: 0 0 2rem 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .stat-value.success { color: var(--accent-green); }
    .stat-value.warning { color: #ffc107; }
    .stat-value.info { color: var(--primary-blue); }
    .stat-value.neutral { color: #9e9e9e; }

    .stat-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    .detailed-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .detailed-stats .cyber-card {
      padding: 1.5rem;
    }

    .detailed-stats h3 {
      margin: 0 0 1.5rem 0;
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

    @media (max-width: 768px) {
      .detailed-stats {
        grid-template-columns: 1fr;
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