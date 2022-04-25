import { PureComponent } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Form,
  ListGroup,
  Button,
} from 'react-bootstrap';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ActivityManageFrame } from '../../../components/ActivityManageFrame';
import PageHead from '../../../components/PageHead';
import { requestClient } from '../../api/core';

export async function getServerSideProps({
  req,
}: GetServerSidePropsContext<{ url: string }>) {
  return {
    props: {
      path: req.url,
    },
  };
}

class AdministratorPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  componentDidMount() {
    const { path } = this.props;
  }

  render() {
    const { path } = this.props;
    return (
      <>
        <PageHead title="管理页面" />
        <ActivityManageFrame path={path}>
          <Row xs="1" sm="2">
            <Col sm="auto" md="auto" className="">
              <ListGroup>
                <ListGroup.Item>全部用户</ListGroup.Item>
                <ListGroup.Item>管理员</ListGroup.Item>
                <ListGroup.Item>裁判</ListGroup.Item>
              </ListGroup>
              <Col className="d-flex flex-column  ">
                <Button variant="success" className="my-3">
                  <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                  增加
                </Button>
                <Button variant="danger">
                  <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  删除
                </Button>
              </Col>
            </Col>
            <Col className="flex-fill text-center">
              <Table hover bordered>
                <thead>
                  <tr>
                    <th>
                      <Form.Check
                        inline
                        aria-label="selectAll"
                        id="selectAll"
                      />
                    </th>
                    <th>名称</th>
                    <th>邮箱</th>
                    <th>角色类型</th>
                    <th>状态</th>
                    <th>帐户来源</th>
                    <th>最后登录时间</th>
                    <th>创建时间</th>
                    <th>备注</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <th>Lorem</th>
                  </tr>
                  <tr>
                    <th>Lorem</th>
                  </tr>
                  <tr>
                    <th>Lorem</th>
                  </tr>
                  <tr>
                    <th>Lorem</th>
                  </tr>
                  <tr>
                    <th>Lorem</th>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </ActivityManageFrame>
      </>
    );
  }
}

export default AdministratorPage;
