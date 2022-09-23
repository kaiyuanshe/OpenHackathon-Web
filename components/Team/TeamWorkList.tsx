import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Ratio, Image, Accordion } from 'react-bootstrap';
import { EdgePosition, ScrollBoundary, Loading } from 'idea-react';

import { TeamWork, WorkTypeEnum } from '../../models/Team';
import activityStore from '../../models/Activity';

export interface TeamWorkListProps {
  activity: string;
  team: string;
  value?: TeamWork[];
}

@observer
export class TeamWorkList extends PureComponent<TeamWorkListProps> {
  store = activityStore.teamOf(this.props.activity).workOf(this.props.team);

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

  renderItem = ({ updatedAt, id, title, description, type, url }: TeamWork) => (
    <Accordion.Item eventKey={id!} key={id}>
      <Accordion.Header>
        {title} - {updatedAt ? updatedAt.slice(0, 10) + ' 更新' : ''}
      </Accordion.Header>
      <Accordion.Body>
        <p>{description}</p>
        {type === WorkTypeEnum.IMAGE ? (
          <Image src={url} className="mw-100" alt={title} />
        ) : type === WorkTypeEnum.VIDEO ? (
          <Ratio aspectRatio="16x9">
            <video controls width="250" src={url} />
          </Ratio>
        ) : (
          <a href={url} title={title}>
            {title}
          </a>
        )}
      </Accordion.Body>
    </Accordion.Item>
  );

  render() {
    const { downloading, noMore, allItems } = this.store;

    return (
      <ScrollBoundary onTouch={this.loadMore}>
        {!!downloading && <Loading />}

        <Accordion>{allItems.map(this.renderItem)}</Accordion>

        <footer className="mt-4 text-center text-muted small">
          {noMore || !allItems.length ? '没有更多' : '上拉加载更多……'}
        </footer>
      </ScrollBoundary>
    );
  }
}
