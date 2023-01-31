import { observer } from 'mobx-react';
import { Image } from 'react-bootstrap';

import activityStore from '../../models/Activity';
import { TeamMember } from '../../models/Team';
import { XScrollList, XScrollListProps } from '../ScrollList';

export interface TeamMemberListProps extends XScrollListProps<TeamMember> {
  activity: string;
  team: string;
}

export const TeamMemberListLayout = ({
  defaultData = [],
}: Pick<TeamMemberListProps, 'defaultData'>) => (
  <ul className="list-unstyled">
    {defaultData.map(({ userId, user: { photo, nickname } }) => (
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

@observer
export class TeamMemberList extends XScrollList<TeamMemberListProps> {
  store = activityStore.teamOf(this.props.activity).memberOf(this.props.team);

  constructor(props: TeamMemberListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return <TeamMemberListLayout defaultData={this.store.allItems} />;
  }
}
