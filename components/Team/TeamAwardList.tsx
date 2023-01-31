import { observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';

import { Team, TeamModel } from '../../models/Team';
import { i18n } from '../../models/Translation';
import { XScrollList, XScrollListProps } from '../ScrollList';
import { TeamAwardCard } from './TeamAwardCard';

const { t } = i18n;

export interface TeamAwardListProps extends XScrollListProps<Team> {
  store: TeamModel;
  onAssign?: (id: Team['id']) => any;
  onDelete?: (id: Team['id']) => any;
}

const TeamAwardListLayout = ({
  defaultData = [],
  onAssign,
}: Omit<TeamAwardListProps, 'store'>) => (
  <Row className="g-4" xs={1} md={2} lg={2} xxl={2}>
    {defaultData.map(item => (
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

@observer
export class TeamAwardList extends XScrollList<TeamAwardListProps> {
  store = this.props.store;

  constructor(props: TeamAwardListProps) {
    super(props);

    this.boot();
  }

  onAssign = (id: string) => {
    this.props.onAssign?.(id);
    this.store.getOne(id);
  };

  onDelete = (id: string) => {
    if (!confirm(t('sure_delete_this_work'))) return;

    this.props.onDelete?.(id);
    this.store.deleteOne(id);
  };

  renderList() {
    return (
      <TeamAwardListLayout
        defaultData={this.store.allItems}
        onAssign={this.onAssign}
        onDelete={this.onDelete}
      />
    );
  }
}
