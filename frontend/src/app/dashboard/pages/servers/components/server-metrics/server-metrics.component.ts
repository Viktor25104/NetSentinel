import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Server } from '../../interfaces/server.interface';

@Component({
  selector: 'app-server-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metrics-grid">
      <div class="cyber-card metric-card">
        <h3>CPU</h3>
        <div class="metric-chart">
          <div class="chart-placeholder">
            <div class="usage-indicator">
              <div class="usage-circle" [class.warning]="server.cpu > 70" [class.critical]="server.cpu > 90">
                <div class="usage-value">{{ server.cpu }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span>Ядра:</span>
            <span>8</span>
          </div>
          <div class="detail-item">
            <span>Частота:</span>
            <span>3.6 GHz</span>
          </div>
        </div>
      </div>

      <div class="cyber-card metric-card">
        <h3>RAM</h3>
        <div class="metric-chart">
          <div class="chart-placeholder">
            <div class="usage-indicator">
              <div class="usage-circle" [class.warning]="server.ram > 70" [class.critical]="server.ram > 90">
                <div class="usage-value">{{ server.ram }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span>Всего:</span>
            <span>32 GB</span>
          </div>
          <div class="detail-item">
            <span>Доступно:</span>
            <span>{{ 32 * (1 - server.ram / 100) | number:'1.1-1' }} GB</span>
          </div>
        </div>
      </div>

      <div class="cyber-card metric-card">
        <h3>Диск</h3>
        <div class="metric-chart">
          <div class="chart-placeholder">
            <div class="usage-indicator">
              <div class="usage-circle" [class.warning]="server.disk > 70" [class.critical]="server.disk > 90">
                <div class="usage-value">{{ server.disk }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span>Всего:</span>
            <span>1 TB</span>
          </div>
          <div class="detail-item">
            <span>Доступно:</span>
            <span>{{ 1024 * (1 - server.disk / 100) | number:'1.0-0' }} GB</span>
          </div>
        </div>
      </div>

      <div class="cyber-card metric-card">
        <h3>Сеть</h3>
        <div class="metric-chart">
          <div class="chart-placeholder">
            <div class="usage-indicator">
              <div class="usage-circle" [class.warning]="server.network > 70" [class.critical]="server.network > 90">
                <div class="usage-value">{{ server.network }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span>Входящий:</span>
            <span>2.5 MB/s</span>
          </div>
          <div class="detail-item">
            <span>Исходящий:</span>
            <span>1.8 MB/s</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .metric-card {
      padding: 1.5rem;
    }

    .metric-card h3 {
      margin: 0 0 1.5rem 0;
      color: #fff;
      font-size: 1.2rem;
    }

    .metric-chart {
      position: relative;
      padding-bottom: 100%;
      margin-bottom: 1.5rem;
    }

    .chart-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .usage-indicator {
      width: 80%;
      height: 80%;
      position: relative;
    }

    .usage-circle {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 4px solid var(--primary-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s ease;
    }

    .usage-circle.warning {
      border-color: #ffc107;
    }

    .usage-circle.critical {
      border-color: var(--accent-red);
    }

    .usage-circle::before {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .usage-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: #fff;
    }

    .metric-details {
      display: grid;
      gap: 0.5rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    .detail-item span:last-child {
      color: #fff;
      font-weight: 500;
    }
  `]
})
export class ServerMetricsComponent {
  @Input() server!: Server;
}