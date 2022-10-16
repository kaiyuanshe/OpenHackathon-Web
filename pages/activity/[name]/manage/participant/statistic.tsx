import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import { Loading } from 'idea-react';

import { ActivityManageFrame } from '../../../../../components/Activity/ActivityManageFrame';
import { withRoute } from '../../../../api/core';
import activityStore from '../../../../../models/Activity';

const EnrollmentStatisticCharts = dynamic(
  () => import('../../../../../components/Activity/EnrollmentStatistic'),
  { ssr: false },
);

export const getServerSideProps = withRoute<{ name: string }>();

@observer
export default class EnrollmentStatisticPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.enrollmentOf(this.props.route.params!.name);

  render() {
    const { resolvedUrl, params } = this.props.route,
      { downloading, allItems, exportURL } = this.store;

    return (
      <ActivityManageFrame
        name={params!.name}
        path={resolvedUrl}
        title="报名统计"
      >
        {downloading > 0 && <Loading />}

        <header className="d-flex justify-content-between align-items-center mb-3 px-3">
          <strong className="h4 m-0">总人数：{allItems.length}</strong>

          <Button variant="success" href={exportURL}>
            导出报名数据为 Excel
          </Button>
        </header>
        <EnrollmentStatisticCharts store={this.store} />
      </ActivityManageFrame>
    );
  }
}
