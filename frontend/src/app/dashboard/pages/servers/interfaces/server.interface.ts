export interface Server {
  id: number;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'maintenance';
  type: string;
  location: string;
  lastPing: string;
  sessionId: string;
  upTime: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  companyId: number;
}

export interface CpuInfoDto {
  name: string;
  physicalCores: number;
  logicalCores: number;
}

export interface RamInfoDto {
  totalBytes: number;
  usedBytes: number;
  freeBytes: number;
  usedPercent: number;
}

export interface DiskInfoDto {
  name: string;
  mount: string;
  type: string;
  totalBytes: number;
  usedBytes: number;
  freeBytes: number;
  usedPercent: number;
}


export interface NetworkInterfaceDto {
  name: string;
  displayName: string;
  bytesSent: number;
  bytesRecv: number;
  speed: number;

  networkLoad?: number;
  incomingTraffic?: number;
  outgoingTraffic?: number;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  sessionName: string;
  sessionId: number;
  memoryUsage: number;
  mem: number | null;
  cpu: number | null;
}

export interface AutorunService {
  name: string;
  location: string;
  enabled: boolean;
}

export interface PortInfo {
  port: number;
  protocol: string;
  service: string;
  state: string;
}
