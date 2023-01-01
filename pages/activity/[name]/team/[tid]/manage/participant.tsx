import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';

import {
  TeamManageBaseRouterProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import { TeamParticipantTable } from '../../../../../../components/Team/TeamParticipantTable';
import activityStore from '../../../../../../models/Activity';
import { withRoute } from '../../../../../api/core';
import { i18n } from '../models/Translation';

export interface TeamParticipantPageProps extends TeamManageBaseRouterProps {}

export const getServerSideProps = withRoute<TeamParticipantPageProps>();

@observer
export default class TeamParticipantPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore
    .teamOf(this.props.route.params!.name)
    .memberOf(this.props.route.params!.tid);

  render() {
    const { store } = this;
    const { resolvedUrl, params } = this.props.route;
    const { name, tid } = params!;

    return (
      <TeamManageFrame
        name={name}
        tid={tid}
        path={resolvedUrl}
        title={t('team_registration')}
      >
        <TeamParticipantTable store={store} />
      </TeamManageFrame>
    );
  }
}
