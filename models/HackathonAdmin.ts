import { Base } from './Base';
import { User } from './User';

export interface HackathonAdmin
  extends Base,
    Record<'hackathonName' | 'description' | 'userId', string> {
  user: User;
}
