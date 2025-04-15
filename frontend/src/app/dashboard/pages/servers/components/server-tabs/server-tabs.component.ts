import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorunService, PortInfo, ProcessInfo, Server } from '../../interfaces/server.interface';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { FormatBytesPipe } from '../../../../../pipes/formatBytes/format-bytes.pipe';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-server-tabs',
  standalone: true,
  imports: [CommonModule, FormatBytesPipe, FormsModule],
  template: `
    <div class="server-tabs">
      <div class="tabs-header">
        <button class="tab-button"
                *ngFor="let tab of tabs"
                [class.active]="activeTab === tab.id"
                (click)="setActiveTab(tab.id)">
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content" [ngSwitch]="activeTab">
        <!-- ПРОЦЕССЫ -->
        <div *ngSwitchCase="'processes'" class="processes-tab">
          <div class="controls">
            <input
              type="text"
              class="cyber-input"
              placeholder="🔍 Поиск по имени..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="applyFilters()"
            />

            <select [(ngModel)]="itemsPerPage" class="cyber-select" (change)="applyFilters()">
              <option [ngValue]="10">10</option>
              <option [ngValue]="25">25</option>
              <option [ngValue]="50">50</option>
              <option [ngValue]="100">100</option>
            </select>
          </div>


          <table class="cyber-table">
            <thead>
            <tr>
              <th>PID</th>
              <th>Процесс</th>
              <th (click)="setSort('cpu')" style="cursor:pointer">
                CPU
                <span *ngIf="sortColumn === 'cpu'">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th (click)="setSort('memoryUsage')" style="cursor:pointer">
                RAM
                <span *ngIf="sortColumn === 'memoryUsage'">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </span>
              </th>
              <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let process of visibleProcesses">
            <td>{{ process.pid }}</td>
              <td>{{ process.name }}</td>
              <td>{{ process.cpu }}%</td>
              <td>{{ process.memoryUsage | formatBytes }}</td>
              <td>
                <button (click)="killProcess(process.pid)" class="cyber-button small danger">Завершить</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- АВТОЗАГРУЗКА -->
        <div *ngSwitchCase="'autorun'" class="autorun-tab">
          <div class="controls">
            <input type="text" class="cyber-input" placeholder="🔍 Поиск по службе..." [(ngModel)]="autorunSearch" (ngModelChange)="applyFilters()" />
            <select [(ngModel)]="autorunItemsPerPage" class="cyber-select" (change)="applyFilters()">
              <option [ngValue]="10">10</option>
              <option [ngValue]="25">25</option>
              <option [ngValue]="50">50</option>
              <option [ngValue]="100">100</option>
            </select>
          </div>
          <table class="cyber-table">
            <thead>
            <tr>
              <th>Служба</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let service of visibleAutorunServices">
            <td>{{ service.name }}</td>
              <td>
            <span class="status-badge" [ngClass]="service.enabled ? 'running' : 'stopped'">
              {{ service.enabled ? 'running' : 'stopped' }}
            </span>
              </td>
              <td>
                <button
                  class="cyber-button small"
                  [ngClass]="service.enabled ? 'danger' : 'accent'"
                  (click)="toggleAutorun(service.name)">
                  {{ service.enabled ? 'Остановить' : 'Запустить' }}
                </button>
              </td>

            </tr>
            </tbody>
          </table>
        </div>

        <!-- ТЕРМИНАЛ -->
        <div *ngSwitchCase="'terminal'" class="terminal-tab">
          <div class="terminal-window">
            <div class="terminal-header">
              <span>Terminal</span>
              <button class="cyber-button small">Очистить</button>
            </div>
            <div class="terminal-content">
              <div class="terminal-line">
                <span class="prompt">root&#64;server:~$</span>
                <span class="command">ls -la</span>
              </div>
              <div class="terminal-output">
                total 32
                drwxr-xr-x 5 root root 4096 Feb 20 10:24 .
                drwxr-xr-x 22 root root 4096 Feb 20 10:24 ..
                drwxr-xr-x 3 root root 4096 Feb 20 10:24 etc
                drwxr-xr-x 2 root root 4096 Feb 20 10:24 var
              </div>
              <div class="terminal-input">
                <span class="prompt">root&#64;server:~$</span>
                <input type="text" class="command-input" placeholder="Введите команду..." />
              </div>
            </div>
          </div>
        </div>

        <!-- СЕТЬ -->
        <div *ngSwitchCase="'network'" class="network-tab">
          <div class="network-tools">
            <div class="tool-section">
              <div class="controls">
                <input type="text" class="cyber-input" placeholder="🔍 Поиск по порту/сервису..." [(ngModel)]="portSearch" (ngModelChange)="applyFilters()" />
                <select [(ngModel)]="portItemsPerPage" class="cyber-select" (change)="applyFilters()">
                  <option [ngValue]="10">10</option>
                  <option [ngValue]="25">25</option>
                  <option [ngValue]="50">50</option>
                  <option [ngValue]="100">100</option>
                </select>
              </div>
              <h3>Сетевые порты</h3>
              <table class="cyber-table">
                <thead>
                <tr>
                  <th>Порт</th>
                  <th>Протокол</th>
                  <th>Сервис</th>
                  <th>Состояние</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let port of visiblePorts">
                <td>{{ port.port }}</td>
                  <td>{{ port.protocol }}</td>
                  <td>{{ port.service }}</td>
                  <td>
                <span class="status-badge" [class]="port.state">
                  {{ port.state }}
                </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- ПАКЕТНЫЙ СНИФФЕР (комментарий оставлен) -->
            <!--
            <div class="tool-section">
              <h3>Сниффер пакетов</h3>
              <div class="packet-capture">
                <div class="capture-controls">
                  <button class="cyber-button">⏺️ Начать захват</button>
                  <button class="cyber-button" disabled>⏹️ Остановить</button>
                  <button class="cyber-button">🗑️ Очистить</button>
                </div>
                <div class="packets-list">
                  <table class="cyber-table">
                    <thead>
                    <tr>
                      <th>Время</th>
                      <th>Источник</th>
                      <th>Назначение</th>
                      <th>Протокол</th>
                      <th>Размер</th>
                      <th>Информация</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr *ngFor="let packet of networkPackets">
                      <td>{{ packet.timestamp }}</td>
                      <td>{{ packet.source }}</td>
                      <td>{{ packet.destination }}</td>
                      <td>{{ packet.protocol }}</td>
                      <td>{{ packet.size }} bytes</td>
                      <td>{{ packet.info }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            -->
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .server-tabs { margin-top: 2rem; }
    .tabs-header { display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.5rem; }
    .tab-button { background: none; border: none; color: rgba(255, 255, 255, 0.7); padding: 0.5rem 1rem; cursor: pointer; font-size: 0.9rem; transition: all 0.3s ease; border-radius: 4px; }
    .tab-button:hover { background: rgba(255, 255, 255, 0.1); color: var(--primary-blue); }
    .tab-button.active { background: rgba(0, 243, 255, 0.1); color: var(--primary-blue); }
    .cyber-table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    .cyber-table th, .cyber-table td { padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .cyber-table th { color: rgba(255, 255, 255, 0.7); font-weight: 500; font-size: 0.9rem; }
    .status-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; }
    .status-badge.running { background: rgba(0, 255, 157, 0.1); color: var(--accent-green); }
    .status-badge.stopped { background: rgba(255, 77, 77, 0.1); color: var(--accent-red); }
    .cyber-button.small { padding: 0.25rem 0.5rem; font-size: 0.8rem; }
    .cyber-button.danger { background: rgba(255, 77, 77, 0.1); color: var(--accent-red); }
    .terminal-window { background: var(--darker-bg); border-radius: 8px; overflow: hidden; }
    .terminal-header { background: rgba(255, 255, 255, 0.1); padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; }
    .terminal-content { padding: 1rem; font-family: monospace; font-size: 0.9rem; }
    .terminal-line { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
    .prompt { color: var(--primary-blue); }
    .command { color: #fff; }
    .terminal-output { color: rgba(255, 255, 255, 0.7); margin: 0.5rem 0; white-space: pre-wrap; }
    .terminal-input { display: flex; gap: 0.5rem; align-items: center; }
    .command-input { background: none; border: none; color: #fff; font-family: monospace; font-size: 0.9rem; flex: 1; outline: none; }
    .network-tools { display: flex; flex-direction: column; gap: 2rem; }
    .tool-section { background: var(--card-bg); border-radius: 8px; padding: 1.5rem; }
    .tool-section h3 { margin: 0 0 1.5rem 0; color: #fff; }
    .table-controls { display: flex; justify-content: space-between; align-items: center; margin: 1rem 0; gap: 1rem; }
    .cyber-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem 1rem; color: white; border-radius: 6px; outline: none; }
    .cyber-select { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.5rem 1rem; border-radius: 6px; appearance: none; -webkit-appearance: none; -moz-appearance: none; font-size: 0.9rem; cursor: pointer; }
    .cyber-select:focus { outline: none; border-color: var(--primary-blue); box-shadow: 0 0 0 2px rgba(0, 243, 255, 0.2); }
    .cyber-select option { background-color: #1a1a1a; color: white; font-size: 0.9rem; padding: 0.5rem; border: none; }

  `]
})
export class ServerTabsComponent implements OnInit, OnDestroy {
  @Input() server!: Server;

