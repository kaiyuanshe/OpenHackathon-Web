import { TeamMember, TeamMemberStatus } from '@kaiyuanshe/openhackathon-service';
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
import { convertDatetime } from '../../../../../../utils/time';
import { sessionGuard } from '../../../../../api/core';

const StatusName = ({ t }: typeof i18n): Record<TeamMemberStatus, string> => ({
  approved: t('status_approved'),
  pendingApproval: t('status_pending'),
});

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

  @computed
  get columns(): Column<TeamMember>[] {
    const i18n = this.observedContext;
    const { t } = i18n;

    return [
      { key: 'user', renderHead: t('user'), renderBody: ({ user }) => <UserBadge {...user} /> },
      {
        key: 'createdAt',
        renderHead: t('apply_time'),
        renderBody: ({ createdAt }) => convertDatetime(createdAt),
      },
      {
        key: 'role',
        renderHead: t('apply_role'),
        renderBody: ({ role }) => (role === 'admin' ? t('admin') : t('member')),
      },
      { key: 'description', renderHead: t('remark') },
      {
        key: 'status',
        renderHead: t('status'),
        renderBody: ({ status, user: { id } }) => (
          <FormField
            label={t('status')}
            options={Object.entries(StatusName(i18n)).map(([value, label]) => ({ value, label }))}
            defaultValue={status}
            onChange={({ currentTarget: { value } }) =>
              this.store.updateOne({ status: value as TeamMemberStatus }, id)
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
        title={t('team_registration')}
      >
        <RestTable translator={i18n} {...{ store, columns }} />

        {loading && <Loading />}
      </TeamManageFrame>
    );
  }
}
