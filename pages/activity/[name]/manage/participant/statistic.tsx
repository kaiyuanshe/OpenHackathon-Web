import { t } from 'i18next';
import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { PureComponent } from 'react';
import { Button } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../../components/Activity/ActivityManageFrame';
import activityStore from '../../../../../models/Activity';
import { withRoute } from '../../../../api/core';

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
        title={t('registration_statistics')}
      >
        {downloading > 0 && <Loading />}

        <header className="d-flex justify-content-between align-items-center mb-3 px-3">
          <strong className="h4 m-0">
            {t('total_people')}
            {allItems.length}
          </strong>

          <Button variant="success" href={exportURL}>
            {t('export_excel')}
          </Button>
        </header>
        <EnrollmentStatisticCharts store={this.store} />
      </ActivityManageFrame>
    );
  }
}
