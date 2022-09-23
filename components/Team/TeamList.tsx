import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Row, Col } from 'react-bootstrap';
import { EdgePosition, ScrollBoundary, Loading } from 'idea-react';

import { TeamCard } from '../TeamCard';
import { Team } from '../../models/Team';
import activityStore from '../../models/Activity';

export interface TeamListProps {
  activity: string;
  value?: Team[];
}

@observer
export class TeamList extends PureComponent<TeamListProps> {
  store = activityStore.teamOf(this.props.activity);

  async componentDidMount() {
    const { value } = this.props;

    this.store.clear();

    if (value) await this.store.restoreList(value);

    await this.store.getList({}, this.store.pageList.length + 1);
  }

  componentWillUnmount() {
    this.store.clear();
  }

  loadMore = debounce((edge: EdgePosition) => {
    const { store } = this;

    if (edge === 'bottom' && !store.downloading && !store.noMore)
      store.getList();
  });

  render() {
    const { downloading, noMore, allItems } = this.store;

    return (
      <ScrollBoundary onTouch={this.loadMore}>
        {!!downloading && <Loading />}

        <Row className="g-4" xs={1} md={2} lg={2} xxl={2}>
          {allItems.map(item => (
            <Col key={item.id}>
              <TeamCard className="h-100" {...item} />
            </Col>
          ))}
        </Row>

        <footer className="mt-4 text-center text-muted small">
          {noMore || !allItems.length ? '没有更多' : '上拉加载更多……'}
        </footer>
      </ScrollBoundary>
    );
  }
}
