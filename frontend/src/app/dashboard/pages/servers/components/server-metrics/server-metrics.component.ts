import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Server } from '../../interfaces/server.interface';
import {HttpClient} from '@angular/common/http';
import {forkJoin, interval, Subscription} from 'rxjs';

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
              <div class="usage-circle" [class.warning]="server.cpuUsage > 70" [class.critical]="server.cpuUsage > 90">
                <div class="usage-value">{{ server.cpuUsage }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span>Ядра:</span>
            <span>{{ coreCount }}</span>
          </div>
          <div class="detail-item">
            <span>Частота:</span>
            <span>{{ frequency }}</span>
          </div>
        </div>
      </div>

      <div class="cyber-card metric-card">
        <h3>RAM</h3>
        <div class="metric-chart">
          <div class="chart-placeholder">
            <div class="usage-indicator">
              <div class="usage-circle" [class.warning]="server.memoryUsage > 70"
                   [class.critical]="server.memoryUsage > 90">
                <div class="usage-value">{{ server.memoryUsage }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span>Всего:</span>
            <span>{{ ramInfo?.total }}</span>
          </div>
          <div class="detail-item">
            <span>Доступно:</span>
            <span>{{ ramInfo?.available }} GB</span>
          </div>
        </div>
      </div>

      <div class="cyber-card metric-card">
        <h3>Диск</h3>
        <div class="metric-chart">
          <div class="chart-placeholder">
            <div class="usage-indicator">
              <div class="usage-circle" [class.warning]="server.diskUsage > 70"
                   [class.critical]="server.diskUsage > 90">
                <div class="usage-value">{{ server.diskUsage }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span>Всего:</span>
            <span>{{ diskInfo?.total }}</span>
          </div>
          <div class="detail-item">
            <span>Доступно:</span>
            <span>{{ diskInfo?.available }}</span>
          </div>
        </div>
      </div>

      <div class="cyber-card metric-card">
        <h3>Сеть</h3>
        <div class="metric-chart">
          <div class="chart-placeholder">
            <div class="usage-indicator">
              <div class="usage-circle" [class.warning]="networkInfo!.networkLoad > 70"
                   [class.critical]="networkInfo!.networkLoad > 90">
                <div class="usage-value">{{ networkInfo!.networkLoad }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span>Входящий:</span>
            <span>{{ networkInfo?.incomingTraffic }} КБ/с</span>
          </div>
          <div class="detail-item">
            <span>Исходящий:</span>
            <span>{{ networkInfo?.outgoingTraffic }} КБ/с</span>
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
export class ServerMetricsComponent implements OnInit, OnDestroy {
  @Input() server!: Server;

  coreCount!: number;
  frequency!: string;
  ramInfo: { total: string, usedPercentage: string, available: string, used: string } | null = null;
  diskInfo: { total: string, available: string, used: string, usedPercentage: string } | null = null;
  networkInfo: { networkLoad: number, incomingTraffic: string, outgoingTraffic: string } | null = null;

  private updateSubscription!: Subscription;

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient) {}

  ngOnInit(): void {
    // Обновление раз в час (3600000 мс)
    this.updateSubscription = interval(3600000).subscribe(() => {
      this.updateMetrics();
    });
    // Первоначальное обновление
    this.updateMetrics();
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }

  private updateMetrics(): void {
    const cpuUrl = `http://localhost:8080/api/agent/${this.server.id}/cpu`;
    const ramUrl = `http://localhost:8080/api/agent/${this.server.id}/ram`;
    const diskUrl = `http://localhost:8080/api/agent/${this.server.id}/disk`;
    const networkUrl = `http://localhost:8080/api/agent/${this.server.id}/network`;

    forkJoin({
      cpu: this.http.get(cpuUrl, { withCredentials: true, responseType: 'text' }),
      ram: this.http.get(ramUrl, { withCredentials: true, responseType: 'text' }),
      disk: this.http.get(diskUrl, { withCredentials: true, responseType: 'text' }),
      network: this.http.get(networkUrl, { withCredentials: true, responseType: 'text' })
    }).subscribe({
      next: ({ cpu, ram, disk, network }) => {
        const cpuData = this.parseCpuInfo(cpu);
        this.coreCount = Number(cpuData.coreCount);
        this.frequency = cpuData.frequency;

        this.ramInfo = this.parseRamInfo(ram);
        this.diskInfo = this.parseDiskInfo(disk);
        this.networkInfo = this.parseNetworkInfo(network);

        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Error updating metrics:', error);
      }
    });
  }

  /**
   * Парсит строку вида:
   * "{coreCount=28, frequency=3.418 GHz, load=4.95%}"
   * и возвращает объект с полями coreCount и frequency.
   */
  private parseCpuInfo(response: string): { coreCount: string, frequency: string } {
    response = response.trim();
    if (response.startsWith('{') && response.endsWith('}')) {
      response = response.substring(1, response.length - 1);
    }
    const result: any = {};
    const pairs = response.split(',');
    pairs.forEach(pair => {
      const parts = pair.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        result[key] = value;
      }
    });
    return {
      coreCount: result['coreCount'] || '0',
      frequency: result['frequency'] || ''
    };
  }

  /**
   * Парсит строку вида:
   * "{total=31,77 ГБ, usedPercentage=51,29%, available=15,47 ГБ, used=16,29 ГБ}"
   * и возвращает объект с соответствующими полями.
   */
  private parseRamInfo(response: string): { total: string, usedPercentage: string, available: string, used: string } {
    response = response.trim();
    if (response.startsWith('{') && response.endsWith('}')) {
      response = response.substring(1, response.length - 1);
    }
    const result: any = {};
    const pairs = response.split(',');
    pairs.forEach(pair => {
      const parts = pair.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        result[key] = value;
      }
    });
    return {
      total: result['total'] || '',
      usedPercentage: result['usedPercentage'] || '',
      available: result['available'] || '',
      used: result['used'] || ''
    };
  }

  /**
   * Парсит строку, содержащую информацию о дисках (могут быть несколько записей),
   * агрегирует данные по всем дискам и возвращает объект:
   * { total: "X GB", available: "Y GB", used: "Z GB", usedPercentage: "W%" }
   */
  private parseDiskInfo(response: string): { total: string, available: string, used: string, usedPercentage: string } {
    response = response.trim();
    if (response.startsWith('[') && response.endsWith(']')) {
      response = response.substring(1, response.length - 1);
    }

    // Разбиваем на записи дисков, предполагаем разделение "},"
    const entries = response.split('},').map(entry => {
      entry = entry.trim();
      if (!entry.endsWith('}')) {
        entry += '}';
      }
      return entry;
    });

    let totalSum = 0;
    let availableSum = 0;

    entries.forEach(entry => {
      entry = entry.trim();
      if (entry.startsWith('{') && entry.endsWith('}')) {
        entry = entry.substring(1, entry.length - 1);
      }
      const pairs = entry.split(',');
      const diskData: { [key: string]: string } = {};
      pairs.forEach(pair => {
        const parts = pair.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join('=').trim();
          diskData[key] = value;
        }
      });

      if (diskData['total']) {
        let totalStr = diskData['total'].replace('ГБ', '').replace('GB', '').trim().replace(',', '.');
        const totalVal = parseFloat(totalStr);
        if (!isNaN(totalVal)) {
          totalSum += totalVal;
        }
      }

      if (diskData['available']) {
        let availableStr = diskData['available'].replace('ГБ', '').replace('GB', '').trim().replace(',', '.');
        const availableVal = parseFloat(availableStr);
        if (!isNaN(availableVal)) {
          availableSum += availableVal;
        }
      }
    });

    const usedSum = totalSum - availableSum;
    const usedPercentage = totalSum > 0 ? (usedSum / totalSum) * 100 : 0;

    return {
      total: totalSum.toFixed(1) + " GB",
      available: availableSum.toFixed(1) + " GB",
      used: usedSum.toFixed(1) + " GB",
      usedPercentage: usedPercentage.toFixed(1) + "%"
    };
  }

  /**
   * Парсит строку вида:
   * "{networkLoad=0%, downloadSpeed=26,4 КБ/с, ping=0,0 мс, peakSpeed=1,5 Мбит/с, uploadSpeed=22,8 КБ/с, maxSpeed=100,0 Мбит/с, outgoingTraffic=22,8 КБ/с, incomingTraffic=26,4 КБ/с}"
   * и возвращает объект с полями incomingTraffic и outgoingTraffic.
   */
  private parseNetworkInfo(response: string): { networkLoad: number, incomingTraffic: string, outgoingTraffic: string } {
    response = response.trim();
    if (response.startsWith('{') && response.endsWith('}')) {
      response = response.substring(1, response.length - 1);
    }
    const result: any = {};
    const pairs = response.split(',');
    pairs.forEach(pair => {
      const parts = pair.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        result[key] = value;
      }
    });

    // Преобразуем networkLoad в число, удалив символ "%"
    const networkLoadStr = result['networkLoad'] || '0%';
    const networkLoad = parseInt(networkLoadStr.replace('%', '').trim(), 10);

    return {
      networkLoad: isNaN(networkLoad) ? 0 : networkLoad,
      outgoingTraffic: result['outgoingTraffic'] || '',
      incomingTraffic: result['incomingTraffic'] || ''
    };
  }

  refresh() {
    this.cdr.detectChanges();
  }
}
