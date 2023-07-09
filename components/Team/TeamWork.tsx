import { observer } from 'mobx-react';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

import activityStore from '../../models/Activity';
import { TeamWork } from '../../models/Team';
import { XScrollList, XScrollListProps } from '../layout/ScrollList';

export interface TeamWorkProps extends XScrollListProps<TeamWork> {
  activity: string;
  team: string;
  size?: 'sm' | 'lg';
  onDelete?: (id: TeamWork['id']) => any;
}

const TeamWorkLiLayout = ({ defaultData = [] }: TeamWorkProps) => (
  <ul>
    {defaultData.map(({ updatedAt, id, title, description, type, url }) => (
      <li key={id} className="list-unstyled">
        <DocViewer
          documents={[{ uri: url }]}
          pluginRenderers={DocViewerRenderers}
          config={{
            header: {
              overrideComponent: () => (
                <>
                  <div>{title}</div>
                  <div>{description}</div>
                  <div>{updatedAt}</div>
                  <div>{type}</div>
                </>
              ),
            },
          }}
        />
      </li>
    ))}
  </ul>
);

@observer
export class TeamWorkLi extends XScrollList<TeamWorkProps> {
  store = activityStore.teamOf(this.props.activity).workOf(this.props.team);

  constructor(props: TeamWorkProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return (
      <TeamWorkLiLayout {...this.props} defaultData={this.store.allItems} />
    );
  }
}
