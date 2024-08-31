import { TeamWorkType } from '@kaiyuanshe/openhackathon-service';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { compose, jwtVerifier, router, translator } from 'next-ssr-middleware';
import { Component, FC, FormEvent } from 'react';
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Modal,
} from 'react-bootstrap';
import { buildURLData, formToJSON } from 'web-utility';

import { GitListLayout } from '../../../../../../components/Git/List';
import {
  TeamGitListLayout,
  TeamGitListLayoutProps,
} from '../../../../../../components/Git/TeamGitList';
import {
  TeamManageBaseParams,
  TeamManageBaseProps,
  TeamManageFrame,
} from '../../../../../../components/Team/TeamManageFrame';
import { ServerSessionBox } from '../../../../../../components/User/ServerSessionBox';
import activityStore from '../../../../../../models/Activity';
import { i18n } from '../../../../../../models/Base/Translation';
import sessionStore from '../../../../../../models/User/Session';

export const getServerSideProps = compose<
  TeamManageBaseParams,
  TeamManageBaseProps
>(router, jwtVerifier(), translator(i18n));

const { t } = i18n;

const GitPage: FC<TeamManageBaseProps> = observer(props => {
  const { name, tid } = props.route.params!;

  return (
    <ServerSessionBox {...props}>
      <TeamManageFrame
        {...props}
        name={name}
        tid={+tid}
        path={props.route.resolvedUrl}
        title={t('cloud_development_environment')}
      >
        <GitView {...props} />
      </TeamManageFrame>
    </ServerSessionBox>
  );
});

export default GitPage;

@observer
class GitView extends Component<TeamManageBaseProps> {
  teamStore = activityStore.teamOf(this.props.route.params!.name);
  gitTemplateStore = activityStore.templateOf(this.props.route.params!.name);
  memberStore = this.teamStore.memberOf(+this.props.route.params!.tid);
  workStore = this.teamStore.workOf(+this.props.route.params!.tid);
  workspaceStore = this.teamStore.workspaceOf(+this.props.route.params!.tid);

  @observable
  accessor creatorOpen = false;

  handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { template, repository } = formToJSON<{
      template: string;
      repository: string;
    }>(event.currentTarget);

    const { full_name, html_url } =
      await activityStore.currentTemplate!.createOneFrom(template, repository);

    await this.workStore.updateOne({
      type: 'website' as TeamWorkType.Website,
      title: full_name,
      url: html_url,
    });
    this.workspaceStore.refreshList();
    this.creatorOpen = false;
  };

  async handleAuthorization(URI: string) {
    const members = await this.memberStore.getAll();

    for (const { user } of members)
      if (user.id !== sessionStore.user?.id)
        try {
          await activityStore.currentTemplate!.addCollaborator(URI, user.name);
        } catch {}
  }

  renderCreator() {
    const { currentTemplate } = activityStore;
    const uploading = currentTemplate!.uploading || this.workStore.uploading;

    return (
      <Modal show={this.creatorOpen} onHide={() => (this.creatorOpen = false)}>
        <Modal.Body as="form" onSubmit={this.handleCreate}>
          <div className="d-flex mb-3">
            <Form.Control
              name="repository"
              required
              placeholder={t('repository_name')}
            />
            <Button
              className="text-nowrap ms-3"
              type="submit"
              disabled={uploading > 0}
            >
              {t('create')}
            </Button>
          </div>
          <ScrollList
            translator={i18n}
            store={this.gitTemplateStore}
            renderList={allItems => <GitListLayout defaultData={allItems} />}
          />
        </Modal.Body>
      </Modal>
    );
  }

  renderController: TeamGitListLayoutProps['renderController'] = ({
    id,
    name,
    default_branch,
    html_url,
  }) => {
    const { github } = sessionStore.metaOAuth;

    return (
      <>
        <Button
          variant="danger"
          disabled={!github}
          onClick={() => this.handleAuthorization(name!)}
        >
          {t('authorize_all_teammates')}
          {github ? '' : t('please_use_github_login')}
        </Button>

        <DropdownButton
          variant="warning"
          title={t('instant_cloud_development')}
        >
          <Dropdown.Item
            target="_blank"
            href={`https://gitpod.io/#${html_url}`}
          >
            GitPod
          </Dropdown.Item>
          <Dropdown.Item
            target="_blank"
            href={`https://github.com/codespaces/new?${buildURLData({
              hide_repo_select: true,
              repo: id,
              ref: default_branch,
            })}`}
          >
            GitHub codespaces
          </Dropdown.Item>
        </DropdownButton>
      </>
    );
  };

  render() {
    const { github } = sessionStore.metaOAuth;

    return (
      <Container fluid>
        <header className="d-flex justify-content-end mb-3">
          <Button
            variant="success"
            disabled={!github}
            onClick={() => (this.creatorOpen = true)}
          >
            {t('create_cloud_environment')}
            {github ? '' : t('please_use_github_login')}
          </Button>
        </header>

        <ScrollList
          translator={i18n}
          store={this.workspaceStore}
          renderList={allItems => (
            <TeamGitListLayout
              defaultData={allItems.map(({ gitRepository }) => gitRepository!)}
              renderController={this.renderController}
            />
          )}
        />
        {this.renderCreator()}
      </Container>
    );
  }
}
