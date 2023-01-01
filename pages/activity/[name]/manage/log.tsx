import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';

import { ActivityLogList } from '../../../../components/Activity/ActivityLogList';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Translation';
import { withRoute } from '../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

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
        <ActivityLogList store={this.store} />
      </ActivityManageFrame>
    );
  }
}
