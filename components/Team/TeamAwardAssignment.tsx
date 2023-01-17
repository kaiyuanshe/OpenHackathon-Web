import { observer } from 'mobx-react';

import activityStore from '../../models/Activity';
import { AwardAssignment } from '../../models/Award';
import { XScrollList, XScrollListProps } from '../ScrollList';

interface AwardAssignmentProps extends XScrollListProps<AwardAssignment> {
  activity: string;
  team: string;
  size?: 'sm' | 'lg';
  onDelete?: (id: AwardAssignment['id']) => any;
}

const TeamAwardAssignmentLayout = ({ value = [] }: AwardAssignmentProps) => (
  <>
    <ol>
      {value.map(({ updatedAt, id, description, award: { name } }) => (
        <li key={id} className="list-unstyled">
          {name}
        </li>
      ))}
    </ol>
  </>
);

@observer
export class TeamAwardAssignmentList extends XScrollList<AwardAssignmentProps> {
  store = activityStore
    .teamOf(this.props.activity)
    .assignmentOf(this.props.team);

  constructor(props: AwardAssignmentProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return (
      <TeamAwardAssignmentLayout
        {...this.props}
        defaultData={this.store.allItems}
      />
    );
  }
}
