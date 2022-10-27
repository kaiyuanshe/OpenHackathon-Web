import { observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';

import { Team, TeamModel } from '../../models/Team';
import { ScrollList, ScrollListProps } from '../ScrollList';
import { TeamAwardCard } from './TeamAwardCard';

export interface TeamAwardListProps extends ScrollListProps<Team> {
  store: TeamModel;
  onAssign?: (id: Team['id']) => any;
  onDelete?: (id: Team['id']) => any;
}

@observer
export class TeamAwardList extends ScrollList<TeamAwardListProps> {
  store = this.props.store;

  extraProps: Partial<TeamAwardListProps> = {
    onAssign: id => {
      this.props.onAssign?.(id);
      this.store.getOne(id);
    },
    onDelete: id => {
      if (!confirm('确定删除该奖项？')) return;

      this.props.onDelete?.(id);
      this.store.deleteOne(id);
    },
  };

  static Layout = ({ value = [], onAssign, onDelete }: TeamAwardListProps) => (
    <Row className="g-4" xs={1} md={2} lg={2} xxl={2}>
      {value.map(item => (
        <Col key={item.id}>
          <TeamAwardCard
            className="h-100"
            {...item}
            onAssign={() => onAssign?.(item.id!)}
          />
        </Col>
      ))}
    </Row>
  );
}
