import { Base } from './Base';
import { User } from './User';

export enum WorkTypeEnum {
  'IMAGE' = 'image',
  'WEBSITE' = 'website',
  'VIDEO' = 'video',
  'WORD' = 'word',
  'POWERPOINT' = 'powerpoint',
}

export interface Team extends Base {
  hackathonName: string;
  id: string;
  displayName: string;
  description: string;
  autoApprove: boolean;
  creatorId: string;
  creator: User;
  membersCount: number;
}

export interface TeamWork extends Base {
  teamId: string;
  hackathonName: string;
  title: string;
  description: string;
  type: string;
  url: string;
}

export interface TeamMember extends Omit<Base, 'id'> {
  createdAt: string;
  updatedAt: string;
  hackathonName: string;
  teamId: string;
  userId: string;
  user: User;
  description: string;
  role: string;
  status: string;
}
