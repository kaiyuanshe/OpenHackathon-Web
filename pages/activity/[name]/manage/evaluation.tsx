import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { FormEvent, PureComponent } from 'react';
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
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import { withRoute } from '../../../api/core';
import { Award } from '../../../../models/Award';
import { formToJSON } from 'web-utility';

import activityStore from '../../../../models/Activity';
import { TeamList } from '../../../../components/Team/TeamList';

interface State {}
interface EvaluationPageProps {
  activity: string;
  path: string;
  awardList: Award[];
}

export const getServerSideProps = withRoute<{ name: string }>();

class EvaluationPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  store = activityStore.teamOf(this.props.route.params!.name);

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
              <TeamList store={this.store} />
            </div>
          </Col>
          <Col md={3} className="p-2">
            <ListGroup as="ol" numbered>
              <ListGroup.Item className="d-flex align-items-center justify-content-between">
                全部奖项
                <Badge bg="secondary">0</Badge>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </ActivityManageFrame>
    );
  }
}

export default EvaluationPage;
