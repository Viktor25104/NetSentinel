export type DeviceType = 'endpoint' | 'router' | 'switch' | 'firewall' | 'iot' | 'server';
export type DeviceStatus = 'online' | 'offline' | 'warning' | 'maintenance';
export type ConnectionType = 'wired' | 'wireless';

export interface NetworkDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  ip: string;
  mac: string;
  connectionType: ConnectionType;
  location: string;
  manufacturer: string;
  model: string;
  lastSeen: string;
  connectedTo: string[];
  bandwidth: {
    download: number;
    upload: number;
    unit: 'Mbps' | 'Gbps';
  };
  traffic: {
    incoming: number;
    outgoing: number;
    unit: 'MB' | 'GB';
  };
  metadata: {
    os?: string;
    version?: string;
    services?: string[];
    ports?: number[];
  };
}

export interface NetworkGroup {
  id: string;
  name: string;
  type: 'department' | 'location' | 'custom';
  devices: string[];
  description?: string;
}

export interface NetworkStats {
  total: {
    devices: number;
    activeDevices: number;
    bandwidth: {
      total: number;
      used: number;
      unit: 'Mbps' | 'Gbps';
    };
  };
  byType: {
    [key in DeviceType]: number;
  };
  byStatus: {
    [key in DeviceStatus]: number;
  };
  byLocation: {
    [key: string]: number;
  };
  alerts: {
    critical: number;
    warning: number;
    info: number;
  };
}

export interface NetworkConnection {
  source: string;
  target: string;
  type: ConnectionType;
  status: 'active' | 'inactive' | 'degraded';
  bandwidth: number;
  latency: number;
}

export interface NetworkMap {
  nodes: NetworkMapNode[];
  edges: NetworkMapEdge[];
}

export interface NetworkMapNode {
  id: string;
  label: string;
  type: DeviceType;
  status: DeviceStatus;
  x?: number;
  y?: number;
  group?: string;
}

export interface NetworkMapEdge {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
  status: 'active' | 'inactive' | 'degraded';
}