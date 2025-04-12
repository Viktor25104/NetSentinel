import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin, interval, Subscription } from 'rxjs';
import { Server, CpuInfoDto, RamInfoDto, DiskInfoDto, NetworkInterfaceDto } from '../../interfaces/server.interface';
import { PrettyBytesPipe } from '../../../../../pipes/pretty-bytes/pretty-bytes.pipe';
import { CleanCpuNamePipe } from '../../../../../pipes/cleanCpuName/clean-cpu-name.pipe';
import {FormatBytesPipe} from '../../../../../pipes/formatBytes/format-bytes.pipe';


@Component({
  selector: 'app-server-metrics',
  standalone: true,
  imports: [CommonModule, PrettyBytesPipe, CleanCpuNamePipe, FormatBytesPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
            <span>Процессор: </span>
            <span>{{ cpuInfo?.name | cleanCpuName }}</span>
          </div>
          <div class="detail-item">
            <span>Ядер (физ/лог): </span>
            <span>{{ cpuInfo?.physicalCores }}/{{ cpuInfo?.logicalCores }}</span>
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
            <span>{{ ramInfo?.totalBytes | formatBytes }}</span>
          </div>
          <div class="detail-item">
            <span>Доступно:</span>
            <span>{{ ramInfo?.freeBytes | formatBytes }}</span>
          </div>
        </div>
      </div>

      <div class="cyber-card metric-card">
        <h3>Диск</h3>
        <div class="metric-chart">
          <div class="chart-placeholder">
            <div class="usage-indicator">
              <div
                class="usage-circle"
                [class.warning]="maxDiskUsage > 70"
                [class.critical]="maxDiskUsage > 90"
              >
                <div class="usage-value">{{ maxDiskUsage | number: '1.0-0' }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item" *ngFor="let disk of topDisks">
            <span>{{ disk.name }} ({{ disk.type }})</span>
            <span>{{ disk.total | formatBytes }} • {{ disk.usedPercent | number: '1.0-0' }}%</span>
          </div>
        </div>
      </div>

      <div class="cyber-card metric-card" *ngIf="networkInfo; else noNetwork">
        <h3>Сеть</h3>
        <div class="metric-chart">
          <div class="chart-placeholder">
            <div class="usage-indicator">
              <div class="usage-circle"
                   [class.warning]="networkInfo.networkLoad! > 70"
                   [class.critical]="networkInfo.networkLoad! > 90">
                <div class="usage-value">{{ networkInfo.networkLoad }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="metric-details">
          <div class="detail-item">
            <span>Входящий:</span>
            <span>{{ networkInfo.incomingTraffic | prettyBytes : '/сек' }}</span>
          </div>
          <div class="detail-item">
            <span>Исходящий:</span>
            <span>{{ networkInfo.outgoingTraffic | prettyBytes : '/сек' }}</span>
          </div>
        </div>
      </div>

      <ng-template #noNetwork>
        <div class="cyber-card metric-card">
          <h3>Сеть</h3>
          <p>Нет активного сетевого адаптера</p>
        </div>
      </ng-template>
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
    .detail-item span:first-child {
      margin-right: 0.5rem;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.6);
    }

    .detail-item span:last-child {
      color: #fff;
      font-weight: 500;
      word-break: break-word;
    }
  `]
})
export class ServerMetricsComponent implements OnInit, OnDestroy {

  @Input() server!: Server;

  cpuInfo: CpuInfoDto | null = null;
  ramInfo: RamInfoDto | null = null;
  diskInfo: DiskInfoDto[] = [];
  networkInfo: NetworkInterfaceDto | null = null;

  maxDiskUsage: number = 0;
  topDisks: { name: string, type: string, total: number, usedPercent: number }[] = [];

  private updateSubscription!: Subscription;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateMetrics();

    this.updateSubscription = interval(60 * 60 * 1000).subscribe(() => {
      this.updateMetrics();
    });
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }

  private updateMetrics(): void {
    const base = `http://localhost:8080/api/agent/${this.server.id}`;
    forkJoin({
      cpu: this.http.get<CpuInfoDto>(`${base}/cpu`, { withCredentials: true }),
      ram: this.http.get<RamInfoDto>(`${base}/ram`, { withCredentials: true }),
      disk: this.http.get<DiskInfoDto>(`${base}/disk`, { withCredentials: true }),
      network: this.http.get<NetworkInterfaceDto[]>(`${base}/network`, { withCredentials: true })
    }).subscribe({
      next: ({ cpu, ram, disk, network }) => {
        this.cpuInfo = cpu;
        this.ramInfo = ram;
        this.diskInfo = Array.isArray(disk) ? disk : [disk];
        this.networkInfo = this.selectActiveInterface(network);

        this.maxDiskUsage = Math.max(...this.diskInfo.map(d => d.usedPercent));
        this.topDisks = this.diskInfo
          .sort((a, b) => b.usedPercent - a.usedPercent)
          .slice(0, 3)
          .map(d => ({
            name: d.mount,
            type: d.type,
            total: d.totalBytes,
            usedPercent: d.usedPercent
          }));

        this.cdr.markForCheck();
      },
      error: error => {
        console.error('❌ Ошибка при загрузке метрик:', error);
      }
    });
  }

  private selectActiveInterface(interfaces: NetworkInterfaceDto[]): NetworkInterfaceDto | null {
    const active = interfaces
      .filter(i => i.speed > 0 && (i.bytesRecv > 0 || i.bytesSent > 0))
      .sort((a, b) => (b.bytesRecv + b.bytesSent) - (a.bytesRecv + a.bytesSent))[0];

    if (!active) return null;

    const load = active.speed > 0
      ? ((active.bytesRecv + active.bytesSent) / active.speed) * 100
      : 0;

    return {
      ...active,
      networkLoad: Math.min(100, Math.round(load)),
      incomingTraffic: Math.round(active.bytesRecv / 1024),
      outgoingTraffic: Math.round(active.bytesSent / 1024)
    };
  }

}
