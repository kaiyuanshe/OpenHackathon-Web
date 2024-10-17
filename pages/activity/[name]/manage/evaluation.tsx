import { observer } from 'mobx-react';
import { NewData } from 'mobx-restful';
import { compose, RouteProps, router } from 'next-ssr-middleware';
import { Component, FC, FormEvent } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { TeamAwardList } from '../../../../components/Team/TeamAwardList';
import activityStore from '../../../../models/Activity';
import { AwardAssignment } from '../../../../models/Activity/Award';
import { t } from '../../../../models/Base/Translation';
import { sessionGuard } from '../../../api/core';

type EvaluationPageProps = RouteProps<{ name: string }>;

export const getServerSideProps = compose<{ name: string }>(
  router,
  sessionGuard,
);

const EvaluationPage: FC<EvaluationPageProps> = observer(props => {
  const { resolvedUrl, params } = props.route;

  return (
    <ActivityManageFrame
      {...props}
      path={resolvedUrl}
      name={params!.name}
      title={`${params!.name} ${t('activity_manage')} ${t('works_awards')}`}
    >
      <EvalationEditor {...props} />
    </ActivityManageFrame>
  );
});

export default EvaluationPage;

@observer
class EvalationEditor extends Component<EvaluationPageProps> {
  store = activityStore.teamOf(this.props.route.params!.name);
  awardStore = activityStore.awardOf(this.props.route.params!.name);

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

    const { keywords } = formToJSON<{ keywords: string }>(event.currentTarget);

    this.store.clear();
    return this.store.getList({ keywords });
  };

  renderForm = () => {
    const { allItems } = this.awardStore,
      { id: awardTeamId, displayName: awardTeamName } = this.store.currentOne;

    return (
      <Form
        className="p-3 text-nowrap border sticky-top"
        onReset={this.handleReset}
        onSubmit={this.handleSubmit}
      >
        <h2>
          {awardTeamId ? `${t('grant')} ${awardTeamName}` : t('all_prize')}
        </h2>
        <ul className="list-unstyled">
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
        </ul>
        {awardTeamId && (
          <div className="d-flex justify-content-around my-4">
            <Button type="submit" variant="primary">
              {t('confirm')}
            </Button>
            <Button type="reset" variant="danger">
              {t('cancel')}
            </Button>
          </div>
        )}
      </Form>
    );
  };

  render() {
    return (
      <Row xs={1} md={2}>
        <Col md={8} className="ms-2 p-2">
          <Form onSubmit={this.onSearch}>
            <InputGroup>
              <Form.Control
                type="keywords"
                id="teamSearch"
                name="teamSearch"
                required
                aria-label="search team"
                placeholder={t('team_name')}
              />
              <Button type="submit">{t('search')}</Button>
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
    );
  }
}
