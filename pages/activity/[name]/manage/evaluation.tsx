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
import { ActivityManageFrame } from '../../../../components/Activity/ActivityManageFrame';
import PageHead from '../../../../components/PageHead';
import { Award } from '../../../../models/Award';

interface State {}
interface EvaluationPageProps {
  activity: string;
  path: string;
  awardList: Award[];
}

export const getServerSideProps = ({
  params: { name } = {},
  req,
}: GetServerSidePropsContext<{ name?: string }>) =>
  !name
    ? {
        notFound: true,
        props: {} as EvaluationPageProps,
      }
    : {
        props: {
          activity: name,
          path: req.url,
        },
      };

class EvaluationPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
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
