import { observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';

import { Team, TeamModel } from '../../models/Team';
import { ScrollList, ScrollListProps } from '../ScrollList';
import { TeamCard } from './TeamCard';

export interface TeamListProps extends ScrollListProps<Team> {
  store: TeamModel;
}

@observer
export class TeamList extends ScrollList<TeamListProps> {
  store = this.props.store;

  static Layout = ({ value = [] }: TeamListProps) => (
    <Row className="g-4" xs={1} md={2} lg={2} xxl={2}>
      {value.map(item => (
        <Col key={item.id}>
          <TeamCard className="h-100" {...item} />
        </Col>
      ))}
    </Row>
  );
}
