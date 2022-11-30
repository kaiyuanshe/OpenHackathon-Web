import { t } from 'i18next';
import { observer } from 'mobx-react';
import { NewData } from 'mobx-restful';
import { InferGetServerSidePropsType } from 'next';
import { createRef, FormEvent, PureComponent } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { TeamAwardList } from '../../../../components/Team/TeamAwardList';
import activityStore from '../../../../models/Activity';
import { Award, AwardAssignment } from '../../../../models/Award';
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

  handleReset = () => this.store.clearCurrent();

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { awardStore, store } = this,
      form = event.currentTarget,
      data = formToJSON<NewData<AwardAssignment>>(form);

    await awardStore.getOne(data.awardId!);

    const assignmentStore = awardStore.assignmentOf(data.awardId!),
      assigneeId = store.currentOne.id;

    await assignmentStore.updateOne({ assigneeId });
    await store.refreshList();

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
        <h2>{awardTeamId ? `授予 ${awardTeamName}` : '全部奖项'}</h2>
        {allItems.map(
          ({ id, name, quantity, target }) =>
            target === 'team' && (
              <li key={id} className="d-flex mx-2 my-3">
                {awardTeamId ? (
                  <Form.Check
                    type="radio"
                    key={id}
                    label={name}
                    name="awardId"
                    value={id}
                    required
                  />
                ) : (
                  name
                )}
              </li>
            ),
        )}
        {awardTeamId && (
          <div className="d-flex justify-content-around my-4">
            <Button type="submit" variant="primary">
              {t('confirm')}
            </Button>
            <Button type="reset" variant="danger">
              取消
            </Button>
          </div>
        )}
      </Form>
    );
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
                  type="search"
                  id="teamSearch"
                  name="teamSearch"
                  required
                  aria-label="search team"
                  placeholder="团队名称"
                />
                <Button type="submit">搜索</Button>
              </InputGroup>
            </Form>
            <div className="my-3">
              <TeamAwardList store={this.store} />
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
