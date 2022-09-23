import { Base, Media } from './Base';

export interface Award extends Base {
  hackathonName: string;
  name: string;
  description: string;
  quantity: number;
  target: 'team' | 'individual';
  pictures: Media[];
}
