import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { compose, jwtVerifier, router, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';

import { TeamAdministratorTableLayout } from '../../../../../../components/Team/TeamAdministratorTable';
import {
  TeamManageBaseParams,
  TeamManageBaseProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import activityStore from '../../../../../../models/Activity';
import { MembershipStatus } from '../../../../../../models/Activity/Team';
import { i18n } from '../../../../../../models/Base/Translation';

export const getServerSideProps = compose<
  TeamManageBaseParams,
  TeamManageBaseProps
>(router, jwtVerifier(), translator(i18n));

const { t } = i18n;

@observer
export default class TeamAdministratorPage extends PureComponent<TeamManageBaseProps> {
  store = activityStore
    .teamOf(this.props.route.params!.name)
    .memberOf(this.props.route.params!.tid);

  render() {
    const { props, store } = this;
    const { resolvedUrl, params } = this.props.route;

    return (
      <TeamManageFrame
        {...this.props}
        {...params!}
        path={resolvedUrl}
        title={t('role_management')}
      >
        <ScrollList
          translator={i18n}
          store={store}
          filter={{ status: MembershipStatus.APPROVED }}
          renderList={allItems => (
            <TeamAdministratorTableLayout
              {...props}
              defaultData={allItems}
              onUpdateRole={(userId, role) => store.updateRole(userId, role)}
            />
          )}
        />
      </TeamManageFrame>
    );
  }
}
