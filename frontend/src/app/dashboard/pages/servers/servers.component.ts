import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerTableComponent } from './components/server-table/server-table.component';
import { ServerDetailsComponent } from './components/server-details/server-details.component';
import { Server } from './interfaces/server.interface';


@Component({
  selector: 'app-servers',
  imports: [CommonModule, ServerTableComponent, ServerDetailsComponent],
  templateUrl: './servers.component.html',
  styleUrl: './servers.component.scss'
})
export class ServersComponent {
  selectedServer: Server | null = null;

  servers: Server[] = [
    {
      id: '1',
      name: 'Main Server',
      ip: '192.168.1.100',
      status: 'online',
      type: 'Application',
      location: 'Moscow',
      uptime: '45 days',
      cpu: 45,
      ram: 62,
      disk: 78,
      network: 25
    },
    {
      id: '2',
      name: 'Database Server',
      ip: '192.168.1.101',
      status: 'online',
      type: 'Database',
      location: 'Moscow',
      uptime: '30 days',
      cpu: 78,
      ram: 85,
      disk: 92,
      network: 45
    },
    {
      id: '3',
      name: 'Backup Server',
      ip: '192.168.1.102',
      status: 'maintenance',
      type: 'Storage',
      location: 'St. Petersburg',
      uptime: '15 days',
      cpu: 12,
      ram: 45,
      disk: 65,
      network: 15
    },
    {
      id: '4',
      name: 'Load Balancer',
      ip: '192.168.1.103',
      status: 'online',
      type: 'Network',
      location: 'Moscow',
      uptime: '60 days',
      cpu: 35,
      ram: 42,
      disk: 28,
      network: 88
    },
    {
      id: '5',
      name: 'Test Server',
      ip: '192.168.1.104',
      status: 'offline',
      type: 'Development',
      location: 'Kazan',
      uptime: '0 days',
      cpu: 0,
      ram: 0,
      disk: 45,
      network: 0
    }
  ];

  selectServer(server: Server) {
    this.selectedServer = server;
  }

  closeDetails() {
    this.selectedServer = null;
  }
}
