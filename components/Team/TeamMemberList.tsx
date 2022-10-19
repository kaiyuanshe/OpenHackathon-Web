import { observer } from 'mobx-react';
import { Image } from 'react-bootstrap';

import activityStore from '../../models/Activity';
import { TeamMember } from '../../models/Team';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface TeamMemberListProps extends ScrollListProps<TeamMember> {
  activity: string;
  team: string;
}

@observer
export class TeamMemberList extends ScrollList<TeamMemberListProps> {
  store = activityStore.teamOf(this.props.activity).memberOf(this.props.team);

  static Layout = ({ value = [] }: TeamMemberListProps) => (
    <ul className="list-unstyled">
      {value.map(({ userId, user: { photo, nickname } }) => (
        <li key={userId} className="my-3">
          <Image
            src={photo}
            style={{ width: '1rem', height: '1rem' }}
            alt={nickname}
          />
          <a href={`/user/${userId}`} className="ms-2 text-primary">
            {nickname}
          </a>
        </li>
      ))}
    </ul>
  );
}
