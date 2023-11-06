import dynamic from 'next/dynamic';
import {
  compose,
  JWTProps,
  jwtVerifier,
  RouteProps,
  router,
} from 'next-ssr-middleware';
import { FC } from 'react';

import { ActivityEditor } from '../../../../components/Activity/ActivityEditor';
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { i18n } from '../../../../models/Base/Translation';

const AuthingGuard = dynamic(
    () => import('../../../../components/User/AuthingGuard'),
    { ssr: false },
  ),
  { t } = i18n;

type ActivityEditPageProps = RouteProps<{ name: string }> & JWTProps;

export const getServerSideProps = compose<
  { name: string },
  ActivityEditPageProps
>(router, jwtVerifier());

const ActivityEditPage: FC<ActivityEditPageProps> = ({
  jwtPayload,
  route: { resolvedUrl, params },
}) =>
  jwtPayload ? (
    <ActivityManageFrame
      name={params!.name}
      path={resolvedUrl}
      title={t('edit_activity')}
    >
      <ActivityEditor name={params!.name} />
    </ActivityManageFrame>
  ) : (
    <AuthingGuard />
  );

export default ActivityEditPage;
