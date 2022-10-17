import { observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';

import {
  Activity,
  ActivityFilter,
  ActivityListType,
  ActivityModel,
} from '../../models/Activity';
import { ScrollList, ScrollListProps } from '../ScrollList';
import { ActivityCard, ActivityCardProps } from './ActivityCard';

export interface ActivityListProps
  extends ScrollListProps<Activity>,
    Pick<ActivityCardProps, 'onPublish' | 'onDelete'> {
  type?: ActivityListType;
  size?: 'sm' | 'lg';
  userId?: string;
}

@observer
export default class ActivityList extends ScrollList<ActivityListProps> {
  store = new ActivityModel();

  filter: ActivityFilter = {
    userId: this.props.userId,
    listType: this.props.type,
  };

  extraProps: Partial<ActivityListProps> = {
    onPublish: async name => {
      if (!confirm(`确定让 ${name} 上线？`)) return;

      const { type, onPublish } = this.props;

      await this.store.publishOne(name, type !== 'admin');
      onPublish?.(name);
    },
    onDelete: async name => {
      if (!confirm(`确定让 ${name} 下线？`)) return;

      await this.store.deleteOne(name);
      this.props.onDelete?.(name);
    },
  };

  static Layout = ({
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
        <Col key={item.name}>
          <ActivityCard
            className="h-100"
            controls={!!userId && (type === 'admin' || type === 'created')}
            {...item}
            {...props}
          />
        </Col>
      ))}
    </Row>
  );
}
