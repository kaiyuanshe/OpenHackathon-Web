import { TeamMemberStatus } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { compose, jwtVerifier, router, translator } from 'next-ssr-middleware';
import { Component } from 'react';

import { TeamAdministratorTableLayout } from '../../../../../../components/Team/TeamAdministratorTable';
import {
  TeamManageBaseParams,
  TeamManageBaseProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import { ServerSessionBox } from '../../../../../../components/User/ServerSessionBox';
import activityStore from '../../../../../../models/Activity';
import { i18n } from '../../../../../../models/Base/Translation';

export const getServerSideProps = compose<
  TeamManageBaseParams,
  TeamManageBaseProps
>(router, jwtVerifier(), translator(i18n));

const { t } = i18n;

@observer
export default class TeamAdministratorPage extends Component<TeamManageBaseProps> {
  store = activityStore
    .teamOf(this.props.route.params!.name)
    .memberOf(+this.props.route.params!.tid);

  render() {
    const { props, store } = this;
    const { resolvedUrl, params } = this.props.route;
    const { name, tid } = params!;

    return (
      <ServerSessionBox {...this.props}>
        <TeamManageFrame
          {...this.props}
          name={name}
          tid={+tid}
          path={resolvedUrl}
          title={t('role_management')}
        >
          <ScrollList
            translator={i18n}
            store={store}
            filter={{ status: 'approved' as TeamMemberStatus.Approved }}
            renderList={allItems => (
              <TeamAdministratorTableLayout
                {...props}
                defaultData={allItems}
                onUpdateRole={(userId, role) =>
                  store.updateOne({ role }, userId)
                }
              />
            )}
          />
        </TeamManageFrame>
      </ServerSessionBox>
    );
  }
}
