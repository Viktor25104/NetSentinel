export interface Server {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'maintenance';
  type: string;
  location: string;
  lastPing: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  network: number;
}

export interface Process {
  pid: number;
  name: string;
  cpu: number;
  ram: number;
}

export interface AutorunService {
  name: string;
  status: string;
  type: string;
}

export interface NetworkPacket {
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  size: number;
  info: string;
}

export interface Port {
  number: number;
  protocol: string;
  service: string;
  state: string;
}
