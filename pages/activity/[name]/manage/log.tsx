import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import {
  compose,
  JWTProps,
  jwtVerifier,
  RouteProps,
  router,
} from 'next-ssr-middleware';
import { PureComponent } from 'react';

import { ActivityLogListLayout } from '../../../../components/Activity/ActivityLogList';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Base/Translation';

type LogPageProps = RouteProps<{ name: string }> & JWTProps;

export const getServerSideProps = compose<{ name: string }, LogPageProps>(
  router,
  jwtVerifier(),
);

const { t } = i18n;

@observer
export default class LogPage extends PureComponent<LogPageProps> {
  store = activityStore.logOf(this.props.route.params!.name);

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
