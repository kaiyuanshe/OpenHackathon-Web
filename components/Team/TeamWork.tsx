import { FC } from 'react';

import { TeamWork } from '../../models/Team';
import { XScrollListProps } from '../layout/ScrollList';

export interface SimpleTeamWorkListLayoutProps
  extends XScrollListProps<TeamWork> {
  size?: 'sm' | 'lg';
  onDelete?: (id: TeamWork['id']) => any;
}

export const SimpleTeamWorkListLayout: FC<SimpleTeamWorkListLayoutProps> = ({
  defaultData = [],
}) => (
  <ul>
    {defaultData.map(({ updatedAt, id, title, description, type, url }) => (
      <li key={id} className="list-unstyled">
        <a
          className="text-primary text-truncate"
          target="_blank"
          href={url}
          title={description}
          rel="noreferrer"
        >
          {title}
        </a>
      </li>
    ))}
  </ul>
);
