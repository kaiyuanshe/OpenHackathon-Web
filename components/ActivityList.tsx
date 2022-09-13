import { PureComponent } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Loading } from 'idea-react';
import { buildURLData, watchVisible } from 'web-utility';

import { ActivityCard } from './ActivityCard';
import { ListData } from '../models/Base';
import { Activity, ActivityListType } from '../models/Activity';
import { requestClient } from '../pages/api/core';
import { getClientSession } from '../pages/api/user/session';

export interface ActivityListProps {
  type?: ActivityListType;
  size?: 'sm' | 'lg';
  value?: Activity[];
  userId?: string;
}

interface State {
  sessionUserId?: string;
  loading?: boolean;
  nextLink?: string | null;
  list: Activity[];
}

export class ActivityList extends PureComponent<ActivityListProps, State> {
  state: Readonly<State> = {
    list: [],
  };

  async componentDidMount() {
    try {
      const { id } = await getClientSession();

      this.setState({ sessionUserId: id });
    } catch {}
  }

  async nextPage() {
    const { type = 'online', userId } = this.props,
      { loading, nextLink: nextPage, list } = this.state;

    if (loading || nextPage === null) return;

    this.setState({ loading: true });

    try {
      const { nextLink, value } = await requestClient<ListData<Activity>>(
        nextPage ||
          `hackathons?${buildURLData({
            userId,
            listType: type,
            orderby: 'updatedAt',
            top: 6,
          })}`,
      );
      this.setState({
        nextLink,
        list: [...list, ...value],
      });
    } catch {
      this.setState({ nextLink: null });
    } finally {
      this.setState({ loading: false });
    }
  }

  publishOne = async (name: string) => {
    const { list } = this.state;
    const current = list.find(({ name: ID }) => ID === name)!;

    if (!confirm(`确定让 ${current.displayName} 上线？`)) return;

    this.setState({ loading: true });
    try {
      await requestClient(`hackathon/${name}/publish`, 'POST');

      current.status = 'online';

      this.setState({ list: [...list] });
    } finally {
      this.setState({ loading: false });
    }
  };

  deleteOne = async (name: string) => {
    const { list } = this.state;
    const index = list.findIndex(({ name: ID }) => ID === name);

    if (!confirm(`确定让 ${list[index].displayName} 下线？`)) return;

    this.setState({ loading: true });
    try {
      await requestClient(`hackathon/${name}`, 'DELETE');

      this.setState({
        list: [...list.slice(0, index), ...list.slice(index + 1)],
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { type, size, value } = this.props,
      { sessionUserId, loading, nextLink, list } = this.state;

    return (
      <>
        {loading && <Loading />}

        <Row
          className="g-4"
          xs={1}
          sm={2}
          {...(size === 'sm'
            ? {}
            : !size
            ? { lg: 3, xxl: 4 }
            : { lg: 4, xxl: 6 })}
        >
          {(value || list).map(item => (
            <Col key={item.name}>
              <ActivityCard
                className="h-100"
                controls={
                  !!sessionUserId && (type === 'admin' || type === 'created')
                }
                {...item}
                onPublish={this.publishOne}
                onDelete={this.deleteOne}
              />
            </Col>
          ))}
        </Row>

        {!value &&
          (nextLink !== null ? (
            <footer
              className="mt-4 text-center text-muted small"
              ref={node =>
                node && watchVisible(node, show => show && this.nextPage())
              }
            >
              加载更多……
            </footer>
          ) : (
            <footer className="mt-4 text-center text-muted small">
              没有更多
            </footer>
          ))}
      </>
    );
  }
}
