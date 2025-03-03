import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkStats, DeviceType, DeviceStatus } from '../../interfaces/network.interface';

@Component({
  selector: 'app-network-stats',
  imports: [CommonModule],
  templateUrl: './network-stats.component.html',
  styleUrl: './network-stats.component.scss'
})
export class NetworkStatsComponent {
  @Input() stats!: NetworkStats;

  deviceTypes: DeviceType[] = ['endpoint', 'router', 'switch', 'firewall', 'iot', 'server'];
  deviceStatuses: DeviceStatus[] = ['online', 'offline', 'warning', 'maintenance'];

  getDeviceTypeName(type: DeviceType): string {
    const names: Record<DeviceType, string> = {
      endpoint: 'Конечные устройства',
      router: 'Маршрутизаторы',
      switch: 'Коммутаторы',
      firewall: 'Файрволы',
      iot: 'IoT устройства',
      server: 'Серверы'
    };
    return names[type];
  }

  getStatusName(status: DeviceStatus): string {
    const names: Record<DeviceStatus, string> = {
      online: 'В сети',
      offline: 'Не в сети',
      warning: 'Предупреждение',
      maintenance: 'Обслуживание'
    };
    return names[status];
  }
}
