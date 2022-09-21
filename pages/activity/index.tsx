import { debounce } from 'lodash';
import { InferGetServerSidePropsType } from 'next';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { EdgePosition, ScrollBoundary } from 'idea-react';

import PageHead from '../../components/PageHead';
import { ActivityCard } from '../../components/ActivityCard';
import activityStore from '../../models/Activity';

export async function getServerSideProps() {
  const firstScreenList = await activityStore.getList({}, 1, 12);

  return { props: { firstScreenList } };
}

@observer
export default class ListPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  async componentDidMount() {
    await activityStore.restoreList(this.props.firstScreenList);

    await activityStore.getList({}, activityStore.pageList.length + 1);
  }

  componentWillUnmount() {
    activityStore.clear();
  }

  loadMore = debounce(
    (edge: EdgePosition) =>
      edge === 'bottom' && !activityStore.noMore && activityStore.getList(),
  );

  render() {
    const { allItems } = activityStore;

    return (
      <Container>
        <PageHead title="热门活动" />

        <h2 className="text-center my-5">热门活动</h2>

        <ScrollBoundary onTouch={this.loadMore}>
          <Row xs={1} sm={2} lg={4}>
            {allItems.map(item => (
              <Col className="mb-3" key={item.name}>
                <ActivityCard className="h-100" {...item} />
              </Col>
            ))}
          </Row>
        </ScrollBoundary>
      </Container>
    );
  }
}
