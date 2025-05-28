import { Answer } from '@kaiyuanshe/openhackathon-service';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../../components/Activity/ActivityManageFrame';
import { EnrollmentList } from '../../../../../components/Activity/EnrollmentList';
import activityStore from '../../../../../models/Activity';
import { i18n, I18nContext } from '../../../../../models/Base/Translation';
import { sessionGuard } from '../../../../api/core';

type ParticipantPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(router, sessionGuard);

const ParticipantPage: FC<ParticipantPageProps> = observer(props => {
  const { t } = useContext(I18nContext);

  return (
    <ActivityManageFrame
      {...props}
      name={props.route.params!.name}
      path={props.route.resolvedUrl}
      title={t('sign_up_user')}
    >
      <ParticipantEditor {...props} />
    </ActivityManageFrame>
  );
});
export default ParticipantPage;

@observer
class ParticipantEditor extends ObservedComponent<ParticipantPageProps, typeof i18n> {
  static contextType = I18nContext;

  store = activityStore.enrollmentOf(this.props.route.params!.name);

  @observable
  accessor answers: Answer[] | undefined;

  render() {
    const { t } = this.observedContext,
      { resolvedUrl, params } = this.props.route,
      { answers } = this;

    return (
      <>
        <header className="d-flex justify-content-end mb-3 px-3">
          <Button variant="success" href={resolvedUrl + '/statistic'}>
            {t('view_statistics')}
          </Button>
        </header>

        <EnrollmentList activity={params!.name} onPopUp={answers => (this.answers = answers)} />

        <Modal show={!!answers} onHide={() => (this.answers = undefined)}>
          <Modal.Header closeButton>
            <Modal.Title>{t('questionnaire')}</Modal.Title>
          </Modal.Header>
          <Modal.Body as="ul">
            {answers?.map(({ title, content }) => (
              <li key={title}>
                <strong>{title}</strong>
                <div>{content}</div>
              </li>
            ))}
            {answers?.[0] && t('no_news_yet')}
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
