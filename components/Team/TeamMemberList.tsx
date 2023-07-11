import { Avatar } from 'idea-react';

import { TeamMember } from '../../models/Team';
import { XScrollListProps } from '../layout/ScrollList';

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
        <Avatar className="me-3" size={1} src={photo} />

        <a href={`/user/${userId}`} className="ms-2 text-primary">
          {nickname}
        </a>
      </li>
    ))}
  </ul>
);
