import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';

import {
  Activity,
  ActivityFilter,
  ActivityListType,
  ActivityModel,
} from '../../models/Activity';
import sessionStore from '../../models/Session';
import { ScrollList, ScrollListProps } from '../ScrollList';
import { ActivityCard, ActivityCardProps } from './ActivityCard';

export interface ActivityListProps
  extends ScrollListProps<Activity>,
    Pick<ActivityCardProps, 'onPublish' | 'onDelete'> {
  type?: ActivityListType;
  size?: 'sm' | 'lg';
  userId?: string;
}

export const ActivityListLayout = ({
  size,
  type = 'online',
  value = [],
  userId,
  ...props
}: ActivityListProps) => (
  <Row
    className="g-4"
    xs={1}
    sm={2}
    {...(size === 'sm' ? {} : !size ? { lg: 3, xxl: 4 } : { lg: 4, xxl: 6 })}
  >
    {value.map(item => (
      <Col key={item.name + item.id}>
        <ActivityCard
          className="h-100"
          controls={
            !!userId &&
            userId === sessionStore.user?.id &&
            (type === 'admin' || type === 'created')
          }
          {...item}
          {...props}
        />
      </Col>
    ))}
  </Row>
);

@observer
export default class ActivityList extends ScrollList<ActivityListProps> {
  store = new ActivityModel();

  filter: ActivityFilter = {
    userId: this.props.userId,
    listType: this.props.type,
  };

  onPublish = async (name: string) => {
    if (!confirm(t('sure_publish', { name }))) return;

    const { type, onPublish } = this.props;

    await this.store.publishOne(name, type !== 'admin');
    onPublish?.(name);
  };

  onDelete = async (name: string) => {
    if (!confirm(t('sure_offline', { name }))) return;

    await this.store.deleteOne(name);
    this.props.onDelete?.(name);
  };

  renderList() {
    return (
      <ActivityListLayout
        {...this.props}
        value={this.store.allItems}
        onPublish={this.onPublish}
        onDelete={this.onDelete}
      />
    );
  }
}
