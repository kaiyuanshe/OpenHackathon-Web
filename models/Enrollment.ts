import { User } from './User';
import { Base } from './Base';

export interface Enrollment extends Base {
  hackathonName: string;
  userId: string;
  user: User;
  status: 'none' | 'pendingApproval' | 'approved' | 'rejected';
  extensions: {
    name: string;
    value: string;
  }[];
}
