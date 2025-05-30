import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import dynamic from 'next/dynamic';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Button } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../../components/Activity/ActivityManageFrame';
import activityStore from '../../../../../models/Activity';
import { i18n, I18nContext } from '../../../../../models/Base/Translation';
import { sessionGuard } from '../../../../api/core';

const EnrollmentStatisticCharts = dynamic(
  () => import('../../../../../components/Activity/EnrollmentStatistic'),
  { ssr: false },
);

type EnrollmentStatisticPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(router, sessionGuard);

const EnrollmentStatisticPage: FC<EnrollmentStatisticPageProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <ActivityManageFrame
      {...props}
      name={props.route.params!.name}
      path={props.route.resolvedUrl}
      title={t('registration_statistics')}
    >
      <EnrollmentStatisticView {...props} />
    </ActivityManageFrame>
  );
});
export default EnrollmentStatisticPage;

@observer
class EnrollmentStatisticView extends ObservedComponent<EnrollmentStatisticPageProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.enrollmentOf(this.props.route.params!.name);

  render() {
    const { t } = this.observedContext,
      { downloading, allItems, exportURL } = this.store;

    return (
      <>
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
      </>
    );
  }
}
