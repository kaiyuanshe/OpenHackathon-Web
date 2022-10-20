import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FormEvent, PureComponent } from 'react';
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Modal,
} from 'react-bootstrap';
import { buildURLData, formToJSON } from 'web-utility';

import {
  GitList,
  GitListProps,
} from '../../../../../../components/Activity/GitList';
import { TeamManageFrame } from '../../../../../../components/Team/TeamManageFrame';
import activityStore from '../../../../../../models/Activity';
import sessionStore from '../../../../../../models/Session';
import { TeamWorkType } from '../../../../../../models/Team';
import { withRoute } from '../../../../../api/core';

export const getServerSideProps = withRoute<{ name: string; tid: string }>();

@observer
export default class GitPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  teamStore = activityStore.teamOf(this.props.route.params!.name);
  memberStore = this.teamStore.memberOf(this.props.route.params!.tid);
  workStore = this.teamStore.workOf(this.props.route.params!.tid);
  workspaceStore = this.teamStore.workspaceOf(this.props.route.params!.tid);

  @observable
  creatorOpen = false;

  handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { template, repository } = formToJSON<{
      template: string;
      repository: string;
    }>(event.currentTarget);

    const { full_name, html_url } =
      await activityStore.currentGit.createOneFrom(template, repository);

    await this.workStore.updateOne({
      type: TeamWorkType.WEBSITE,
      title: full_name,
      url: html_url,
    });
  };

  async handleAuthorization(URI: string) {
    const members = await this.memberStore.getAll();

    for (const {
      user: { id, identities, oAuth },
    } of members) {
      const isGitHub = (identities || []).some(
        ({ provider }) => provider === 'github',
      );
      if (isGitHub && id !== sessionStore.user?.id)
        try {
          const { login } = JSON.parse(oAuth);

          await activityStore.currentGit.addCollaborator(URI, login);
        } catch {}
    }
  }

  renderCreator() {
    const { currentGit } = activityStore;
    const uploading = currentGit.uploading || this.workStore.uploading;

    return (
      <Modal show={this.creatorOpen} onHide={() => (this.creatorOpen = false)}>
        <Modal.Body as="form" onSubmit={this.handleCreate}>
          <div className="d-flex mb-3">
            <Form.Control name="repository" required placeholder="仓库名" />
            <Button
              className="text-nowrap ms-3"
              type="submit"
              disabled={uploading > 0}
            >
              创建
            </Button>
          </div>
          <GitList store={currentGit} />
        </Modal.Body>
      </Modal>
    );
  }

  renderController: GitListProps['renderController'] = ({
    id,
    full_name,
    default_branch,
    html_url,
  }) => (
    <>
      <Button
        variant="danger"
        onClick={() => this.handleAuthorization(full_name)}
      >
        授权全部队友
      </Button>

      <DropdownButton variant="warning" title="即刻云开发">
        <Dropdown.Item target="_blank" href={`https://gitpod.io/#${html_url}`}>
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

  render() {
    const { resolvedUrl, params } = this.props.route;

    return (
      <TeamManageFrame
        path={resolvedUrl}
        name={params!.name + ''}
        tid={params!.tid}
        title="云开发环境"
      >
        <Container fluid>
          <header className="d-flex justify-content-end mb-3">
            <Button variant="success" onClick={() => (this.creatorOpen = true)}>
              创建开发环境
            </Button>
          </header>

          <GitList
            store={this.workspaceStore}
            renderController={this.renderController}
          />
        </Container>

        {this.renderCreator()}
      </TeamManageFrame>
    );
  }
}
