import { Base } from './Base';

export interface Asset {
  name?: string;
  description?: string;
  uri: string;
}

export interface Award extends Base {
  hackathonName: string;
  name: string;
  description: string;
  quantity: number;
  target: 'team' | 'individual';
  pictures: Asset[];
}
