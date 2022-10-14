import { observer } from 'mobx-react';
import { GetServerSidePropsContext } from 'next';
import { PureComponent } from 'react';

import { TeamManageFrame } from '../../../../../../components/Team/TeamManageFrame';
import { TeamParticipantTable } from '../../../../../../components/Team/TeamParticipantTable';
import activityStore from '../../../../../../models/Activity';

interface TeamParticipantPageProps {
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
        props: {} as TeamParticipantPageProps,
      }
    : {
        props: { activity: name, path: req.url, teamId: tid },
      };

@observer
export default class TeamParticipantPage extends PureComponent<TeamParticipantPageProps> {
  store = activityStore.teamOf(this.props.activity).memberOf(this.props.teamId);

  render() {
    const { store } = this;
    const { activity, path, teamId } = this.props;

    return (
      <TeamManageFrame
        name={activity}
        tid={teamId}
        path={path}
        title="团队报名"
      >
        <TeamParticipantTable store={store} />
      </TeamManageFrame>
    );
  }
}
