import { observer } from 'mobx-react';

import activityStore from '../../models/Activity';
import { TeamWork } from '../../models/Team';
import { ScrollList, ScrollListProps } from '../ScrollList';

export interface TeamWorkProps extends ScrollListProps<TeamWork> {
  activity: string;
  team: string;
  size?: 'sm' | 'lg';
  onDelete?: (id: TeamWork['id']) => any;
}

const TeamWorkLiLayout = ({ value = [] }: TeamWorkProps) => (
  <>
    <ul>
      {value.map(({ updatedAt, id, title, description, type, url }) => (
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
  </>
);

@observer
export class TeamWorkLi extends ScrollList<TeamWorkProps> {
  store = activityStore.teamOf(this.props.activity).workOf(this.props.team);

  renderList() {
    return <TeamWorkLiLayout {...this.props} value={this.store.allItems} />;
  }
}
