import { UserRankView } from 'idea-react';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';

import { TeamModel } from '../../models/Activity/Team';
import { i18n, I18nContext } from '../../models/Base/Translation';

export interface TeamRankProps {
  activityName: string;
  teamStore: TeamModel;
}

@observer
export class TeamRank extends ObservedComponent<TeamRankProps, typeof i18n> {
  static contextType = I18nContext;

  componentDidMount() {
    this.props.teamStore.getAll();
  }

  render() {
    const { t } = this.observedContext,
      { activityName, teamStore } = this.props;
    const { allItems } = teamStore;

    return (
      <UserRankView
        style={{
          // @ts-expect-error remove in React 19
          '--logo-image':
            'url(https://hackathon-api.static.kaiyuanshe.cn/6342619375fa1817e0f56ce1/2022/10/09/logo22.jpg)',
        }}
        title={t('hacker_pavilion')}
        rank={allItems.map(
          ({ id, displayName: name, createdBy: { avatar, email }, score = 0 }) => ({
            id,
            name,
            avatar,
            email,
            score,
          }),
        )}
        linkOf={({ id }) => `/hackathon/${activityName}/team/${id}`}
      />
    );
  }
}
