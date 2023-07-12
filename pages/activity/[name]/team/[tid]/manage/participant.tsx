import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';

import {
  TeamManageBaseRouterProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import { TeamParticipantTableLayout } from '../../../../../../components/Team/TeamParticipantTable';
import activityStore from '../../../../../../models/Activity';
import { i18n } from '../../../../../../models/Translation';
import { withRoute, withTranslation } from '../../../../../api/core';

export const getServerSideProps = withRoute<TeamManageBaseRouterProps>(
  withTranslation(),
);

const { t } = i18n;

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
        <ScrollList
          translator={i18n}
          store={store}
          renderList={allItems => (
            <TeamParticipantTableLayout
              defaultData={allItems}
              onApprove={(userId, status) => store.approveOne(userId, status)}
            />
          )}
        />
      </TeamManageFrame>
    );
  }
}
