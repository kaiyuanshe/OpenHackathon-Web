import { FC } from 'react';

import { AwardAssignment } from '../../models/Award';
import { XScrollListProps } from '../layout/ScrollList';

export interface TeamAwardAssignmentLayoutProps
  extends XScrollListProps<AwardAssignment> {
  size?: 'sm' | 'lg';
  onDelete?: (id: AwardAssignment['id']) => any;
}

export const TeamAwardAssignmentLayout: FC<TeamAwardAssignmentLayoutProps> = ({
  defaultData = [],
}) => (
  <>
    <ol>
      {defaultData.map(({ updatedAt, id, description, award: { name } }) => (
        <li key={id} className="list-unstyled">
          {name}
        </li>
      ))}
    </ol>
  </>
);
