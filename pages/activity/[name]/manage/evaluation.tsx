import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { PureComponent } from 'react';
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
import { ActivityManageFrame } from '../../../../components/ActivityManageFrame';
import PageHead from '../../../../components/PageHead';
import { Award } from '../../../../models/Award';
import { ListData } from '../../../../models/Base';
import { request } from '../../../api/core';
import { withSession } from '../../../api/user/session';

interface State {}
interface EvaluationPageProps {
  activity: string;
  path: string;
  awardList: Award[];
}

export const getServerSideProps = withSession(
  async ({
    params: { name } = {},
    req,
  }: GetServerSidePropsContext<{ name?: string }>) => {
    if (!name)
      return {
        notFound: true,
        props: {} as EvaluationPageProps,
      };

    const { value: awardList } = await request<ListData<Award>>(
      `hackathon/${name}/awards`,
      'GET',
      undefined,
      { req },
    );
    return {
      props: {
        activity: name,
        path: req.url,
        awardList,
      },
    };
  },
);

class EvaluationPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>,
  State
> {
  state: Readonly<State> = {};

  render() {
    const { path, activity } = this.props;
    return (
      <ActivityManageFrame name={activity} path={path}>
        <PageHead title={`${activity}活动管理 作品评奖`} />
        <Row xs={1} md={2}>
          <Col md={8} className="p-2">
            <Form>
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
            <Card></Card>
          </Col>
          <Col md={4} className="p-2">
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
