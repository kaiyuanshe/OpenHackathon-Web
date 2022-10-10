import { FormEvent, PureComponent } from 'react';
import { Container } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { WorkEditor } from './WorkEditor';
import activityStore from '../../models/Activity';
import { TeamWorkModel } from '../../models/Team';
import { NextRouter, withRouter } from 'next/router';
class WorkCreate extends PureComponent<{
  router: NextRouter | any;
}> {
  store = activityStore
    .teamOf(this.props.router.query.name)
    .workOf(this.props.router.query.tid);
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
    return (
      <Container>
        <h2 className="text-center">创建作品</h2>
        <WorkEditor onSubmit={this.handleSubmit} />
      </Container>
    );
  }
}

export default withRouter(WorkCreate);
