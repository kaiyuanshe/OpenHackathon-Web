import { observer } from 'mobx-react';
import { JWTProps } from 'next-ssr-middleware';
import { FC, useContext } from 'react';
import { Container } from 'react-bootstrap';

import { ActivityEditor } from '../../components/Activity/ActivityEditor';
import { PageHead } from '../../components/layout/PageHead';
import { I18nContext } from '../../models/Base/Translation';
import { sessionGuard } from '../api/core';

export const getServerSideProps = sessionGuard;

const ActivityCreatePage: FC<JWTProps> = observer(() => {
  const { t } = useContext(I18nContext);

  return (
    <Container className="my-4">
      <PageHead title={t('create_activity')} />

      <h2 className="text-center mb-3">{t('create_activity')}</h2>

      <ActivityEditor />
    </Container>
  );
});

export default ActivityCreatePage;
