import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Server } from '../../interfaces/server.interface';

@Component({
  selector: 'app-server-tabs',
  standalone: true,
  imports: [CommonModule],
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
        <div *ngSwitchCase="'processes'" class="processes-tab">
          <table class="cyber-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Процесс</th>
                <th>CPU</th>
                <th>RAM</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let process of processes">
                <td>{{ process.pid }}</td>
                <td>{{ process.name }}</td>
                <td>{{ process.cpu }}%</td>
                <td>{{ process.ram }}MB</td>
                <td>
                  <button class="cyber-button small danger">Завершить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngSwitchCase="'autorun'" class="autorun-tab">
          <table class="cyber-table">
            <thead>
              <tr>
                <th>Служба</th>
                <th>Статус</th>
                <th>Тип</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let service of autorunServices">
                <td>{{ service.name }}</td>
                <td>
                  <span class="status-badge" [class]="service.status">
                    {{ service.status }}
                  </span>
                </td>
                <td>{{ service.type }}</td>
                <td>
                  <button class="cyber-button small">
                    {{ service.status === 'running' ? 'Остановить' : 'Запустить' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
                drwxr-xr-x  5 root root 4096 Feb 20 10:24 .
                drwxr-xr-x 22 root root 4096 Feb 20 10:24 ..
                drwxr-xr-x  3 root root 4096 Feb 20 10:24 etc
                drwxr-xr-x  2 root root 4096 Feb 20 10:24 var
              </div>
              <div class="terminal-input">
                <span class="prompt">root&#64;server:~$</span>
                <input type="text" class="command-input" placeholder="Введите команду...">
              </div>
            </div>
          </div>
        </div>

        <div *ngSwitchCase="'network'" class="network-tab">
          <div class="network-tools">
            <div class="tool-section">
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
                  <tr *ngFor="let port of ports">
                    <td>{{ port.number }}</td>
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

            <div class="tool-section">
              <h3>Сниффер пакетов</h3>
              <div class="packet-capture">
                <div class="capture-controls">
                  <button class="cyber-button">
                    <i>⏺️</i> Начать захват
                  </button>
                  <button class="cyber-button" disabled>
                    <i>⏹️</i> Остановить
                  </button>
                  <button class="cyber-button">
                    <i>🗑️</i> Очистить
                  </button>
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
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .server-tabs {
      margin-top: 2rem;
    }

    .tabs-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 0.5rem;
    }

    .tab-button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      border-radius: 4px;
    }

    .tab-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary-blue);
    }

    .tab-button.active {
      background: rgba(0, 243, 255, 0.1);
      color: var(--primary-blue);
    }

    .cyber-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }

    .cyber-table th,
    .cyber-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .cyber-table th {
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .status-badge.running {
      background: rgba(0, 255, 157, 0.1);
      color: var(--accent-green);
    }

    .status-badge.stopped {
      background: rgba(255, 77, 77, 0.1);
      color: var(--accent-red);
    }

    .cyber-button.small {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }

    .cyber-button.danger {
      background: rgba(255, 77, 77, 0.1);
      color: var(--accent-red);
    }

    .terminal-window {
      background: var(--darker-bg);
      border-radius: 8px;
      overflow: hidden;
    }

    .terminal-header {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .terminal-content {
      padding: 1rem;
      font-family: monospace;
      font-size: 0.9rem;
    }

    .terminal-line {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .prompt {
      color: var(--primary-blue);
    }

    .command {
      color: #fff;
    }

    .terminal-output {
      color: rgba(255, 255, 255, 0.7);
      margin: 0.5rem 0;
      white-space: pre-wrap;
    }

    .terminal-input {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .command-input {
      background: none;
      border: none;
      color: #fff;
      font-family: monospace;
      font-size: 0.9rem;
      flex: 1;
      outline: none;
    }

    .network-tools {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .tool-section {
      background: var(--card-bg);
      border-radius: 8px;
      padding: 1.5rem;
    }

    .tool-section h3 {
      margin: 0 0 1.5rem 0;
      color: #fff;
    }

    .capture-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .packets-list {
      max-height: 400px;
      overflow-y: auto;
    }
  `]
})
export class ServerTabsComponent {
  @Input() server!: Server;

  activeTab = 'processes';
  
  tabs = [
    { id: 'processes', label: 'Процессы' },
    { id: 'autorun', label: 'Автозагрузка' },
    { id: 'terminal', label: 'Терминал' },
    { id: 'network', label: 'Сеть' }
  ];

  // Демо-данные
  processes = [
    { pid: 1, name: 'systemd', cpu: 0.5, ram: 128 },
    { pid: 854, name: 'nginx', cpu: 2.1, ram: 256 },
    { pid: 1256, name: 'postgres', cpu: 4.5, ram: 512 }
  ];

  autorunServices = [
    { name: 'nginx', status: 'running', type: 'system' },
    { name: 'postgresql', status: 'running', type: 'system' },
    { name: 'redis', status: 'stopped', type: 'system' }
  ];

  ports = [
    { number: 80, protocol: 'TCP', service: 'HTTP', state: 'open' },
    { number: 443, protocol: 'TCP', service: 'HTTPS', state: 'open' },
    { number: 5432, protocol: 'TCP', service: 'PostgreSQL', state: 'open' }
  ];

  networkPackets = [
    {
      timestamp: '10:15:23',
      source: '192.168.1.100',
      destination: '8.8.8.8',
      protocol: 'DNS',
      size: 64,
      info: 'Standard query'
    },
    {
      timestamp: '10:15:24',
      source: '8.8.8.8',
      destination: '192.168.1.100',
      protocol: 'DNS',
      size: 128,
      info: 'Standard query response'
    }
  ];

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }
}