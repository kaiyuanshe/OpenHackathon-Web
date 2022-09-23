import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Image } from 'react-bootstrap';
import { EdgePosition, ScrollBoundary, Loading } from 'idea-react';

import { TeamMember } from '../../models/Team';
import activityStore from '../../models/Activity';

export interface TeamMemberListProps {
  activity: string;
  team: string;
  value?: TeamMember[];
}

@observer
export class TeamMemberList extends PureComponent<TeamMemberListProps> {
  store = activityStore.teamOf(this.props.activity).memberOf(this.props.team);

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

  renderItem = ({ user: { photo, nickname, id } }: TeamMember) => (
    <li key={id} className="my-3">
      <Image
        src={photo}
        style={{ width: '1rem', height: '1rem' }}
        alt={nickname}
      />
      <a href={`/user/${id}`} className="ms-2 text-primary">
        {nickname}
      </a>
    </li>
  );

  render() {
    const { downloading, noMore, allItems } = this.store;

    return (
      <ScrollBoundary onTouch={this.loadMore}>
        {!!downloading && <Loading />}

        <ul className="list-unstyled">{allItems.map(this.renderItem)}</ul>

        <footer className="mt-4 text-center text-muted small">
          {noMore || !allItems.length ? '没有更多' : '上拉加载更多……'}
        </footer>
      </ScrollBoundary>
    );
  }
}
