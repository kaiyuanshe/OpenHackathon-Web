import { Base } from './Base';
import { User } from './User';

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
