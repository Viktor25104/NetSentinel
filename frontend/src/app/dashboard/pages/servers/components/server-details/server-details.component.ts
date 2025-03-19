import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Server } from '../../interfaces/server.interface';
import { ServerMetricsComponent } from '../server-metrics/server-metrics.component';
import { ServerTabsComponent } from '../server-tabs/server-tabs.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-server-details',
  standalone: true,
  imports: [CommonModule, ServerMetricsComponent, ServerTabsComponent],
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
    <div class="server-details" *ngIf="server" @slideInOut>
      <div class="details-header">
        <div class="server-info">
          <button class="back-button" (click)="onClose()">←</button>
          <h2>{{ server.name }}</h2>
          <span class="status-indicator" [class]="server.status">
            {{ server.status }}
          </span>
        </div>
        <div class="server-actions">
          <button class="cyber-button warning" [disabled]="server.status === 'offline'">
            <i>🔄</i> Перезагрузить
          </button>
          <button class="cyber-button" [disabled]="server.status === 'offline'">
            <i>⚡</i> Выключить
          </button>
          <button class="cyber-button" [disabled]="server.status !== 'offline'">
            <i>▶️</i> Включить
          </button>
        </div>
      </div>

      <app-server-metrics [server]="server"></app-server-metrics>
      <app-server-tabs [server]="server"></app-server-tabs>
    </div>
  `,
  styles: [`
    .server-details {
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

    .server-info {
      display: flex;
      align-items: center;
      gap: 1rem;
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

    .server-info h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #fff;
    }

    .server-actions {
      display: flex;
      gap: 1rem;
    }

    .cyber-button.warning {
      background: rgba(255, 77, 77, 0.1);
      color: var(--accent-red);
    }

    .cyber-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .details-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .server-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class ServerDetailsComponent {
  @Input() server: Server | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}