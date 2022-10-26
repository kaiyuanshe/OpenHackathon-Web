import { t } from 'i18next';

import ActivityCreate from '../../components/ActivityCreate';
import PageHead from '../../components/PageHead';
import { SessionBox } from '../../components/User/SessionBox';

const createActivity = () => (
  <SessionBox auto>
    <PageHead title={t('create_activity')} />

    <ActivityCreate />
  </SessionBox>
);

export default createActivity;
