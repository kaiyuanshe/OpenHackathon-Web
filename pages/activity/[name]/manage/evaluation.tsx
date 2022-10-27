import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { createRef, FormEvent, PureComponent } from 'react';
import {
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  ListGroup,
  Badge,
  Card,
} from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { TeamAwardList } from '../../../../components/Team/TeamAwardList';
import activityStore from '../../../../models/Activity';
import { Award } from '../../../../models/Award';
import { Team } from '../../../../models/Team';
import { withRoute } from '../../../api/core';

interface EvaluationPageProps {
  activity: string;
  path: string;
  awardList: Award[];
}

export const getServerSideProps = withRoute<{ name: string }>();

@observer
class EvaluationPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.teamOf(this.props.route.params!.name);
  awardStore = activityStore.awardOf(this.props.route.params!.name);

  form = createRef<HTMLFormElement>();

  componentDidMount() {
    this.awardStore.getAll();
  }

  renderForm = () => {
    const { allItems } = this.awardStore,
      { id: awardTeamId, displayName: awardTeamName } = this.store.currentOne;

    return (
      <Form
        className="p-3 text-nowrap border"
        ref={this.form}
        onReset={this.handleReset}
        onSubmit={this.handleSubmit}
      >
        <h2>{awardTeamId ? `授予${awardTeamName}` : '全部奖项'}</h2>
        {allItems
          .filter(({ target }) => target === 'team')
          .map(({ id, name, quantity }) =>
            awardTeamId ? (
              <Form.Check
                type="radio"
                className="mx-2 my-3"
                key={id}
                label={name}
              />
            ) : (
              <li key={id} className="list-unstyled mx-2 my-3">
                {name}
              </li>
            ),
          )}
        {awardTeamId && (
          <div className="d-flex justify-content-around my-4">
            <Button type="submit" variant="primary">
              确认
            </Button>
            <Button type="reset" variant="danger">
              取消
            </Button>
          </div>
        )}
      </Form>
    );
  };

  handleAssign = () => {};
  handleReset = () => {
    const { store } = this,
      form = this.form.current;
    form?.reset();
    store.clearCurrent();
  };

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { store } = this,
      form = this.form.current;

    if (!store || !form) return;

    // const data = formToJSON<NewData<Award>>(form);

    // await store.updateOne(data, store.currentOne.id);
    // await store.refreshList();

    store.clearCurrent();
    form.reset();
  };

  onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { search } = formToJSON<{ search: string }>(event.currentTarget);

    this.store.clear();
    return this.store.getList({ search });
  };

  render() {
    const { resolvedUrl, params } = this.props.route;
    return (
      <ActivityManageFrame
        path={resolvedUrl}
        name={params!.name}
        title={`${params!.name}活动管理 作品评奖`}
      >
        <Row xs={1} md={2}>
          <Col md={8} className="ms-2 p-2">
            <Form onSubmit={this.onSearch}>
              <InputGroup>
                <Form.Control
                  id="teamSearch"
                  name="teamSearch"
                  aria-label="search team"
                  type="search"
                  placeholder="团队名称"
                  required
                />
                <Button type="submit">搜索</Button>
              </InputGroup>
            </Form>
            <div className="my-3">
              <TeamAwardList store={this.store} onAssign={this.handleAssign} />
            </div>
          </Col>
          <Col md={3} className="p-2">
            {this.renderForm()}
          </Col>
        </Row>
      </ActivityManageFrame>
    );
  }
}

export default EvaluationPage;
