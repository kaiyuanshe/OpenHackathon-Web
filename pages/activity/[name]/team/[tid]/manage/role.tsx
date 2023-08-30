import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { compose, RouteProps, router, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';

import { TeamAdministratorTableLayout } from '../../../../../../components/Team/TeamAdministratorTable';
import {
  TeamManageBaseRouterProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import activityStore from '../../../../../../models/Activity';
import { MembershipStatus } from '../../../../../../models/Team';
import { i18n } from '../../../../../../models/Translation';

export const getServerSideProps = compose<
  TeamManageBaseRouterProps,
  RouteProps<TeamManageBaseRouterProps>
>(router, translator(i18n));

const { t } = i18n;

@observer
export default class TeamAdministratorPage extends PureComponent<
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
        title={t('role_management')}
      >
        <ScrollList
          translator={i18n}
          store={store}
          filter={{ status: MembershipStatus.APPROVED }}
          renderList={allItems => (
            <TeamAdministratorTableLayout
              {...this.props}
              defaultData={allItems}
              onUpdateRole={(userId, role) => store.updateRole(userId, role)}
            />
          )}
        />
      </TeamManageFrame>
    );
  }
}
