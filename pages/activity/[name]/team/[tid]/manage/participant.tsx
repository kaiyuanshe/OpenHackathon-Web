import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { compose, jwtVerifier, router, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';

import {
  TeamManageBaseParams,
  TeamManageBaseProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import { TeamParticipantTableLayout } from '../../../../../../components/Team/TeamParticipantTable';
import { ServerSessionBox } from '../../../../../../components/User/ServerSessionBox';
import activityStore from '../../../../../../models/Activity';
import { i18n } from '../../../../../../models/Base/Translation';

export const getServerSideProps = compose<
  TeamManageBaseParams,
  TeamManageBaseProps
>(router, jwtVerifier(), translator(i18n));

const { t } = i18n;

@observer
export default class TeamParticipantPage extends PureComponent<TeamManageBaseProps> {
  store = activityStore
    .teamOf(this.props.route.params!.name)
    .memberOf(this.props.route.params!.tid);

  render() {
    const { store } = this;
    const { resolvedUrl, params } = this.props.route;

    return (
      <ServerSessionBox {...this.props}>
        <TeamManageFrame
          {...this.props}
          {...params!}
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
      </ServerSessionBox>
    );
  }
}
