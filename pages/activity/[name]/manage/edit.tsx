import { InferGetServerSidePropsType } from 'next';
import { Container } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { ActivityEditor } from '../../../../components/ActivityEditor';
import { withRoute } from '../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

const ActivityEditPage = ({
  route: { resolvedUrl, params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <ActivityManageFrame name={params!.name} path={resolvedUrl} title="编辑活动">
    <Container>
      <h2 className="text-center">创建活动</h2>

      <ActivityEditor name={params!.name} />
    </Container>
  </ActivityManageFrame>
);

export default ActivityEditPage;
