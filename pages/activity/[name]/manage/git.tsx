import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import { Button, Container } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { GitList } from '../../../../components/Git';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Translation';
import { withRoute, withTranslation } from '../../../api/core';

const { t } = i18n;

export const getServerSideProps = withRoute<{ name: string }>(
  withTranslation(),
);

export default class ActivityManageGitPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  render() {
    const { resolvedUrl, params } = this.props.route;

    return (
      <ActivityManageFrame
        path={resolvedUrl}
        name={params!.name}
        title={t('cloud_development_environment')}
      >
        <Container fluid>
          <header className="d-flex justify-content-end mb-3">
            <Button variant="success" title={t('stay_tuned')}>
              {t('add_template_repository')}
            </Button>
          </header>
          <GitList store={activityStore.currentGit} />
        </Container>
      </ActivityManageFrame>
    );
  }
}
