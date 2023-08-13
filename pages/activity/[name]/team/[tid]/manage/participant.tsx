import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { compose, RouteProps, router, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';

import {
  TeamManageBaseRouterProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import { TeamParticipantTableLayout } from '../../../../../../components/Team/TeamParticipantTable';
import activityStore from '../../../../../../models/Activity';
import { i18n } from '../../../../../../models/Translation';

export const getServerSideProps = compose<
  TeamManageBaseRouterProps,
  RouteProps<TeamManageBaseRouterProps>
>(router, translator(i18n));

const { t } = i18n;

@observer
export default class TeamParticipantPage extends PureComponent<
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
    );
  }
}
