import { FormEvent, PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { WorkEditor } from './WorkEditor';
import activityStore from '../../models/Activity';
import { TeamWorkModel } from '../../models/Team';
import { withRouter } from 'next/router';
class WorkEdit extends PureComponent<work> {
  store: TeamWorkModel;
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const data = formToJSON(event.target as HTMLFormElement);
    await this.store.updateOne(data);
    await this.props.router.push(
      `/activity/${this.props.router.query.name}/team/${this.props.router.query.tid}`,
    );
  };
  render() {
    this.store = activityStore
      .teamOf(this.props.router.query.name)
      .workOf(this.props.router.query.tid);
    return (
      <Container>
        <h2 className="text-center">编辑作品</h2>
        <WorkEditor onSubmit={this.handleSubmit} work={this.props.work} />
      </Container>
    );
  }
}

export default withRouter(WorkEdit);
