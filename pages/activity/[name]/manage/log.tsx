import { Hackathon } from '@kaiyuanshe/openhackathon-service';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { ScrollList } from 'mobx-restful-table';
import { cache, compose, RouteProps, router } from 'next-ssr-middleware';

import { ActivityLogListLayout } from '../../../../components/Activity/ActivityLogList';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import activityStore, { ActivityModel } from '../../../../models/Activity';
import { i18n, I18nContext } from '../../../../models/Base/Translation';
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

@observer
export default class LogPage extends ObservedComponent<LogPageProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.logOf(this.props.activity.id);

  render() {
    const i18n = this.observedContext,
      { resolvedUrl, params } = this.props.route;
    const { t } = i18n;

    return (
      <ActivityManageFrame {...this.props} path={resolvedUrl} name={params!.name} title={t('log')}>
        <ScrollList
          translator={i18n}
          store={this.store}
          renderList={allItems => <ActivityLogListLayout defaultData={allItems} />}
        />
      </ActivityManageFrame>
    );
  }
}
