import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { ScrollList } from 'mobx-restful-table';
import { compose, router } from 'next-ssr-middleware';

import {
  TeamManageBaseParams,
  TeamManageBaseProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import { TeamParticipantTableLayout } from '../../../../../../components/Team/TeamParticipantTable';
import activityStore from '../../../../../../models/Activity';
import { i18n, I18nContext } from '../../../../../../models/Base/Translation';
import { sessionGuard } from '../../../../../api/core';

export const getServerSideProps = compose<TeamManageBaseParams>(router, sessionGuard);

@observer
export default class TeamParticipantPage extends ObservedComponent<
  TeamManageBaseProps,
  typeof i18n
> {
  static contextType = I18nContext;

  store = activityStore
    .teamOf(this.props.route.params!.name)
    .memberOf(+this.props.route.params!.tid);

  render() {
    const { store } = this,
      { t } = this.observedContext;
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
              onApprove={(userId, status) => store.updateOne({ status }, userId)}
            />
          )}
        />
      </TeamManageFrame>
    );
  }
}
