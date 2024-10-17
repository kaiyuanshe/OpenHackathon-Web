import { Team } from '@kaiyuanshe/openhackathon-service';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';
import { FC, PureComponent } from 'react';
import { Col, Row } from 'react-bootstrap';

import { i18n, t } from '../../models/Base/Translation';
import { XScrollListProps } from '../layout/ScrollList';
import { TeamAwardCard } from './TeamAwardCard';

export interface TeamAwardListLayoutProps extends XScrollListProps<Team> {
  onAssign?: (id: Team['id']) => any;
  onDelete?: (id: Team['id']) => any;
}

const TeamAwardListLayout: FC<TeamAwardListLayoutProps> = ({
  defaultData = [],
  onAssign,
}) => (
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

export type TeamAwardListProps = Pick<ScrollListProps<Team>, 'store'> &
  TeamAwardListLayoutProps;

export class TeamAwardList extends PureComponent<TeamAwardListProps> {
  onAssign = (id: number) => {
    this.props.onAssign?.(id);
    this.props.store.getOne(id);
  };

  onDelete = (id: number) => {
    if (!confirm(t('sure_delete_this_work'))) return;

    this.props.onDelete?.(id);
    this.props.store.deleteOne(id);
  };

  render() {
    return (
      <ScrollList
        translator={i18n}
        store={this.props.store}
        renderList={allItems => (
          <TeamAwardListLayout
            defaultData={allItems}
            onAssign={this.onAssign}
            onDelete={this.onDelete}
          />
        )}
      />
    );
  }
}
