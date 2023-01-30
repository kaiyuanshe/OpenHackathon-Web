import { InferGetServerSidePropsType } from 'next';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { ActivityEditor } from '../../../../components/ActivityEditor';
import { i18n } from '../../../../models/Translation';
import { withRoute, withTranslation } from '../../../api/core';

const { t } = i18n;

export const getServerSideProps = withRoute<{ name: string }>(
  withTranslation(),
);

const ActivityEditPage = ({
  route: { resolvedUrl, params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <ActivityManageFrame
    name={params!.name}
    path={resolvedUrl}
    title={t('edit_activity')}
  >
    <ActivityEditor name={params!.name} />
  </ActivityManageFrame>
);

export default ActivityEditPage;
