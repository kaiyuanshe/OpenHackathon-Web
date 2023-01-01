import { Container } from 'react-bootstrap';

import { ActivityEditor } from '../../components/ActivityEditor';
import PageHead from '../../components/PageHead';
import { SessionBox } from '../../components/User/SessionBox';
import { i18n } from '../../models/Translation';

const { t } = i18n;

const createActivity = () => (
  <SessionBox auto>
    <PageHead title={t('create_activity')} />

    <Container className="my-4">
      <h2 className="text-center mb-3">{t('create_activity')}</h2>

      <ActivityEditor />
    </Container>
  </SessionBox>
);

export default createActivity;
