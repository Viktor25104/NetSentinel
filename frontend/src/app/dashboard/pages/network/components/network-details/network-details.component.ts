import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NetworkDevice } from '../../interfaces/network.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-network-details',
  imports: [CommonModule],
  templateUrl: './network-details.component.html',
  styleUrl: './network-details.component.scss'
})
export class NetworkDetailsComponent {
  @Input() device: NetworkDevice | null = null;
  @Output() close = new EventEmitter<void>();

  getDeviceTypeName(type: string): string {
    const names: { [key: string]: string } = {
      endpoint: 'Конечное устройство',
      router: 'Маршрутизатор',
      switch: 'Коммутатор',
      firewall: 'Файрвол',
      iot: 'IoT устройство',
      server: 'Сервер'
    };
    return names[type] || type;
  }

  getDeviceIcon(type: string): string {
    const icons: { [key: string]: string } = {
      endpoint: '💻',
      router: '🌐',
      switch: '🔌',
      firewall: '🛡️',
      iot: '📱',
      server: '🖥️'
    };
    return icons[type] || '❓';
  }

  getStatusName(status: string): string {
    const names: { [key: string]: string } = {
      online: 'В сети',
      offline: 'Не в сети',
      warning: 'Предупреждение',
      maintenance: 'Обслуживание'
    };
    return names[status] || status;
  }

  getSpeedPercentage(speed: number): number {
    // Предполагаем, что максимальная скорость 1 Gbps
    return (speed / 1000) * 100;
  }

  onClose() {
    this.close.emit();
  }
}
