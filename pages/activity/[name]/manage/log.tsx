import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, router } from 'next-ssr-middleware';
import { PureComponent } from 'react';

import { ActivityLogListLayout } from '../../../../components/Activity/ActivityLogList';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Translation';

export const getServerSideProps = compose(cache(), router<{ name: string }>);

const { t } = i18n;

@observer
export default class LogPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.logOf(this.props.route.params!.name);

  render() {
    const { resolvedUrl, params } = this.props.route;

    return (
      <ActivityManageFrame
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
