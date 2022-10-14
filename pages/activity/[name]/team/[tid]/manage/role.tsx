import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { GetServerSidePropsContext } from 'next';
import { PureComponent } from 'react';

import { TeamAdministratorTable } from '../../../../../../components/Team/TeamAdministratorTable';
import { TeamManageFrame } from '../../../../../../components/Team/TeamManageFrame';
import activityStore from '../../../../../../models/Activity';

interface TeamAdministratorPageProps {
  activity: string;
  path: string;
  teamId: string;
}

export const getServerSideProps = ({
  params: { name, tid } = {},
  req,
}: GetServerSidePropsContext<{ name?: string; tid?: string }>) =>
  !name || !tid
    ? {
        notFound: true,
        props: {} as TeamAdministratorPageProps,
      }
    : {
        props: { activity: name, path: req.url, teamId: tid },
      };

@observer
export default class TeamAdministratorPage extends PureComponent<TeamAdministratorPageProps> {
  store = activityStore.teamOf(this.props.activity).memberOf(this.props.teamId);

  @observable
  userId?: string;

  render() {
    const { store } = this;
    const { activity, path, teamId } = this.props;
    return (
      <TeamManageFrame
        name={activity}
        tid={teamId}
        path={path}
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
