import { Loading } from 'idea-react';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import {
  compose,
  JWTProps,
  jwtVerifier,
  RouteProps,
  router,
} from 'next-ssr-middleware';
import { FC, PureComponent } from 'react';
import { Button } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../../components/Activity/ActivityManageFrame';
import { ServerSessionBox } from '../../../../../components/User/ServerSessionBox';
import activityStore from '../../../../../models/Activity';
import { i18n } from '../../../../../models/Base/Translation';

const { t } = i18n;

const EnrollmentStatisticCharts = dynamic(
  () => import('../../../../../components/Activity/EnrollmentStatistic'),
  { ssr: false },
);

type EnrollmentStatisticPageProps = RouteProps<{ name: string }> & JWTProps;

export const getServerSideProps = compose<
  { name: string },
  EnrollmentStatisticPageProps
>(router, jwtVerifier());

const EnrollmentStatisticPage: FC<EnrollmentStatisticPageProps> = observer(
  props => (
    <ServerSessionBox>
      <ActivityManageFrame
        {...props}
        name={props.route.params!.name}
        path={props.route.resolvedUrl}
        title={t('registration_statistics')}
      >
        <EnrollmentStatisticView {...props} />
      </ActivityManageFrame>
    </ServerSessionBox>
  ),
);
export default EnrollmentStatisticPage;

@observer
class EnrollmentStatisticView extends PureComponent<EnrollmentStatisticPageProps> {
  store = activityStore.enrollmentOf(this.props.route.params!.name);

  render() {
    const { downloading, allItems, exportURL } = this.store;

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
