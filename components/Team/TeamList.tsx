import { observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';

import { Team, TeamModel } from '../../models/Team';
import { XScrollList, XScrollListProps } from '../ScrollList';
import { TeamCard } from './TeamCard';

export interface TeamListProps extends XScrollListProps<Team> {
  store: TeamModel;
}

export const TeamListLayout = ({
  defaultData = [],
}: Pick<TeamListProps, 'defaultData'>) => (
  <Row className="g-4" xs={1} md={2} lg={2} xxl={2}>
    {defaultData.map(item => (
      <Col key={item.id}>
        <TeamCard className="h-100" {...item} />
      </Col>
    ))}
  </Row>
);

@observer
export class TeamList extends XScrollList<TeamListProps> {
  store = this.props.store;

  constructor(props: TeamListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return <TeamListLayout defaultData={this.store.allItems} />;
  }
}
