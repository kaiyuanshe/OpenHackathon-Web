import { ScrollListProps } from 'mobx-restful-table';
import { Col, Row } from 'react-bootstrap';

import { Team, TeamModel } from '../../models/Team';
import { TeamCard } from './TeamCard';

export interface TeamListProps extends ScrollListProps<Team> {
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
