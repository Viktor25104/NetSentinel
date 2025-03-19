import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworkDevice } from '../../interfaces/network.interface';

@Component({
  selector: 'app-network-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './network-table.component.html',
  styleUrl: './network-table.component.scss'
})
export class NetworkTableComponent {
  @Input() devices: NetworkDevice[] = [];
  @Input() minimized = false;
  @Input() selectedDeviceId: string | null = null;
  @Output() deviceSelect = new EventEmitter<NetworkDevice>();

  typeFilter = '';
  statusFilter = '';
  locationFilter = '';
  searchQuery = '';

  get uniqueLocations() {
    return [...new Set(this.devices.map(device => device.location))];
  }

  get filteredDevices() {
    return this.devices.filter(device => {
      const matchesSearch =
        device.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        device.ip.includes(this.searchQuery);
      const matchesType = !this.typeFilter || device.type === this.typeFilter;
      const matchesStatus = !this.statusFilter || device.status === this.statusFilter;
      const matchesLocation = !this.locationFilter || device.location === this.locationFilter;

      return matchesSearch && matchesType && matchesStatus && matchesLocation;
    });
  }

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

  onDeviceSelect(device: NetworkDevice) {
    this.deviceSelect.emit(device);
  }

  onFiltersChange() {
    // Можно добавить дополнительную логику при изменении фильтров
  }
}
