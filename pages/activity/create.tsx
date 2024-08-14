import { observer } from 'mobx-react';
import { compose, JWTProps } from 'next-ssr-middleware';
import { FC } from 'react';

import { ActivityEditor } from '../../components/Activity/ActivityEditor';
import { PageHead } from '../../components/layout/PageHead';
import { ServerSessionBox } from '../../components/User/ServerSessionBox';
import { i18n } from '../../models/Base/Translation';
import { githubSigner } from '../api/core';

const { t } = i18n;

export const getServerSideProps = compose<{}, JWTProps>(githubSigner);

const ActivityCreatePage: FC<JWTProps> = observer(props => (
  <ServerSessionBox className="container my-4" {...props}>
    <PageHead title={t('create_activity')} />

    <h2 className="text-center mb-3">{t('create_activity')}</h2>

    <ActivityEditor />
  </ServerSessionBox>
));

export default ActivityCreatePage;
