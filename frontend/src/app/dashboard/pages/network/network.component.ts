import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkMapComponent } from './components/network-map/network-map.component';
import { NetworkStatsComponent } from './components/network-stats/network-stats.component';
import { NetworkTableComponent } from './components/network-table/network-table.component';
import { NetworkDetailsComponent } from './components/network-details/network-details.component';
import { NetworkDevice, NetworkStats, NetworkMap } from './interfaces/network.interface';

@Component({
  selector: 'app-network',
  imports: [CommonModule, NetworkMapComponent, NetworkStatsComponent, NetworkTableComponent, NetworkDetailsComponent],
  templateUrl: './network.component.html',
  styleUrl: './network.component.scss'
})
export class NetworkComponent {
  devices: NetworkDevice[] = [
    {
      id: '1',
      name: 'Main Router',
      type: 'router',
      status: 'online',
      ip: '192.168.1.1',
      mac: '00:11:22:33:44:55',
      connectionType: 'wired',
      location: 'Server Room',
      manufacturer: 'Cisco',
      model: 'ISR 4321',
      lastSeen: 'Online',
      connectedTo: ['2', '3', '4'],
      bandwidth: {
        download: 1,
        upload: 1,
        unit: 'Gbps'
      },
      traffic: {
        incoming: 250,
        outgoing: 180,
        unit: 'MB'
      },
      metadata: {
        os: 'IOS XE',
        version: '16.9.3',
        services: ['DHCP', 'DNS', 'NAT'],
        ports: [80, 443, 53]
      }
    },
    {
      id: '2',
      name: 'Core Switch',
      type: 'switch',
      status: 'online',
      ip: '192.168.1.2',
      mac: '00:11:22:33:44:66',
      connectionType: 'wired',
      location: 'Server Room',
      manufacturer: 'Cisco',
      model: 'Catalyst 9300',
      lastSeen: 'Online',
      connectedTo: ['1', '5', '6'],
      bandwidth: {
        download: 10,
        upload: 10,
        unit: 'Gbps'
      },
      traffic: {
        incoming: 800,
        outgoing: 750,
        unit: 'MB'
      },
      metadata: {
        os: 'IOS',
        version: '16.9.3',
        services: ['VLAN', 'STP'],
        ports: [22]
      }
    },
    {
      id: '3',
      name: 'Main Firewall',
      type: 'firewall',
      status: 'online',
      ip: '192.168.1.3',
      mac: '00:11:22:33:44:77',
      connectionType: 'wired',
      location: 'Server Room',
      manufacturer: 'Palo Alto',
      model: 'PA-3260',
      lastSeen: 'Online',
      connectedTo: ['1'],
      bandwidth: {
        download: 5,
        upload: 5,
        unit: 'Gbps'
      },
      traffic: {
        incoming: 1.2,
        outgoing: 0.8,
        unit: 'GB'
      },
      metadata: {
        os: 'PAN-OS',
        version: '10.1.0',
        services: ['IPS', 'VPN', 'NAT'],
        ports: [443, 8443]
      }
    },
    {
      id: '4',
      name: 'Office AP-1',
      type: 'router',
      status: 'online',
      ip: '192.168.1.10',
      mac: '00:11:22:33:44:88',
      connectionType: 'wireless',
      location: 'Office Floor 1',
      manufacturer: 'Ubiquiti',
      model: 'UniFi AP Pro',
      lastSeen: 'Online',
      connectedTo: ['1', '7', '8', '9'],
      bandwidth: {
        download: 867,
        upload: 867,
        unit: 'Mbps'
      },
      traffic: {
        incoming: 120,
        outgoing: 80,
        unit: 'MB'
      },
      metadata: {
        version: '6.0.15',
        services: ['WiFi 6'],
        ports: [80, 443]
      }
    },
    {
      id: '7',
      name: 'Conference TV',
      type: 'iot',
      status: 'online',
      ip: '192.168.1.50',
      mac: '00:11:22:33:44:99',
      connectionType: 'wireless',
      location: 'Conference Room',
      manufacturer: 'Samsung',
      model: 'QN65Q80B',
      lastSeen: '2 minutes ago',
      connectedTo: ['4'],
      bandwidth: {
        download: 100,
        upload: 20,
        unit: 'Mbps'
      },
      traffic: {
        incoming: 50,
        outgoing: 5,
        unit: 'MB'
      },
      metadata: {
        os: 'Tizen',
        version: '6.5',
        services: ['DLNA', 'AirPlay'],
        ports: [80, 443, 8001]
      }
    }
  ];

  networkStats: NetworkStats = {
    total: {
      devices: 15,
      activeDevices: 12,
      bandwidth: {
        total: 10,
        used: 4.5,
        unit: 'Gbps'
      }
    },
    byType: {
      endpoint: 5,
      router: 2,
      switch: 2,
      firewall: 1,
      iot: 3,
      server: 2
    },
    byStatus: {
      online: 12,
      offline: 2,
      warning: 1,
      maintenance: 0
    },
    byLocation: {
      'Server Room': 5,
      'Office Floor 1': 6,
      'Office Floor 2': 4
    },
    alerts: {
      critical: 0,
      warning: 2,
      info: 5
    }
  };

  networkMap: NetworkMap = {
    nodes: this.devices.map(device => ({
      id: device.id,
      label: device.name,
      type: device.type,
      status: device.status
    })),
    edges: this.devices.flatMap(device =>
      device.connectedTo.map(targetId => ({
        id: `${device.id}-${targetId}`,
        source: device.id,
        target: targetId,
        type: device.connectionType,
        status: 'active'
      }))
    )
  };

  selectedDevice: NetworkDevice | null = null;
  isMapFullscreen = false;

  selectDevice(device: NetworkDevice) {
    this.selectedDevice = device;
  }

  closeDetails() {
    this.selectedDevice = null;
  }

  toggleMapFullscreen() {
    this.isMapFullscreen = !this.isMapFullscreen;
  }

  centerMap() {
    // Логика центрирования карты
  }

  refreshMap() {
    // Логика обновления карты
  }
}
