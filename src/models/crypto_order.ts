export type CryptoOrderStatus = 'completed' | 'pending' | 'failed';

export interface CryptoOrder {
  id: string;
  owner: string;
  groupName: string;
  status?: string
}
