import { Hackathon } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { cache, compose, RouteProps, router } from 'next-ssr-middleware';
import { Component } from 'react';

import { ActivityLogListLayout } from '../../../../components/Activity/ActivityLogList';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import activityStore, { ActivityModel } from '../../../../models/Activity';
import { i18n } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

interface LogPageProps extends RouteProps<{ name: string }> {
  activity: Hackathon;
}

export const getServerSideProps = compose<{ name: string }>(
  router,
  sessionGuard,
  cache(),
  async ({ params }) => {
    const activity = await new ActivityModel().getOne(params!.name);

    return { props: { activity } as LogPageProps };
  },
);

const { t } = i18n;

@observer
export default class LogPage extends Component<LogPageProps> {
  store = activityStore.logOf(this.props.activity.id);

  render() {
    const { resolvedUrl, params } = this.props.route;

    return (
      <ActivityManageFrame
        {...this.props}
        path={resolvedUrl}
        name={params!.name}
        title={t('log')}
      >
        <ScrollList
          translator={i18n}
          store={this.store}
          renderList={allItems => (
            <ActivityLogListLayout defaultData={allItems} />
          )}
        />
      </ActivityManageFrame>
    );
  }
}
