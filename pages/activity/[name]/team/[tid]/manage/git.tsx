import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FormEvent, PureComponent } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { GitList } from '../../../../../../components/Activity/GitList';
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
        await activityStore.currentGit.createOneFrom(template, repository),
      { tid } = this.props.route.params!;

    await this.teamStore.workOf(tid).updateOne({
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

    return (
      <Modal show={this.creatorOpen} onHide={() => (this.creatorOpen = false)}>
        <Modal.Body as="form" onSubmit={this.handleCreate}>
          <div className="d-flex mb-3">
            <Form.Control name="repository" required placeholder="仓库名" />
            <Button className="text-nowrap ms-3" type="submit">
              创建
            </Button>
          </div>
          <GitList store={currentGit} />
        </Modal.Body>
      </Modal>
    );
  }

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
            renderController={({ full_name, html_url }) => (
              <>
                <Button
                  variant="danger"
                  onClick={() => this.handleAuthorization(full_name)}
                >
                  授权全部队友
                </Button>
                <Button
                  variant="warning"
                  target="_blank"
                  href={`https://gitpod.io/#${html_url}`}
                >
                  即刻云开发
                </Button>
              </>
            )}
          />
        </Container>

        {this.renderCreator()}
      </TeamManageFrame>
    );
  }
}
