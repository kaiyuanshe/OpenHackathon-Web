import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
import { Button, Container } from 'react-bootstrap';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { GitList } from '../../../../components/Git';
import { GitModal } from '../../../../components/Git/Modal';
import activityStore from '../../../../models/Activity';
import { i18n } from '../../../../models/Translation';
import { withRoute } from '../../../api/core';

const { t } = i18n;

export const getServerSideProps = withRoute<{ name: string }>();

@observer
export default class ActivityManageGitPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  @observable
  show = false;

  handleReload = () => {
    window.location.reload();
  };

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
            <Button
              variant="success"
              title={t('stay_tuned')}
              onClick={() => (this.show = true)}
            >
              {t('add_template_repository')}
            </Button>
          </header>
          <GitList
            store={activityStore.templateOf(this.props.route.params!.name + '')}
          />
          <GitModal
            name={params!.name}
            show={this.show}
            onHide={() => (this.show = false)}
            onReload={this.handleReload}
          />
        </Container>
      </ActivityManageFrame>
    );
  }
}
