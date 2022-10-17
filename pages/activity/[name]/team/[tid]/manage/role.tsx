import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';

import { TeamAdministratorTable } from '../../../../../../components/Team/TeamAdministratorTable';
import {
  TeamManageBaseRouterProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import activityStore from '../../../../../../models/Activity';
import { withRoute } from '../../../../../api/core';

export interface TeamAdministratorPageProps extends TeamManageBaseRouterProps {}

export const getServerSideProps = withRoute<TeamAdministratorPageProps>();

@observer
export default class TeamAdministratorPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore
    .teamOf(this.props.route.params!.name)
    .memberOf(this.props.route.params!.tid);

  @observable
  userId?: string;

  render() {
    const { store } = this;
    const { resolvedUrl, params } = this.props.route;
    const { name, tid } = params!;

    return (
      <TeamManageFrame
        name={name}
        tid={tid}
        path={resolvedUrl}
        title="角色管理"
      >
        <TeamAdministratorTable
          store={store}
          onPopUpUpdateRoleModal={userId => (this.userId = userId)}
        />
      </TeamManageFrame>
    );
  }
}
