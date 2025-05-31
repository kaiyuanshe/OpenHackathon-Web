import { TeamMember, TeamMemberRole } from '@kaiyuanshe/openhackathon-service';
import { Loading } from 'idea-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { Column, FormField, RestTable } from 'mobx-restful-table';
import { compose, router } from 'next-ssr-middleware';

import {
  TeamManageBaseParams,
  TeamManageBaseProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import { UserBadge } from '../../../../../../components/User/HackathonAdminList';
import activityStore from '../../../../../../models/Activity';
import { i18n, I18nContext } from '../../../../../../models/Base/Translation';
import sessionStore from '../../../../../../models/User/Session';
import { sessionGuard } from '../../../../../api/core';

const RoleName = ({ t }: typeof i18n) => ({ member: t('member'), admin: t('admin') });

export const getServerSideProps = compose<TeamManageBaseParams>(router, sessionGuard);

@observer
export default class TeamAdministratorPage extends ObservedComponent<
  TeamManageBaseProps,
  typeof i18n
> {
  static contextType = I18nContext;

  store = activityStore
    .teamOf(this.props.route.params!.name)
    .memberOf(+this.props.route.params!.tid);

  @computed
  get columns(): Column<TeamMember>[] {
    const i18n = this.observedContext;
    const { t } = i18n,
      currentUserId = sessionStore?.user?.id;

    return [
      {
        key: 'user',
        renderHead: t('user'),
        renderBody: ({ user }) => <UserBadge {...user} />,
      },
      { key: 'description', renderHead: t('remark') },
      {
        key: 'role',
        renderHead: t('role_type'),
        renderBody: ({ role, user: { id } }) => (
          <FormField
            label={t('role_type')}
            options={Object.entries(RoleName(i18n)).map(([value, label]) => ({ value, label }))}
            defaultValue={role}
            disabled={currentUserId === id}
            onChange={({ currentTarget: { value } }) =>
              this.store.updateOne({ role: value as TeamMemberRole }, id)
            }
          />
        ),
      },
    ];
  }

  render() {
    const { props, store, columns } = this,
      { t } = this.observedContext;
    const { resolvedUrl, params } = props.route,
      { downloading, uploading } = store;
    const { name, tid } = params!,
      loading = downloading > 0 || uploading > 0;

    return (
      <TeamManageFrame
        {...this.props}
        name={name}
        tid={+tid}
        path={resolvedUrl}
        title={t('role_management')}
      >
        <RestTable translator={i18n} {...{ store, columns }} />

        {loading && <Loading />}
      </TeamManageFrame>
    );
  }
}
