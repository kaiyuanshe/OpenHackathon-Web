import { User } from './User';
import { Base } from './Base';

export interface Enrollment extends Base {
  hackathonName: string;
  userId: string;
  user: User;
  status: 'approved';
  extensions: [
    {
      name: string;
      value: string;
    },
  ];
}
