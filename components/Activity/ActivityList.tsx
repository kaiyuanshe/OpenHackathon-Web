import { Hackathon } from '@kaiyuanshe/openhackathon-service';
import { ScrollList } from 'mobx-restful-table';
import { FC, PureComponent } from 'react';
import { Col, Row } from 'react-bootstrap';

import { ActivityListType, ActivityModel } from '../../models/Activity';
import { i18n } from '../../models/Base/Translation';
import platformAdmin from '../../models/User/PlatformAdmin';
import sessionStore from '../../models/User/Session';
import { XScrollListProps } from '../layout/ScrollList';
import { ActivityCard, ActivityCardProps } from './ActivityCard';

const { t } = i18n;

export interface ActivityListLayoutProps
  extends XScrollListProps<Hackathon>,
    Pick<ActivityCardProps, 'onPublish' | 'onDelete'> {
  type?: ActivityListType;
  size?: 'sm' | 'lg';
  userId?: number;
}

export const ActivityListLayout: FC<ActivityListLayoutProps> = ({
  size,
  type = 'online',
  defaultData = [],
  userId,
  ...props
}) => (
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

export type ActivityListProps = ActivityListLayoutProps;

export default class ActivityList extends PureComponent<ActivityListProps> {
  store = new ActivityModel();

  componentDidMount() {
    if (this.props.type === 'admin' && !platformAdmin.isPlatformAdmin)
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

  render() {
    const { props } = this;
    const { userId, type } = props;

    return (
      <ScrollList
        translator={i18n}
        store={this.store}
        filter={{ userId, listType: type }}
        renderList={allItems => (
          <ActivityListLayout
            {...props}
            defaultData={allItems}
            onPublish={this.onPublish}
            onDelete={this.onDelete}
          />
        )}
      />
    );
  }
}
