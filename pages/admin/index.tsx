import { PureComponent } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Loading } from 'idea-react';
import { watchVisible } from 'web-utility';

import PageHead from '../../components/PageHead';
import { ActivityCard } from '../../components/ActivityCard';
import { ListData } from '../../models/Base';
import { Activity } from '../../models/Activity';
import { requestClient } from '../api/core';

interface State {
  loading?: boolean;
  nextLink?: string;
  list: Activity[];
}

export default class AdminPage extends PureComponent<{}, State> {
  state: Readonly<State> = {
    list: [],
  };

  async nextPage() {
    const { loading, nextLink: nextPage, list } = this.state;

    if (loading || nextPage === null) return;

    this.setState({ loading: true });
    try {
      const { nextLink, value } = await requestClient<ListData<Activity>>(
        nextPage || `hackathons?listType=admin&orderby=updatedAt`,
      );
      this.setState({
        nextLink,
        list: [...list, ...value],
      });
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

    if (!confirm(`确定删除 ${list[index].displayName}？`)) return;

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
    const { loading, nextLink, list } = this.state;

    return (
      <Container fluid>
        <PageHead title="平台管理" />

        {loading && <Loading />}

        <Row xs={1} sm={2} md={4} xxl={6} className="g-4">
          {list.map(item => (
            <Col key={item.name}>
              <ActivityCard
                className="h-100"
                controls
                {...item}
                onPublish={this.publishOne}
                onDelete={this.deleteOne}
              />
            </Col>
          ))}
        </Row>

        {nextLink !== null ? (
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
        )}
      </Container>
    );
  }
}
