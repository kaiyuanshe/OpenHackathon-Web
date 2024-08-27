import { TeamMember } from '@kaiyuanshe/openhackathon-service';
import { Avatar } from 'idea-react';

import { XScrollListProps } from '../layout/ScrollList';

export interface TeamMemberListProps extends XScrollListProps<TeamMember> {
  activity: string;
  team: string;
}

export const TeamMemberListLayout = ({
  defaultData = [],
}: Pick<TeamMemberListProps, 'defaultData'>) => (
  <ul className="list-unstyled">
    {defaultData.map(({ user: { id, avatar, name } }) => (
      <li key={id} className="my-3">
        <Avatar className="me-3" size={1} src={avatar} />

        <a href={`/user/${id}`} className="ms-2 text-primary">
          {name}
        </a>
      </li>
    ))}
  </ul>
);
