import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../../components/Activity/ActivityManageFrame';
import { EnrollmentList } from '../../../../../components/Activity/EnrollmentList';
import activityStore from '../../../../../models/Activity';
import { Enrollment } from '../../../../../models/Enrollment';
import { i18n } from '../../../../../models/Translation';

type ParticipantPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<
  { name: string },
  ParticipantPageProps
>(router);

const { t } = i18n;

@observer
export default class ParticipantPage extends PureComponent<ParticipantPageProps> {
  constructor(props: ParticipantPageProps) {
    super(props);
    makeObservable(this);
  }

  store = activityStore.enrollmentOf(this.props.route.params!.name);

  @observable
  extensions?: Enrollment['extensions'] = undefined;

  render() {
    const { resolvedUrl, params } = this.props.route,
      { extensions } = this;
    const activity = params!.name;

    return (
      <ActivityManageFrame
        name={activity}
        path={resolvedUrl}
        title={t('sign_up_user')}
      >
        <header className="d-flex justify-content-end mb-3 px-3">
          <Button variant="success" href={resolvedUrl + '/statistic'}>
            {t('view_statistics')}
          </Button>
        </header>

        <EnrollmentList
          activity={activity}
          onPopUp={extensions => (this.extensions = extensions)}
        />
        <Modal show={!!extensions} onHide={() => (this.extensions = undefined)}>
          <Modal.Header closeButton>
            <Modal.Title>{t('questionnaire')}</Modal.Title>
          </Modal.Header>
          <Modal.Body as="ul">
            {extensions?.map(({ name, value }) => (
              <li key={name}>
                <strong>{name}</strong>
                <div>{value}</div>
              </li>
            ))}
            {extensions?.[0] && t('no_news_yet')}
          </Modal.Body>
        </Modal>
      </ActivityManageFrame>
    );
  }
}
