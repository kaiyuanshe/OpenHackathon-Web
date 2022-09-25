import { observer } from 'mobx-react';
import { Row, Col } from 'react-bootstrap';

import { ScrollListProps, ScrollList } from '../ScrollList';
import { TeamCard } from './TeamCard';
import { Team } from '../../models/Team';
import activityStore from '../../models/Activity';

export interface TeamListProps extends ScrollListProps<Team> {
  activity: string;
}

@observer
export class TeamList extends ScrollList<TeamListProps> {
  store = activityStore.teamOf(this.props.activity);

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
