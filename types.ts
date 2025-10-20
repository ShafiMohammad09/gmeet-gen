
export enum PairingStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  WAITING = 'WAITING',
  PAIRED = 'PAIRED',
  ERROR = 'ERROR'
}

export interface User {
  name: string;
}

export interface PairedInfo {
  partnerName: string;
  meetLink: string;
}
