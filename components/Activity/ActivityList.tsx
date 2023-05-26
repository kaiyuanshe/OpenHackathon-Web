import { observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';

import {
  Activity,
  ActivityFilter,
  ActivityListType,
  ActivityModel,
} from '../../models/Activity';
import platformAdmin from '../../models/PlatformAdmin';
import sessionStore from '../../models/Session';
import { i18n } from '../../models/Translation';
import { XScrollList, XScrollListProps } from '../ScrollList';
import { ActivityCard, ActivityCardProps } from './ActivityCard';

const { t } = i18n;

export interface ActivityListProps
  extends XScrollListProps<Activity>,
    Pick<ActivityCardProps, 'onPublish' | 'onDelete'> {
  type?: ActivityListType;
  size?: 'sm' | 'lg';
  userId?: string;
}

export const ActivityListLayout = ({
  size,
  type = 'online',
  defaultData = [],
  userId,
  ...props
}: ActivityListProps) => (
  <Row
    className="g-4"
    xs={1}
    sm={2}
    {...(size === 'sm' ? {} : !size ? { lg: 3, xxl: 4 } : { lg: 4, xxl: 6 })}
  >
    {defaultData.map(item => (
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
export default class ActivityList extends XScrollList<ActivityListProps> {
  store = new ActivityModel();

  filter: ActivityFilter = {
    userId: this.props.userId,
    listType: this.props.type,
  };

  constructor(props: ActivityListProps) {
    super(props);

    this.boot();

    if (props.type === 'admin' && !platformAdmin.isPlatformAdmin)
      platformAdmin.checkAuthorization();
  }

  onPublish = async (name: string) => {
    if (!confirm(t('sure_publish', { name }))) return;

    await this.store.publishOne(name);

    this.props.onPublish?.(name);
  };

  onDelete = async (name: string) => {
    if (!confirm(t('sure_offline', { name }))) return;

    await this.store.deleteOne(name);
    this.props.onDelete?.(name);
  };

  renderList() {
    const { allItems } = this.store;

    return (
      <ActivityListLayout
        {...this.props}
        defaultData={allItems}
        onPublish={this.onPublish}
        onDelete={this.onDelete}
      />
    );
  }
}
