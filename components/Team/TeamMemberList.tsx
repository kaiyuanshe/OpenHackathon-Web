import { Avatar } from 'idea-react';

import { TeamMember } from '../../models/Activity/Team';
import { XScrollListProps } from '../layout/ScrollList';

export interface TeamMemberListProps extends XScrollListProps<TeamMember> {
  activity: string;
  team: string;
}

export const TeamMemberListLayout = ({
  defaultData = [],
}: Pick<TeamMemberListProps, 'defaultData'>) => (
  <ul className="list-unstyled">
    {defaultData.map(({ userId, user: { avatar, name } }) => (
      <li key={userId} className="my-3">
        <Avatar className="me-3" size={1} src={avatar} />

        <a href={`/user/${userId}`} className="ms-2 text-primary">
          {name}
        </a>
      </li>
    ))}
  </ul>
);
