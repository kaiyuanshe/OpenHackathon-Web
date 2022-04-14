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
  nextLink?: string | null;
  list: Activity[];
}

export default class ListPage extends PureComponent<{}, State> {
  state: Readonly<State> = {
    list: [],
  };

  async nextPage() {
    const { loading, nextLink: nextPage, list } = this.state;

    if (loading || nextPage === null) return;

    this.setState({ loading: true });
    try {
      const { nextLink, value } = await requestClient<ListData<Activity>>(
        nextPage || `hackathons?top=10`,
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

  render() {
    const { loading, nextLink, list } = this.state;

    return (
      <Container>
        <PageHead title="更多活动" />

        {loading && <Loading />}
        <h2 className="text-center mb-3">热门活动</h2>
        <Row xs={1} sm={2} lg={3} className="g-4">
          {list.map(item => (
            <Col key={item.name}>
              <ActivityCard className="h-100" {...item} />
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
