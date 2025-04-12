import {Component, Input, Output, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Server } from '../../interfaces/server.interface';
import { RelativeTimePipe } from '../../../../../pipes/relative-time/relative-time.pipe';
import {HumanStatusPipe} from '../../../../../pipes/humanStatus/human-status.pipe';

@Component({
  selector: 'app-server-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RelativeTimePipe, HumanStatusPipe],
  template: `
    <div class="servers-table-container" [class.minimized]="minimized">
      <div class="table-header">
        <h2>Серверы</h2>
        <div class="table-actions">
          <div class="filters">
            <select class="cyber-input" [(ngModel)]="statusFilter" (ngModelChange)="onFiltersChange()">
              <option value="">Все статусы</option>
              <option value="online">Онлайн</option>
              <option value="offline">Офлайн</option>
              <option value="maintenance">Обслуживание</option>
            </select>
            <select class="cyber-input" [(ngModel)]="locationFilter" (ngModelChange)="onFiltersChange()">
              <option value="">Все локации</option>
              <option *ngFor="let location of uniqueLocations" [value]="location">
                {{ location }}
              </option>
            </select>
          </div>
          <div class="search-bar">
            <input type="text"
                   class="cyber-input"
                   placeholder="Поиск по имени или IP..."
                   [(ngModel)]="searchQuery"
                   (ngModelChange)="onFiltersChange()">
          </div>
          <button class="cyber-button">
            <i>➕</i> Добавить сервер
          </button>
        </div>
      </div>

      <table class="servers-table">
        <thead>
        <tr>
          <th>Статус</th>
          <th>Имя</th>
          <th>IP</th>
          <th>Тип</th>
          <th>Локация</th>
          <th (click)="toggleSort('cpuUsage')">Загрузка CPU</th>
          <th (click)="toggleSort('memoryUsage')">RAM</th>
          <th (click)="toggleSort('diskUsage')">Диск</th>
          <th>Аптайм</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let server of displayedServers; trackBy: trackByServerId"
            (click)="onServerSelect(server)"
            [class.selected]="selectedServerId === server.id">
          <td>
              <span class="status-indicator" [class]="server.status">
                {{ server.status | humanStatus }}
              </span>
          </td>
          <td>{{ server.name }}</td>
          <td>{{ server.ip }}</td>
          <td>{{ server.type }}</td>
          <td>{{ server.location }}</td>
          <td>
            <div class="usage-bar">
              <div class="usage-fill" [style.width.%]="server.cpuUsage"
                   [class.warning]="server.cpuUsage > 70"
                   [class.critical]="server.cpuUsage > 90">
              </div>
              <span>{{ server.cpuUsage }}%</span>
            </div>
          </td>
          <td>
            <div class="usage-bar">
              <div class="usage-fill" [style.width.%]="server.memoryUsage"
                   [class.warning]="server.memoryUsage > 70"
                   [class.critical]="server.memoryUsage > 90">
              </div>
              <span>{{ server.memoryUsage }}%</span>
            </div>
          </td>
          <td>
            <div class="usage-bar">
              <div class="usage-fill" [style.width.%]="server.diskUsage"
                   [class.warning]="server.diskUsage > 70"
                   [class.critical]="server.diskUsage > 90">
              </div>
              <span>{{ server.diskUsage }}%</span>
            </div>
          </td>
          <td>{{ server.lastPing | relativeTime }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .servers-table-container {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }
    .servers-table-container.minimized {
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
    .servers-table {
      width: 100%;
      border-collapse: collapse;
    }
    .servers-table th,
    .servers-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .servers-table th {
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      font-size: 0.9rem;
    }
    .servers-table tr {
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .servers-table tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    .servers-table tr.selected {
      background: rgba(0, 243, 255, 0.1);
    }
    .status-indicator {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      text-transform: capitalize;
    }
    .status-indicator.online {
      background: rgba(0, 255, 157, 0.1);
      color: var(--accent-green);
    }
    .status-indicator.offline {
      background: rgba(255, 77, 77, 0.1);
      color: var(--accent-red);
    }
    .status-indicator.maintenance {
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }
    .usage-bar {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      position: relative;
    }
    .usage-fill {
      height: 100%;
      background: var(--primary-blue);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
    .usage-fill.warning {
      background: #ffc107;
    }
    .usage-fill.critical {
      background: var(--accent-red);
    }
    .usage-bar span {
      position: absolute;
      right: 0;
      top: -1.5rem;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
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
export class ServerTableComponent implements OnChanges {

  @Input() servers: Server[] = [];
  @Input() minimized = false;
  @Input() selectedServerId: number | null = null;
  @Output() serverSelect = new EventEmitter<Server>();

  statusFilter = '';
  locationFilter = '';
  searchQuery = '';
  sortField: keyof Server | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  displayedServers: Server[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servers']) {
      this.updateDisplayedServers();
    }
  }

  get uniqueLocations(): string[] {
    return [...new Set(this.servers.map(s => s.location))];
  }

  onFiltersChange(): void {
    this.updateDisplayedServers();
  }

  toggleSort(field: keyof Server): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.updateDisplayedServers();
  }

  updateDisplayedServers(): void {
    let filtered = this.servers.filter(server => {
      const matchesSearch =
        !this.searchQuery ||
        server.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        server.ip.includes(this.searchQuery);
      const matchesStatus = !this.statusFilter || server.status === this.statusFilter;
      const matchesLocation = !this.locationFilter || server.location === this.locationFilter;
      return matchesSearch && matchesStatus && matchesLocation;
    });

    if (this.sortField) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[this.sortField!] ?? 0;
        const bValue = b[this.sortField!] ?? 0;
        const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return this.sortDirection === 'asc' ? result : -result;
      });
    }

    this.displayedServers = filtered;
  }

  trackByServerId(index: number, server: Server): number {
    return server.id;
  }

  onServerSelect(server: Server): void {
    this.serverSelect.emit(server);
  }
}
