import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import { Button, Container } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { GitList } from '../../../../components/Git';
import activityStore from '../../../../models/Activity';
import { withRoute } from '../../../api/core';

export const getServerSideProps = withRoute<{ name: string }>();

export default class ActivityManageGitPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  render() {
    const { resolvedUrl, params } = this.props.route;

    return (
      <ActivityManageFrame
        path={resolvedUrl}
        name={params!.name}
        title="云开发环境"
      >
        <Container fluid>
          <header className="d-flex justify-content-end mb-3">
            <Button variant="success" title="（敬请期待）">
              添加模板仓库
            </Button>
          </header>
          <GitList store={activityStore.currentGit} />
        </Container>
      </ActivityManageFrame>
    );
  }
}
