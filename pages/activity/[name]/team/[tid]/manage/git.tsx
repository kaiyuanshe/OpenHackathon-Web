import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FormEvent, PureComponent } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { GitList } from '../../../../../../components/Activity/GitList';
import { TeamManageFrame } from '../../../../../../components/Team/TeamManageFrame';
import { TeamWorkList } from '../../../../../../components/Team/TeamWorkList';
import activityStore from '../../../../../../models/Activity';
import { TeamWorkType } from '../../../../../../models/Team';
import { withRoute } from '../../../../../api/core';

export const getServerSideProps = withRoute<{ name: string; tid: string }>();

@observer
export default class GitPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
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
      { name, tid } = this.props.route.params!;

    await activityStore.teamOf(name).workOf(tid).updateOne({
      type: TeamWorkType.WEBSITE,
      title: full_name,
      url: html_url,
    });
  };

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
          <GitList type="team" store={currentGit} />
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
          <header className="d-flex justify-content-end">
            <Button variant="success" onClick={() => (this.creatorOpen = true)}>
              创建开发环境
            </Button>
          </header>

          <TeamWorkList activity={params!.name} team={params!.tid} />
        </Container>

        {this.renderCreator()}
      </TeamManageFrame>
    );
  }
}
