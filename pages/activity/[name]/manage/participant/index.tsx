import { Extension } from '@kaiyuanshe/openhackathon-service';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  compose,
  JWTProps,
  jwtVerifier,
  RouteProps,
  router,
} from 'next-ssr-middleware';
import { FC, PureComponent } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../../components/Activity/ActivityManageFrame';
import { EnrollmentList } from '../../../../../components/Activity/EnrollmentList';
import { ServerSessionBox } from '../../../../../components/User/ServerSessionBox';
import activityStore from '../../../../../models/Activity';
import { i18n } from '../../../../../models/Base/Translation';

type ParticipantPageProps = RouteProps<{ name: string }> & JWTProps;

export const getServerSideProps = compose<
  { name: string },
  ParticipantPageProps
>(router, jwtVerifier());

const { t } = i18n;

const ParticipantPage: FC<ParticipantPageProps> = observer(props => (
  <ServerSessionBox {...props}>
    <ActivityManageFrame
      {...props}
      name={props.route.params!.name}
      path={props.route.resolvedUrl}
      title={t('sign_up_user')}
    >
      <ParticipantEditor {...props} />
    </ActivityManageFrame>
  </ServerSessionBox>
));

export default ParticipantPage;

@observer
class ParticipantEditor extends PureComponent<ParticipantPageProps> {
  store = activityStore.enrollmentOf(this.props.route.params!.name);

  @observable
  accessor extensions: Extension[] | undefined;

  render() {
    const { resolvedUrl, params } = this.props.route,
      { extensions } = this;

    return (
      <>
        <header className="d-flex justify-content-end mb-3 px-3">
          <Button variant="success" href={resolvedUrl + '/statistic'}>
            {t('view_statistics')}
          </Button>
        </header>

        <EnrollmentList
          activity={params!.name}
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
      </>
    );
  }
}