  activeTab = 'processes';
  tabs = [
    { id: 'processes', label: 'Процессы' },
    { id: 'autorun', label: 'Автозагрузка' },
    { id: 'terminal', label: 'Терминал' },
    { id: 'network', label: 'Сеть' }
  ];

  // Data
  processes: ProcessInfo[] = [];
  autorunServices: AutorunService[] = [];
  ports: PortInfo[] = [];

  // Visible + UI state
  visibleProcesses: ProcessInfo[] = [];
  visibleAutorunServices: AutorunService[] = [];
  visiblePorts: PortInfo[] = [];

  // Filters and state
  searchTerm = '';
  itemsPerPage = 25;
  sortColumn: 'cpu' | 'memoryUsage' | null = null;
  sortDirection: 'asc' | 'desc' = 'desc';

  autorunSearch = '';
  autorunItemsPerPage = 25;

  portSearch = '';
  portItemsPerPage = 25;

  loading = false;
  private subscriptions: { [key: string]: Subscription } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.setActiveTab(this.activeTab);
  }

  ngOnDestroy(): void {
    Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
    this.stopAllIntervals();
    this.loadData(tabId);

    let intervalTime = 0;
    switch (tabId) {
      case 'processes': intervalTime = 5000; break;
      case 'autorun': intervalTime = 30000; break;
      case 'network': intervalTime = 10000; break;
    }

    if (intervalTime) {
      this.subscriptions[tabId] = interval(intervalTime).subscribe(() => this.loadData(tabId));
    }
  }

  private stopAllIntervals() {
    for (let key in this.subscriptions) {
      this.subscriptions[key].unsubscribe();
    }
    this.subscriptions = {};
  }

  private loadData(tab: string) {
    const id = this.server.id;
    this.loading = true;

    const endpointMap: { [key: string]: string } = {
      'processes': 'process',
      'autorun': 'startup',
      'network': 'ports'
    };

    const endpoint = endpointMap[tab];
    if (!endpoint) return;

    this.http.get(`http://localhost:8080/api/agent/${id}/${endpoint}`).subscribe({
      next: (data: any) => {
        switch (tab) {
          case 'processes':
            this.processes = data;
            this.applyProcessFilters();
            break;
          case 'autorun':
            this.autorunServices = data;
            this.applyAutorunFilters();
            break;
          case 'network':
            this.ports = data;
            this.applyPortFilters();
            break;
        }
      },
      error: err => console.error(`❌ Ошибка загрузки ${tab}`, err),
      complete: () => this.loading = false
    });
  }

  // === FILTERS ===

  applyFilters() {
    this.applyProcessFilters();
    this.applyAutorunFilters();
    this.applyPortFilters();
  }

  private applyProcessFilters() {
    const term = this.searchTerm.toLowerCase();
    let filtered = this.processes.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.pid.toString().includes(term)
    );

    if (this.sortColumn) {
      filtered = filtered.sort((a, b) => {
        const aVal = a[this.sortColumn!] ?? 0;
        const bVal = b[this.sortColumn!] ?? 0;
        return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    this.visibleProcesses = filtered.slice(0, this.itemsPerPage);
  }

  private applyAutorunFilters() {
    const term = this.autorunSearch.toLowerCase();
    const filtered = this.autorunServices.filter(s =>
      s.name.toLowerCase().includes(term)
    );
    this.visibleAutorunServices = filtered.slice(0, this.autorunItemsPerPage);
  }

  private applyPortFilters() {
    const term = this.portSearch.toLowerCase();
    const filtered = this.ports.filter(p =>
      p.port.toString().includes(term) ||
      p.service.toLowerCase().includes(term)
    );
    this.visiblePorts = filtered.slice(0, this.portItemsPerPage);
  }

  // === ACTIONS ===

  setSort(column: 'cpu' | 'memoryUsage') {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.applyProcessFilters();
  }

  killProcess(pid: number) {
    const url = `http://localhost:8080/api/agent/${this.server.id}/process_kill/${pid}`;
    this.http.get(url).subscribe({
      next: () => {
        console.log(`✅ Убили процесс ${pid}`);
        this.loadData('processes');
      },
      error: err => console.error(`❌ Ошибка при убийстве процесса ${pid}:`, err)
    });
  }

  toggleAutorun(name: string) {
    const url = `http://localhost:8080/api/agent/${this.server.id}/autorun_toggle/${name}`;

    this.http.get(url, { responseType: 'text' }).subscribe({
      next: () => {
        console.log(`🔁 Переключена автозагрузка: ${name}`);
        this.loadData('autorun');
      },
      error: err => console.error(`❌ Ошибка переключения автозагрузки: ${name}`, err)
    });
  }


}
