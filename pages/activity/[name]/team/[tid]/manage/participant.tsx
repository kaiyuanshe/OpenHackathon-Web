import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { compose, router, translator } from 'next-ssr-middleware';
import { Component } from 'react';

import {
  TeamManageBaseParams,
  TeamManageBaseProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import { TeamParticipantTableLayout } from '../../../../../../components/Team/TeamParticipantTable';
import activityStore from '../../../../../../models/Activity';
import { i18n, t } from '../../../../../../models/Base/Translation';
import { sessionGuard } from '../../../../../api/core';

export const getServerSideProps = compose<TeamManageBaseParams>(
  router,
  sessionGuard,
  translator(i18n),
);

@observer
export default class TeamParticipantPage extends Component<TeamManageBaseProps> {
  store = activityStore
    .teamOf(this.props.route.params!.name)
    .memberOf(+this.props.route.params!.tid);

  render() {
    const { store } = this;
    const { resolvedUrl, params } = this.props.route;
    const { name, tid } = params!;

    return (
      <TeamManageFrame
        {...this.props}
        name={name}
        tid={+tid}
        path={resolvedUrl}
        title={t('team_registration')}
      >
        <ScrollList
          translator={i18n}
          store={store}
          renderList={allItems => (
            <TeamParticipantTableLayout
              defaultData={allItems}
              onApprove={(userId, status) =>
                store.updateOne({ status }, userId)
              }
            />
          )}
        />
      </TeamManageFrame>
    );
  }
}
