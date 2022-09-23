import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Row, Col } from 'react-bootstrap';
import { EdgePosition, ScrollBoundary, Loading } from 'idea-react';

import { ActivityCardProps, ActivityCard } from './ActivityCard';
import {
  ActivityListType,
  Activity,
  ActivityFilter,
  ActivityModel,
} from '../../models/Activity';
import sessionStore from '../../models/Session';

export interface ActivityListProps {
  type?: ActivityListType;
  size?: 'sm' | 'lg';
  value?: Activity[];
  userId?: string;
}

export type ActivityListLayoutProps = ActivityListProps &
  Pick<ActivityCardProps, 'onPublish' | 'onDelete'>;

@observer
export class ActivityList extends PureComponent<ActivityListProps> {
  store = new ActivityModel();

  filter: ActivityFilter = {
    userId: this.props.userId,
    listType: this.props.type,
  };

  async componentDidMount() {
    const { value } = this.props;

    this.store.clear();

    if (value) await this.store.restoreList(value);

    await this.store.getList(this.filter, this.store.pageList.length + 1);
  }

  componentWillUnmount() {
    this.store.clear();
  }

  loadMore = debounce((edge: EdgePosition) => {
    const { store, filter } = this;

    if (edge === 'bottom' && !store.downloading && !store.noMore)
      store.getList(filter);
  });

  static Layout = ({
    size,
    type = 'online',
    value = [],
    userId,
    ...props
  }: ActivityListLayoutProps) => (
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

  render() {
    const { type, size } = this.props,
      { downloading, noMore, allItems } = this.store,
      { user } = sessionStore;

    return (
      <ScrollBoundary onTouch={this.loadMore}>
        {!!downloading && <Loading />}

        <ActivityList.Layout
          {...{ type, size }}
          value={allItems}
          userId={user?.id}
          onPublish={name =>
            confirm(`确定让 ${name} 上线？`) && this.store.publishOne(name)
          }
          onDelete={name =>
            confirm(`确定让 ${name} 下线？`) && this.store.deleteOne(name)
          }
        />
        <footer className="mt-4 text-center text-muted small">
          {noMore || !allItems.length ? '没有更多' : '上拉加载更多……'}
        </footer>
      </ScrollBoundary>
    );
  }
}
